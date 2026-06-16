#!/usr/bin/env python3
"""Refine tool descriptions using Qwen API"""
import requests
import json
import re
import os

QWEN_API_KEY = "sk-9176681e5a6248ddb0a5ffcbffe26bb8"
BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
MODEL = "qwen-plus"
PROXIES = {"http": "http://127.0.0.1:7890", "https": "http://127.0.0.1:7890"}

def refine_description(current_long_desc, tool_name, category, features):
    prompt = f"""You are a professional video production copywriter. Rewrite the long description for "{tool_name}" (category: {category}) to be more detailed, practical, and compelling.

Current description:
```
{current_long_desc}
```

Features: {features}

Requirements:
1. Write 800-1500 characters of detailed, practical content
2. Include specific benchmarks, metrics, or real usage scenarios
3. Keep the tone professional but accessible
4. Use backtick-style content (for embedding in TypeScript)
5. NO markdown headers - just plain paragraphs with some line breaks
6. Do NOT use backticks inside the text (replace with single quotes)
7. Focus on what makes this tool unique and valuable for video creators
8. Make sure the content is in English only

Return ONLY the refined long description text, nothing else."""

    try:
        resp = requests.post(
            f"{BASE_URL}/chat/completions",
            headers={
                "Authorization": f"Bearer {QWEN_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODEL,
                "messages": [
                    {"role": "system", "content": "You are a professional video production copywriter. Return ONLY the requested text, no explanations."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 2048
            },
            proxies=PROXIES,
            timeout=60
        )
        data = resp.json()
        result = data["choices"][0]["message"]["content"].strip()
        # Remove any surrounding backticks if present
        if result.startswith("```") and result.endswith("```"):
            result = result[3:-3].strip()
        return result
    except Exception as e:
        print(f"ERROR: {e}")
        return None

tools_to_refine = [
    {
        "name": "Envato Elements",
        "id": "envato-elements",
        "category": "Stock Video and Assets",
        "features": ["Stock video library", "Motion graphics templates", "Royalty-free music & SFX", "Photos & graphics", "Adobe plugin integration"],
        "current_desc": """Envato Elements offers a vast, high-quality library of royalty-free stock videos, motion graphics, After Effects templates, music, sound effects, and photos — all under a single monthly or annual subscription with commercial licensing."""
    },
    {
        "name": "Storyblocks",
        "id": "storyblocks",
        "category": "Stock Video and Assets",
        "features": ["Stock video & B-roll", "Royalty-free music & SFX", "Editable templates (Premiere, Canva)", "AI scene detection", "Cloud-based editor"],
        "current_desc": """Storyblocks provides unlimited access to millions of royalty-free stock videos, music tracks, sound effects, images, and editable templates — backed by intuitive AI search, browser-based editing tools, and team collaboration features."""
    },
    {
        "name": "Artgrid",
        "id": "artgrid",
        "category": "Stock Video and Assets",
        "features": ["4K/6K cinematic footage", "LUTs & color profiles", "Plugin integrations", "Customizable download presets", "License manager dashboard"],
        "current_desc": """Artgrid specializes in cinematic, professionally shot 4K and 6K stock video footage — including B-roll, drone shots, timelapses, and color-graded clips — designed specifically for filmmakers, advertisers, and premium content creators."""
    }
]

results = {}
for tool in tools_to_refine:
    print(f"Refining {tool['name']}...")
    new_desc = refine_description(
        tool["current_desc"],
        tool["name"],
        tool["category"],
        tool["features"]
    )
    if new_desc:
        print(f"  Got {len(new_desc)} chars")
        results[tool["id"]] = new_desc
    else:
        print(f"  FAILED for {tool['name']}")
    print()

for tid, desc in results.items():
    print(f"=== {tid} ===")
    print(desc)
    print()

print("DONE")
