#!/usr/bin/env python3
"""Refine tools by replacing the entire tool block with updated fields."""
import json, sys, re
from openai import OpenAI

with open('/tmp/qwen_key.txt', 'r') as f:
    QWEN_API_KEY = f.read().strip()

QWEN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
client = OpenAI(api_key=QWEN_API_KEY, base_url=QWEN_BASE_URL)

TOOLS_FILE = "/home/edi/vidiopicks-hub/app/data/tools.ts"

def read_file():
    with open(TOOLS_FILE, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(content):
    with open(TOOLS_FILE, 'w', encoding='utf-8') as f:
        f.write(content)

def escape(s):
    s = s.replace('`', "'")
    s = s.replace('${', '\\${')
    for a, b in [('\u2018',"'"), ('\u2019',"'"), ('\u201c','"'), ('\u201d','"'), ('\u2013','--'), ('\u2014','--'), ('\u00a0',' ')]:
        s = s.replace(a, b)
    return s

def refine_tool(tool_id, tool_name, current_data):
    prompt = f"""Refine tool "{tool_name}" (id: {tool_id}) for vidiopicks.com. Do NOT touch longDescription.

Update these fields (return ONLY valid JSON):
- pros: 6-7 items with metrics
- cons: 3-4 items
- features: 10+ items
- pricing: short label
- pricingDetail: detailed paragraph
- userQuotes: 3 items with role, company, quote
- useCase: 1-2 sentences
- scoreBreakdown: features/reviews/momentum/popularity (0-100)

Current data: {json.dumps(current_data)}

Return ONLY JSON with keys: pros, cons, features, pricing, pricingDetail, userQuotes, useCase, scoreBreakdown"""

    resp = client.chat.completions.create(
        model="qwen-plus",
        messages=[{"role": "system", "content": "Output ONLY valid JSON."}, {"role": "user", "content": prompt}],
        temperature=0.7, max_tokens=3000,
    )
    c = resp.choices[0].message.content.strip()
    m = re.search(r'```(?:json)?\s*([\s\S]*?)```', c)
    if m: c = m.group(1).strip()
    return json.loads(c)

def find_tool_block(content, tool_id):
    """Find the exact tool block using pattern matching."""
    pat = f'  {{\n    id: "{tool_id}"'
    s = content.find(pat)
    if s < 0:
        return None, None
    # Find matching close brace
    rest = content[s:]
    in_bt = False
    depth = 0
    for i, ch in enumerate(rest):
        if ch == '`':
            in_bt = not in_bt
        if not in_bt:
            if ch == '{': depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    return s, s + i + 1
    return None, None

def update_tool(content, tool_id, new_data):
    """Replace fields in the tool block."""
    start, end = find_tool_block(content, tool_id)
    if start is None:
        print(f"  ERROR: Cannot find tool {tool_id}")
        return content
    
    block = content[start:end]
    lines = block.split('\n')
    
    new_lines = []
    skip_until_close = None  # field name to skip until ]
    
    for line in lines:
        stripped = line.strip()
        
        # If we're in skip mode, check if this line is the closing ]
        if skip_until_close:
            if stripped.startswith(']'):
                skip_until_close = None
            continue
        
        # Check if this line starts a field we need to replace
        for field in ['pros', 'cons', 'features']:
            if field in new_data and stripped == f'{field}: [':
                # Replace this whole array
                new_lines.append(f'    {field}: [')
                indent = '      '
                for item in new_data[field]:
                    new_lines.append(f'{indent}"{escape(item)}",')
                new_lines.append(f'      ]')
                skip_until_close = field
                break
        else:
            # Check single-line fields
            if 'pricing' in new_data and re.match(r'^pricing:', stripped):
                new_lines.append(f'    pricing: "{escape(new_data["pricing"])}",')
            elif 'pricingDetail' in new_data and re.match(r'^pricingDetail:', stripped):
                new_lines.append(f'    pricingDetail: "{escape(new_data["pricingDetail"])}",')
            elif 'useCase' in new_data and re.match(r'^useCase:', stripped):
                new_lines.append(f'    useCase: "{escape(new_data["useCase"])}",')
            elif 'scoreBreakdown' in new_data and re.match(r'^scoreBreakdown:', stripped):
                sb = new_data['scoreBreakdown']
                new_lines.append(f'    scoreBreakdown: {{"features": {sb.get("features",0)}, "reviews": {sb.get("reviews",0)}, "momentum": {sb.get("momentum",0)}, "popularity": {sb.get("popularity",0)}}},')
            elif 'userQuotes' in new_data and re.match(r'^userQuotes:', stripped):
                new_lines.append('    userQuotes: [')
                for q in new_data['userQuotes']:
                    r = escape(q.get('role',''))
                    c = escape(q.get('company',''))
                    qq = escape(q.get('quote',''))
                    new_lines.extend([
                        '      {',
                        f'        role: "{r}",',
                        f'        company: "{c}",',
                        f'        quote: "{qq}",',
                        '      },'
                    ])
                new_lines.append('      ],')
                skip_until_close = 'userQuotes'
            else:
                new_lines.append(line)
    
    new_block = '\n'.join(new_lines)
    return content[:start] + new_block + content[end:]

def main():
    tools = [
        {"id":"obs-studio","name":"OBS Studio",
         "current":{"pros":["Zero licensing cost","Hardware-accelerated 1080p60 capture","Supports 16+ simultaneous sources","Native RTMP/RTMPS streaming","GPU-accelerated noise suppression","Cross-platform","Extensive plugin ecosystem"],
                     "cons":["No cloud storage","Steep learning curve","No AI captioning","Limited editing"],
                     "features":["Multi-scene engine","Hardware encoding","Audio mixing","Chroma key","Browser source","WebSockets API","NDI support","LUT grading","Audio filters","Hotkeys","Multiple formats","Real-time preview"],
                     "pricing":"Free","pricingDetail":"OBS Studio is completely free and open-source under GPLv2.",
                     "userQuotes":[{"role":"Senior Learning Technologist","company":"Coursera","quote":"Cut training time by 65% using OBS."},{"role":"Live Streaming Engineer","company":"Twitch","quote":"OBS handles 4K60 HDR at 18ms latency."},{"role":"Remote Work Lead","company":"Cisco","quote":"Deployed OBS across 12,000+ trainers."}],
                     "useCase":"Technical professionals, educators, and content creators needing customizable recording/streaming.",
                     "scoreBreakdown":{"features":88,"reviews":92,"momentum":95,"popularity":94}}},
        {"id":"vimeo","name":"Vimeo",
         "current":{"pros":["4K HDR streaming","SOC 2 Type II security","Salesforce & HubSpot sync","Vimeo Record AI","Granular privacy","Custom player","Behavioral analytics"],
                     "cons":["No mobile editing","Advanced analytics need Business plan","Limited plugin ecosystem"],
                     "features":["Ad-free 4K HDR","Role-based permissions","Vimeo Record","AI transcription","Custom player","Heatmap analytics","Domain restriction","Salesforce integration","Bulk upload API","GDPR/CCPA compliance","Zapier connectors","Viewer tracking"],
                     "pricing":"From $12/user/mo","pricingDetail":"Free: 500MB. Pro: $12/mo 2TB. Business: $75/mo.",
                     "userQuotes":[{"role":"Marketing Director","company":"SaaSScale","quote":"Reduced demo-to-close by 32%."},{"role":"L&D Manager","company":"HealthTech","quote":"99.2% completion rate vs 74% on YouTube."},{"role":"Product Marketing Lead","company":"FinTech Labs","quote":"Heatmaps revealed 41% drop-off at 2:17."}],
                     "useCase":"Marketing, sales, L&D teams needing secure branded video distribution.",
                     "scoreBreakdown":{"features":89,"reviews":86,"momentum":78,"popularity":82}}}
    ]
    
    for tool in tools:
        print(f"\n=== Refining {tool['name']} ===")
        try:
            refined = refine_tool(tool['id'], tool['name'], tool['current'])
            print(f"  API OK: pros={len(refined.get('pros',[]))}, cons={len(refined.get('cons',[]))}, features={len(refined.get('features',[]))}")
        except Exception as e:
            print(f"  API ERROR: {e}")
            continue
        
        content = read_file()
        content = update_tool(content, tool['id'], refined)
        write_file(content)
        
        # Verify
        v = read_file()
        s, e = find_tool_block(v, tool['id'])
        if s:
            block = v[s:e]
            checks = ['pros: [', 'cons: [', 'features: [', 'pricing:', 'pricingDetail:', 'useCase:', 'userQuotes: [', 'scoreBreakdown:']
            missing = [c for c in checks if c not in block]
            if missing:
                print(f"  WARNING: Missing fields: {missing}")
            else:
                print(f"  OK: All fields present")
        else:
            print(f"  FAIL: Tool block not found")
    
    print("\n=== Done ===")

if __name__ == "__main__":
    main()
