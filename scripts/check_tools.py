import re

with open('app/data/tools.ts', 'r') as f:
    content = f.read()

# Find all longDescription fields - backtick style
entries = []
idx = 0
while True:
    id_match = re.search(r'id:\s*"([^"]+)"', content[idx:])
    if not id_match:
        break
    eid = id_match.group(1)
    desc_start = id_match.end() + content[idx+id_match.end():].find('longDescription:')
    if desc_start < id_match.start():
        # search from after id
        after_id = content[idx+id_match.end():]
        ld_pos = after_id.find('longDescription:')
        if ld_pos == -1:
            break
        desc_start = idx + id_match.end() + ld_pos
    else:
        desc_start = idx + desc_start
    
    desc_content_start = content.find('`', desc_start)
    if desc_content_start == -1 or desc_content_start > desc_start + 50:
        # try double quote
        desc_content_start = content.find('"', desc_start)
        if desc_content_start == -1 or desc_content_start > desc_start + 50:
            idx = idx + len(eid) + 5
            continue
        quote_type = '"'
        desc_content_end = content.find('"', desc_content_start + 1)
    else:
        quote_type = '`'
        desc_content_end = content.find('`', desc_content_start + 1)
    
    desc_text = content[desc_content_start+1:desc_content_end]
    length = len(desc_text)
    
    if length < 1200:
        print(f'{eid}: {length} chars, quote={quote_type}')
    
    idx = desc_content_end + 1

print("---DONE---")
