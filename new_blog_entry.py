#!/usr/bin/env python3
"""
Append a new blog post entry to app/data/blog-posts.ts
The blog-posts.ts file uses backtick template literals for content fields.
We need to be careful about:
1. Backticks in blog content -> single quotes
2. No ${} patterns
3. Smart quotes -> ASCII
4. Ensure trailing comma on last entry's closing }
"""

import re
import sys

def clean_content(text):
    """Clean blog content for insertion into backtick template literal."""
    # Replace backticks with single quotes
    text = text.replace('`', "'")
    # Replace ${} patterns - escape them to prevent template literal interpolation
    text = text.replace('${', '\\${')
    # Replace smart/curly quotes with ASCII
    smart_quotes = {
        '\u2018': "'", '\u2019': "'",  # single curly
        '\u201c': '"', '\u201d': '"',  # double curly
        '\u2013': '-', '\u2014': '--',  # dashes
        '\u2026': '...',  # ellipsis
    }
    for smart, ascii in smart_quotes.items():
        text = text.replace(smart, ascii)
    return text

# Read the blog post content
with open('/home/edi/vidiopicks-hub/new_blog_content.md', 'r', encoding='utf-8') as f:
    raw_content = f.read()

# Split into metadata and body
parts = raw_content.split('---CONTENT_SEPARATOR---', 1)
metadata_part = parts[0].strip()
body = parts[1].strip()

# Clean the body content
clean_body = clean_content(body)

# Parse metadata
meta = {}
for line in metadata_part.split('\n'):
    line = line.strip()
    if ':' in line:
        key, val = line.split(':', 1)
        meta[key.strip()] = val.strip()

# Build the blog entry
# Note: We use \n within the content backtick string - this is a multiline string
# in TypeScript template literal

entry = f"""  {{
    slug: "{meta['slug']}",
    title: "{meta['title']}",
    excerpt:
      "{meta['excerpt']}",
    content: `{clean_body}`,
    author: "{meta['author']}",
    authorRole: "{meta['authorRole']}",
    date: "{meta['date']}",
    category: "{meta['category']}",
    readTime: {meta['readTime']},
    tags: [{meta['tags']}]
  }},
"""

# Read existing file
with open('/home/edi/vidiopicks-hub/app/data/blog-posts.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the last ];\n or just before the closing
# The file ends with "];\n" - we need to insert before that
if content.rstrip().endswith('];'):
    # Remove the trailing ]; and add our entry + ];
    insert_point = content.rstrip().rfind('];')
    new_content = content[:insert_point].rstrip() + '\n' + entry + '];\n'
else:
    # Fallback: find the last line and insert before it
    lines = content.split('\n')
    # Look for the last line that has "];"
    for i in range(len(lines) - 1, -1, -1):
        if '];' in lines[i]:
            lines.insert(i, entry)
            new_content = '\n'.join(lines)
            break
    else:
        print("ERROR: Could not find '];' in file", file=sys.stderr)
        sys.exit(1)

with open('/home/edi/vidiopicks-hub/app/data/blog-posts.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("SUCCESS: Blog entry appended.")
