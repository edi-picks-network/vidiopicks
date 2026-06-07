#!/usr/bin/env python3
"""Generate a high-quality blog post about video tools using Qwen API."""
import os
import requests
import json

# Load Qwen API key
api_key = None
with open('/home/edi/.hermes/api_keys.env', 'r') as f:
    for line in f:
        line = line.strip()
        if line.startswith('QWEN_API_KEY_1='):
            api_key = line.split('=', 1)[1].strip()
            break

if not api_key:
    print("ERROR: Could not find QWEN_API_KEY_1")
    exit(1)

print(f"Using API key: {api_key[:8]}...")

base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"

system_prompt = """You are a professional tech blogger for VidioPicks.com, a website focused on video editing tools, live streaming software, and video production technology. Write in the style of a hands-on reviewer who actually tests software.

Write a complete, production-quality blog post as a TypeScript object that fits into an existing blog-posts.ts array. Use ONLY the format below — no markdown, no code fences, just pure JavaScript/TypeScript object syntax.

The blog post should be about: "Best Live Streaming Software in 2026: OBS Studio vs Streamlabs vs vMix vs Wirecast vs Restream — Compared for Streamers, Esports, Webinars & Enterprise"

Requirements:
- slug: "best-live-streaming-software-2026-comparison"
- Title: "Best Live Streaming Software in 2026: OBS Studio vs Streamlabs vs vMix vs Wirecast vs Restream — Compared for Streamers, Esports, Webinars & Enterprise"
- Author: "Alex Moreno"
- Author role: "Video Production Technology Analyst"
- Date: "2026-06-07"
- Category: "Video Tools & Software"
- Read time: ~12-14 minutes
- Tags: ["Live Streaming", "OBS Studio", "Streamlabs", "vMix", "Wirecast", "Restream", "Streaming Software", "Broadcasting", "Esports", "Webinar Tools"]

The content field must use a JavaScript template literal (backtick string). Write in a thorough, detailed style with:
1. An engaging opening about the live streaming landscape in 2026
2. An at-a-glance comparison table (markdown format)
3. Detailed reviews of each tool with:
   - What it's best for
   - What you love (specific features, benchmarks if possible)
   - What you don't love
   - Real user feedback from G2/Capterra
   - Pricing
4. A feature comparison matrix
5. A verdict section with clear recommendations
6. A FAQ section with 5 questions
7. Sources note at the end

IMPORTANT: The content field uses backtick template literal. Escape any backticks inside with backslash-backtick. Do NOT use triple backticks inside the content. Use markdown formatting throughout the content string.

Output ONLY the blog post object (including the comma at the end), with no other text."""

user_prompt = "Generate the complete blog post TypeScript object."

payload = {
    "model": "qwen-plus",
    "messages": [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ],
    "temperature": 0.8,
    "max_tokens": 8000,
    "top_p": 0.9
}

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Try without proxy first
print("Calling Qwen API (direct, no proxy)...")
try:
    resp = requests.post(
        f"{base_url}/chat/completions",
        headers=headers,
        json=payload,
        timeout=300
    )
    resp.raise_for_status()
    result = resp.json()
    content = result["choices"][0]["message"]["content"]
    print(f"Got response: {len(content)} chars")
    
    with open('/home/edi/vidiopicks-hub/generated_blog_raw.txt', 'w') as f:
        f.write(content)
    print("Saved raw response to generated_blog_raw.txt")
    
except requests.exceptions.Timeout:
    print("Direct connection timed out, trying with proxy...")
    try:
        proxies = {
            "http": "http://127.0.0.1:7890",
            "https": "http://127.0.0.1:7890"
        }
        resp = requests.post(
            f"{base_url}/chat/completions",
            headers=headers,
            json=payload,
            proxies=proxies,
            timeout=300
        )
        resp.raise_for_status()
        result = resp.json()
        content = result["choices"][0]["message"]["content"]
        print(f"Got response: {len(content)} chars")
        
        with open('/home/edi/vidiopicks-hub/generated_blog_raw.txt', 'w') as f:
            f.write(content)
        print("Saved raw response to generated_blog_raw.txt")
    except Exception as e:
        print(f"ERROR with proxy: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response: {e.response.text}")
        exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    if hasattr(e, 'response') and e.response:
        print(f"Response: {e.response.text}")
    exit(1)
