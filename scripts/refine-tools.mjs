#!/usr/bin/env node
/**
 * Refine 3 unrefined tools in app/data/tools.ts using Qwen API.
 * Reads the file, identifies tools with short longDescriptions, refines them.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOOLS_FILE = path.join(__dirname, '..', 'app', 'data', 'tools.ts');

// Load env
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// We'll use the env variable
const QWEN_API_KEY = process.env.QWEN_API_KEY_1;

const QWEN_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
const MODEL = 'qwen-max';  // Use qwen-max for best quality

async function refineWithQwen(tool) {
  const systemPrompt = `You are a professional video tools reviewer and content writer for VidioPicks.com. 
Your job is to write a thorough, detailed, informative longDescription for a video-related tool.
The longDescription must be:
1. FACTUAL and DETAILED — include specific features, use cases, benchmarks where relevant
2. STRUCTURED — use multiple paragraphs with clear headings/explanations
3. PROFESSIONAL in tone but accessible
4. Between 300-600 words
5. Written in clear English (markdown supported)

Write the longDescription content only, no extra commentary.`;

  const userPrompt = `Write a professional, detailed longDescription for the following video tool:

Tool Name: ${tool.name}
Category: ${tool.category}
Current Description: ${tool.description}
Current Features: ${tool.features ? tool.features.join(', ') : 'N/A'}
Current Pricing: ${tool.pricing} - ${tool.pricingDetail}
Use Case: ${tool.useCase}

The longDescription should be comprehensive (300-600 words), markdown-formatted, multi-paragraph, covering:
- What the tool is and who it's for
- Key features and capabilities with specific details
- Performance or quality benchmarks if applicable
- Platform support and integration
- Ideal use cases

Write ONLY the longDescription content. Use backtick-delimited string format suitable for a TypeScript template literal.`;

  const response = await fetch(`${QWEN_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${QWEN_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Qwen API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function main() {
  // Tools to refine (by id) — picked the shortest longDescriptions
  const targetTools = [
    'final-cut-pro',
    'davinci-resolve',
    'capcut'
  ];

  const content = readFileSync(TOOLS_FILE, 'utf-8');
  let updatedContent = content;

  for (const targetId of targetTools) {
    // Find the tool in the file
    const idRegex = new RegExp(`id:\\s*"${targetId}"`);
    const idMatch = idRegex.exec(updatedContent);
    if (!idMatch) {
      console.error(`Tool "${targetId}" not found in file`);
      continue;
    }

    // Find the start position of this tool object
    const toolStartIdx = updatedContent.lastIndexOf('{', idMatch.index);
    if (toolStartIdx < 0) {
      console.error(`Could not find object start for "${targetId}"`);
      continue;
    }

    // Extract the tool info for API call
    const toolBlock = updatedContent.substring(toolStartIdx, toolStartIdx + 4000);
    
    // Parse tool data roughly
    const nameMatch = toolBlock.match(/name:\s*"([^"]+)"/);
    const catMatch = toolBlock.match(/category:\s*"([^"]+)"/);
    const descMatch = toolBlock.match(/description:\s*"([^"]+)"/);
    const featuresMatch = toolBlock.match(/features:\s*\[([^\]]+)\]/);
    const pricingMatch = toolBlock.match(/pricing:\s*"([^"]+)"/);
    const pricingDetailMatch = toolBlock.match(/pricingDetail:\s*"([^"]+)"/);
    const useCaseMatch = toolBlock.match(/useCase:\s*"([^"]+)"/);

    const tool = {
      id: targetId,
      name: nameMatch?.[1] || targetId,
      category: catMatch?.[1] || '',
      description: descMatch?.[1] || '',
      features: featuresMatch ? featuresMatch[1].split(',').map(f => f.trim().replace(/"/g, '')) : [],
      pricing: pricingMatch?.[1] || '',
      pricingDetail: pricingDetailMatch?.[1] || '',
      useCase: useCaseMatch?.[1] || ''
    };

    console.log(`\n=== Refining: ${tool.name} (${tool.id}) ===`);
    
    // Find the existing longDescription
    const longDescRegex = new RegExp(`id:\\s*"${targetId}"[\\s\\S]*?longDescription:\\s*\`([\\s\\S]*?)\``);
    const longDescMatch = longDescRegex.exec(updatedContent);
    
    if (!longDescMatch) {
      console.error(`Could not find longDescription for "${targetId}"`);
      continue;
    }

    const newLongDesc = await refineWithQwen(tool);
    console.log(`Generated ${newLongDesc.length} chars of new content`);

    // Replace the longDescription
    const oldLongDesc = longDescMatch[1];
    // Escape special regex chars in old string
    const escapedOld = oldLongDesc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Find the exact full longDescription (with backticks)
    const fullMatch = updatedContent.match(new RegExp(`(longDescription:\\s*\`)[\\s\\S]*?(\`\\s*,)`));
    
    if (!fullMatch) {
      console.error(`Could not parse longDescription boundaries for "${targetId}"`);
      continue;
    }

    // Debug: find the exact position
    const longDescPrefix = `longDescription: \``;
    const prefixIdx = updatedContent.indexOf(longDescPrefix, toolStartIdx);
    if (prefixIdx < 0) {
      console.error(`Could not find longDescription: prefix for "${targetId}"`);
      continue;
    }

    const openTickIdx = prefixIdx + longDescPrefix.length - 1; // position of opening backtick
    const closeTickIdx = updatedContent.indexOf('`', openTickIdx + 1);
    if (closeTickIdx < 0) {
      console.error(`Could not find closing backtick for "${targetId}"`);
      continue;
    }

    const before = updatedContent.substring(0, openTickIdx);
    const after = updatedContent.substring(closeTickIdx + 1);

    updatedContent = before + newLongDesc + after;
    console.log(`✅ Refined ${tool.name} successfully`);
  }

  writeFileSync(TOOLS_FILE, updatedContent, 'utf-8');
  console.log('\n✅ All refinements saved to tools.ts');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
