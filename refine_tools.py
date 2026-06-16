#!/usr/bin/env python3
"""Refine short tool entries via Qwen API using field-by-field replacement."""
import json
import re
import sys
import os

sys.path.insert(0, '/home/edi/vidiopicks-hub')

# Read API key
with open('/home/edi/.hermes/api_keys.env', 'rb') as f:
    raw = f.read()
idx = raw.find(b'QWEN_API_KEY_1=')
start = idx + len(b'QWEN_API_KEY_1=')
end = raw.find(b'\n', start)
QWEN_API_KEY = raw[start:end].decode()

# Read the tools.ts file
with open('/home/edi/vidiopicks-hub/app/data/tools.ts', 'r', encoding='utf-8') as f:
    tools_content = f.read()

def call_qwen(prompt, system="You are a professional video production tool reviewer. Generate detailed, authoritative G2-style content."):
    """Call Qwen API and return response text."""
    import urllib.request
    import urllib.error
    
    data = json.dumps({
        "model": "qwen-plus",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 3000
    }).encode('utf-8')
    
    req = urllib.request.Request(
        "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
        data=data,
        headers={
            "Authorization": f"Bearer {QWEN_API_KEY}",
            "Content-Type": "application/json"
        }
    )
    
    try:
        import subprocess
        result = subprocess.run(
            ['curl', '-s', '--proxy', 'http://127.0.0.1:7890',
             'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
             '-H', f'Authorization: Bearer {QWEN_API_KEY}',
             '-H', 'Content-Type: application/json',
             '-d', data.decode('utf-8')],
            capture_output=True, text=True, timeout=120
        )
        resp = json.loads(result.stdout)
        return resp['choices'][0]['message']['content']
    except Exception as e:
        print(f"API error: {e}")
        return None


def get_existing_entry(content, tool_id):
    """Extract the full tool entry from content by matching the id."""
    # Find the tool entry by id
    pattern = r'(\s*\{\s*\n\s*id:\s*"' + re.escape(tool_id) + r'")'
    match = re.search(pattern, content)
    if not match:
        print(f"Could not find tool id: {tool_id}")
        return None
    start_pos = match.start()
    
    # Find the closing bracket at matching depth
    depth = 0
    in_string = False
    string_char = None
    in_template = False
    pos = start_pos
    while pos < len(content):
        ch = content[pos]
        if in_template:
            if ch == '`':
                in_template = False
        elif in_string:
            if ch == '\\':
                pos += 2
                continue
            if ch == string_char:
                in_string = False
        else:
            if ch == '`':
                in_template = True
            elif ch in '"\'':
                in_string = True
                string_char = ch
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    # Found the closing bracket
                    return content[start_pos:pos+1], start_pos, pos+1
        pos += 1
    
    print(f"Could not find closing brace for tool: {tool_id}")
    return None


def generate_new_entry(tool_id, tool_name, category, rating, review_count, current_props):
    """Generate new refined content for a tool via Qwen."""
    
    prompt = f"""Generate a complete, detailed G2-style tool entry for "{tool_name}" (id: {tool_id}, category: {category}).

Current entry (short/needs expansion). Generate ALL new fields below with high-quality content.

Generate the following fields in raw JSON format (EXACT structure):
1. longDescription: A 1200-1500 character markdown description with:
   - Overview paragraph (who it's for, what it does)
   - ### Key Features section with 4-5 bullet-pointed feature descriptions
   - A benchmark/performance paragraph with specific numbers
   - Platform support details

2. pros: Array of 5-7 specific, actionable pros (each 5-15 words)

3. cons: Array of 2-4 specific cons

4. pricing: Short label like "Subscription", "Freemium", "Paid", "Free", "Open Source"

5. pricingDetail: Detailed pricing info mentioning plans and prices

6. features: Array of 6-10 specific features

7. scoreBreakdown: Object with features, reviews, momentum, popularity (all numbers 70-98)

8. userQuotes: Array of 3 objects with role, company, quote

Current info:
- Rating: {rating}
- Review count: {review_count}

Return ONLY a JSON object with these fields. No markdown, no code fences."""
    
    result = call_qwen(prompt)
    if not result:
        return None
    
    # Parse JSON from response
    # Try to find JSON in the response
    json_match = re.search(r'\{[\s\S]*\}', result)
    if json_match:
        try:
            data = json.loads(json_match.group())
            return data
        except json.JSONDecodeError as e:
            print(f"JSON parse error for {tool_id}: {e}")
            print(f"Raw response snippet: {result[:200]}")
            return None
    else:
        print(f"No JSON found in response for {tool_id}")
        return None


