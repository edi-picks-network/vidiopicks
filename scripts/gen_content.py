#!/usr/bin/env python3
"""Generate refined tool descriptions and blog post via Qwen API."""
import os
import json
import subprocess

# Read API key
with open('/home/edi/.hermes/api_keys.env') as f:
    env_content = f.read()

api_key = None
for line in env_content.split('\n'):
    line = line.strip()
    if line.startswith('QWEN_API_KEY_1='):
        api_key = line.split('=', 1)[1].strip().strip('"').strip("'")
        break

if not api_key:
    print("ERROR: Could not find QWEN_API_KEY_1")
    exit(1)

def call_qwen(system, user):
    """Call Qwen API and return response content."""
    payload = {
        "model": "qwen-plus",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user}
        ]
    }
    cmd = [
        "curl", "-s", "-X", "POST",
        "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
        "-H", "Content-Type: application/json",
        "-H", f"Authorization: Bearer {api_key}",
        "-d", json.dumps(payload)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    try:
        data = json.loads(result.stdout)
        return data['choices'][0]['message']['content']
    except (KeyError, json.JSONDecodeError) as e:
        return f"ERROR: {e}\n{result.stdout[:500]}"

system_prompt = "You are a helpful assistant for VidioPicks, a video tool directory. Output ONLY valid JSON, no markdown formatting."

# 1. Enhance Runway description
r1 = call_qwen(system_prompt, """Generate an enhanced longDescription for Runway (runway-ml) for a video tools directory. 
The description should be 250-350 words, using markdown (## headings, bullet lists). 
Cover: Gen-3 model, text-to-video, video-to-video, AI green screen, motion brush, auto-captions, real-time collaboration, use cases for professional editors and social creators.
Output as JSON: {"longDescription": "..."}""")
print(f"=== RUNWAY RESULT ===")
print(r1[:200])

# 2. Enhance HeyGen description
r2 = call_qwen(system_prompt, """Generate an enhanced longDescription for HeyGen (heygen) for a video tools directory.
The description should be 250-350 words, using markdown (## headings, bullet lists).
Cover: AI avatar video creation, script-to-video, voice cloning, auto-translate & dubbing, background removal, Chrome extension, API integrations, use cases for sales outreach and education.
Output as JSON: {"longDescription": "..."}""")
print(f"\n=== HEYGEN RESULT ===")
print(r2[:200])

# 3. Enhance Wistia description
r3 = call_qwen(system_prompt, """Generate an enhanced longDescription for Wistia (wistia) for a video tools directory.
The description should be 250-350 words, using markdown (## headings, bullet lists).
Cover: B2B video hosting, engagement heatmaps, lead capture CTAs, email-gated content, CRM integrations (HubSpot, Marketo, Salesforce), A/B testing, analytics, customizable embeds, Soapbox screen recorder.
Output as JSON: {"longDescription": "..."}""")
print(f"\n=== WISTIA RESULT ===")
print(r3[:200])

# 4. Generate blog post about live streaming software
r4 = call_qwen(system_prompt, """Write a complete blog post for VidioPicks about live streaming software comparison: OBS Studio vs Streamlabs vs vMix in 2026.

The blog must be a complete article with:
- Title: "Best Live Streaming Software 2026: OBS vs Streamlabs vs vMix — Which Should You Choose?"
- Meta description/excerpt (2-3 sentences)
- Date: 2026-06-13
- Category: Live Streaming
- Tags: OBS, Streamlabs, vMix, live streaming, streaming software
- Read time: ~10 minutes
- Author: Alex Chen
- Author role: Streaming Engineer at NewtGroup

Structure:
1. Brief intro about the live streaming boom in 2026
2. Comparison table with platform, best for, G2 rating, starting price, ease of use (1-10)
3. Detailed section for each tool:
   - OBS Studio: free, open-source, massive plugin ecosystem, best for customization
   - Streamlabs: OBS-based but optimized for streamers, built-in alerts/overlays, easier setup
   - vMix: professional production-grade, multi-camera, PTZ control, instant replay
4. Feature comparison matrix
5. Verdict with recommendations for different use cases
6. FAQ section

Output as JSON with this structure:
{
  "slug": "best-live-streaming-software-2026-obs-streamlabs-vmix",
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "author": "Alex Chen",
  "authorRole": "Streaming Engineer at NewtGroup",
  "date": "2026-06-13",
  "category": "Live Streaming",
  "readTime": 10,
  "tags": ["OBS", "Streamlabs", "vMix", "live streaming", "streaming software"]
}

The content field should be a full markdown article with ## headings, tables, bullet lists, bold text, and at least 1500 words."""
)
print(f"\n=== BLOG RESULT ===")
print(r4[:200])

# Save results
with open('/home/edi/vidiopicks-hub/scripts/gen_results.json', 'w') as f:
    json.dump({"runway": r1, "heygen": r2, "wistia": r3, "blog": r4}, f, indent=2)
print("\nResults saved to gen_results.json")
