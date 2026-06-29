#!/usr/bin/env python3
"""Generate a new blog post about screen recording software comparison and append to blog-posts.ts"""
import json
import re
from openai import OpenAI

with open('/tmp/qwen_key.txt', 'r') as f:
    QWEN_API_KEY = f.read().strip()

QWEN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
client = OpenAI(api_key=QWEN_API_KEY, base_url=QWEN_BASE_URL)

BLOG_FILE = "/home/edi/vidiopicks-hub/app/data/blog-posts.ts"

def escape_for_ts(s):
    """Escape string for use inside backtick template literals."""
    s = s.replace('`', "'")
    s = s.replace('${', '\\${')
    for a, b in [('\u2018', "'"), ('\u2019', "'"), ('\u201c', '"'), ('\u201d', '"'), ('\u2013', '--'), ('\u2014', '--'), ('\u00a0', ' ')]:
        s = s.replace(a, b)
    return s

today = "2026-06-30"

prompt = f"""Write a high-quality analytical blog post (Expert Analytical style) for vidiopicks.com, a video tools review site.

Topic: **Screen Recording Software in 2026: OBS Studio vs Camtasia vs ScreenFlow vs Loom - A Technical Comparison for Content Creators, Educators, and Enterprise Teams**

Style: Expert Analytical (Template B) - data-driven, comparison-heavy, benchmarks, structured analysis.

Requirements:
- 800-1500 words
- Compare OBS Studio, Camtasia, ScreenFlow, and Loom across: encoding performance, feature depth, learning curve, pricing, and best-fit use cases
- Include benchmark data or performance comparisons
- Section headers with ## markdown
- At least one comparison table
- A final verdict/recommendation section
- Write in English, engaging but professional tone
- Today's date context: June 2026

Return ONLY a JSON object:
{{
  "title": "Title Here",
  "excerpt": "One paragraph excerpt here.",
  "content": "Full blog content with markdown here..."
}}
"""

response = client.chat.completions.create(
    model="qwen-plus",
    messages=[
        {"role": "system", "content": "You are a video technology expert writing analytical blog content. Output ONLY valid JSON."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.8,
    max_tokens=4000,
)

c = response.choices[0].message.content.strip()

m = re.search(r'```(?:json)?\s*([\s\S]*?)```', c)
if m:
    c = m.group(1).strip()

try:
    blog = json.loads(c)
except json.JSONDecodeError:
    print(f"JSON parse error. Raw: {c[:500]}")
    exit(1)

title = blog.get('title', 'Screen Recording Software in 2026: OBS Studio vs Camtasia vs ScreenFlow vs Loom')
excerpt = blog.get('excerpt', 'A technical comparison of the top screen recording tools in 2026.')
content_raw = blog.get('content', '')

# Escape content
content = escape_for_ts(content_raw)
title_esc = escape_for_ts(title)
excerpt_esc = escape_for_ts(excerpt)

# Generate slug
slug = title.lower().replace(' ', '-').replace(':', '').replace('--', '-').replace('?', '')
slug = re.sub(r'[^a-z0-9-]', '', slug)
slug = slug[:80]

# Read current file
with open(BLOG_FILE, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the last entry and close structure
# The file ends with:
#   },
# ];

# We insert a new entry before the closing ]; line
# Find the position of ];
for i in range(len(lines)-1, -1, -1):
    if '];' in lines[i]:
        # Insert before this line
        insert_pos = i
        break
else:
    print("Could not find closing ];")
    exit(1)

# Build the entry
entry_lines = [
    '  {\n',
    f'    slug: "{slug}",\n',
    f'    title: "{title_esc}",\n',
    f'    excerpt:\n',
    f'      "{excerpt_esc}",\n',
    f'    content: `{content}`,\n',
    f'    author: "Alex Chen",\n',
    f'    authorRole: "Senior Video Editor",\n',
    f'    date: "{today}",\n',
    f'    category: "Screen Recording",\n',
    f'    readTime: 10,\n',
    f'    tags: ["OBS Studio", "Camtasia", "ScreenFlow", "Loom", "screen recording", "video capture", "tutorial creation", "2026"],\n',
    '  },\n',
]

new_lines = lines[:insert_pos] + entry_lines + lines[insert_pos:]

with open(BLOG_FILE, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

# Verify
with open(BLOG_FILE, 'r', encoding='utf-8') as f:
    content_check = f.read()
opens = content_check.count('{')
closes = content_check.count('}')
print(f"Blog post added successfully!")
print(f"Title: {title}")
print(f"Slug: {slug}")
print(f"Content length: {len(content_raw)} chars")
print(f"Braces: open={opens}, close={closes}, balanced={opens==closes}")
print(f"Expected post count: {content_check.count('slug:')}")