def format_new_entry_string(tool_id, tool_name, category, rating, review_count, icon_name, description, data, existing_entry_start):
    """Format a complete tool entry string, preserving the original structure."""
    
    # Extract the id, name, category etc. from the original entry start
    # We'll rebuild the entry keeping certain fields
    price = data.get('pricing', 'Paid')
    pricing_detail = data.get('pricingDetail', '')
    
    # Format longDescription - it uses backtick template literals
    long_desc = data.get('longDescription', '')
    
    pros = data.get('pros', [])
    cons = data.get('cons', [])
    features = data.get('features', [])
    score = data.get('scoreBreakdown', {})
    quotes = data.get('userQuotes', [])
    use_case = data.get('useCase', '')
    
    # Format pros array
    pros_str = json.dumps(pros, ensure_ascii=False)
    cons_str = json.dumps(cons, ensure_ascii=False)
    features_str = json.dumps(features, ensure_ascii=False)
    
    # Format score breakdown
    score_str = json.dumps(score, ensure_ascii=False)
    
    # Format quotes
    quotes_lines = []
    for q in quotes:
        role = q.get('role', 'User')
        company = q.get('company', 'Company')
        quote_text = q.get('quote', '')
        # Escape special chars
        quote_text = quote_text.replace('\\', '\\\\').replace('`', "'").replace('${', '\\${')
        quotes_lines.append(f'''      {{
        role: "{role}",
        company: "{company}",
        quote: "{quote_text}",
      }}''')
    quotes_str = '\n'.join(quotes_lines)
    
    # Build complete entry
    entry = f'''  {{
    id: "{tool_id}",
    name: "{tool_name}",
    category: "{category}",
    rating: {rating},
    reviewCount: {review_count},
    icon: {icon_name},
    description: "{description}",
    longDescription: `{long_desc}`,
    pros: {pros_str},
    cons: {cons_str},
    pricing: "{price}",
    pricingDetail: "{pricing_detail}",
    features: {features_str},
    useCase: "{use_case}",
    websiteUrl: "https://www.example.com/{tool_id}",
    alternatives: [
        "adobe-premiere-pro",
        "davinci-resolve"
      ],
    scoreBreakdown: {score_str},
    userQuotes: [
{quotes_str}
    ],
  }}'''
    
    return entry


# Tools to refine
tools_to_refine = [
    {
        "id": "adobe-after-effects",
        "name": "Adobe After Effects",
        "category": "Motion Graphics and Animation",
        "rating": 4.7,
        "reviewCount": 3240,
        "icon": "Video",
        "description": "Industry-standard motion graphics and visual effects software for film, TV, and web.",
    },
    {
        "id": "camtasia",
        "name": "Camtasia",
        "category": "Screen Recording",
        "rating": 4.5,
        "reviewCount": 3120,
        "icon": "Monitor",
        "description": "All-in-one screen recorder and video editor designed for professionals creating tutorials and presentations.",
    },
    {
        "id": "storyblocks",
        "name": "Storyblocks",
        "category": "Stock Video and Assets",
        "rating": 4.5,
        "reviewCount": 4120,
        "icon": "Video",
        "description": "All-in-one subscription platform for stock video, audio, images, and templates with AI-powered search.",
    },
]

for tool in tools_to_refine:
    print(f"\n=== Refining {tool['name']} ===")
    
    tid = tool['id']
    existing, start, end = get_existing_entry(tools_content, tid)
    if not existing:
        print(f"SKIP: Could not find entry for {tid}")
        continue
    
    print(f"Found entry at position {start}-{end}")
    print(f"Existing entry length: {len(existing)} chars")
    
    # Generate new content
    new_data = generate_new_entry(
        tid, tool['name'], tool['category'],
        tool['rating'], tool['reviewCount'],
        {}
    )
    
    if not new_data:
        print(f"SKIP: Failed to generate content for {tid}")
        continue
    
    # Build the new entry string
    new_entry = format_new_entry_string(
        tid, tool['name'], tool['category'],
        tool['rating'], tool['reviewCount'],
        tool['icon'], tool['description'], new_data,
        existing
    )
    
    # Verify brace balance
    open_braces = new_entry.count('{')
    close_braces = new_entry.count('}')
    print(f"Brace balance: open={open_braces}, close={close_braces}")
    
    if open_braces == close_braces:
        # Replace in content
        tools_content = tools_content[:start] + new_entry + tools_content[end:]
        print(f"✓ Successfully replaced entry for {tid}")
    else:
        print(f"✗ Brace mismatch for {tid}, skipping replacement")
        continue

# Final brace balance check
total_open = tools_content.count('{')
total_close = tools_content.count('}')
print(f"\nFinal brace balance: open={total_open}, close={total_close}")

if total_open == total_close:
    # Write the updated file
    with open('/home/edi/vidiopicks-hub/app/data/tools.ts', 'w', encoding='utf-8') as f:
        f.write(tools_content)
    print("✓ Written tools.ts successfully")
else:
    print("✗ Brace mismatch, NOT writing tools.ts")
