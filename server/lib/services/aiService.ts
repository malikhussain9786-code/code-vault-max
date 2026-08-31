import { generateContent, AiUnavailableError } from './aiProviderService.js';

/**
 * Analyzes code directly (no real execution involved) to find likely errors/bugs.
 * Honest limitation, stated plainly here because it matters: this is the AI *reading*
 * the code and guessing what might be wrong, the same as pasting code into a chat AI —
 * it is not a confirmed fact the way a real compiler/runtime error would be.
 */
export interface FoundErrors {
  hasIssues: boolean;
  explanation: string;
}

export async function findErrors(params: { language: string; code: string }): Promise<FoundErrors> {
  const { language, code } = params;

  const prompt = `You are a senior software engineer reviewing code for bugs, by reading it carefully (the code has not been executed — you are analyzing it statically).

Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Carefully read through this code and identify any likely bugs, syntax errors, logic errors, or issues that would cause it to fail or behave incorrectly. Be specific about line numbers and exact problems where possible.

If you genuinely find no issues, say so plainly and honestly rather than inventing a problem — do not manufacture issues just to have something to report.

Respond in EXACTLY this format and nothing else:

HAS_ISSUES: <true or false>

EXPLANATION:
<detailed explanation of what you found, or a brief note that the code looks correct>`;

  const raw = await generateContent(prompt);
  const hasIssuesMatch = raw.match(/HAS_ISSUES:\s*(true|false)/i);
  const explanationMatch = raw.match(/EXPLANATION:\s*([\s\S]*)$/i);

  return {
    hasIssues: hasIssuesMatch ? hasIssuesMatch[1].toLowerCase() === 'true' : true, // default to cautious if parsing fails
    explanation: explanationMatch ? explanationMatch[1].trim() : raw.trim(),
  };
}

export interface FixedCode {
  fixedCode: string;
  explanation: string;
}

export async function fixErrors(params: { language: string; code: string }): Promise<FixedCode> {
  const { language, code } = params;

  const prompt = `You are a senior software engineer fixing bugs in code, by reading it carefully (the code has not been executed — you are analyzing and fixing it statically, based on careful reading, not a confirmed runtime error).

Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Find and fix any bugs, syntax errors, or logic errors you can identify by reading this code. If the code already looks correct, say so and return it unchanged rather than inventing changes.

Respond in EXACTLY this format and nothing else:

EXPLANATION:
<2-4 sentences on what you found and changed — or a note that no changes were needed>

FIXED_CODE:
\`\`\`${language}
<the complete code, corrected if issues were found, or unchanged if it was already correct>
\`\`\`

Keep the rest of the program's original logic and style intact — only change what's necessary.`;

  const raw = await generateContent(prompt);
  return parseFixResponse(raw, code);
}

/**
 * Extracts the explanation and fixed code from the model's response. Real LLM output
 * doesn't always follow the requested format perfectly, so this falls back gracefully
 * rather than silently applying garbage as "fixed code" to the editor.
 */
function parseFixResponse(raw: string, originalCode: string): FixedCode {
  const explanationMatch = raw.match(/EXPLANATION:\s*([\s\S]*?)(?=FIXED_CODE:|$)/i);

  // Real models don't always follow the requested EXPLANATION:/FIXED_CODE: structure
  // exactly — this was found to silently return blank code in real testing (not the
  // schema-accurate mock used earlier), because the strict "labeled" match failed and
  // fell through to an empty originalCode with nothing shown but the explanation text.
  // Fixed by searching the whole response for ANY fenced code block, not requiring it
  // to appear specifically after a "FIXED_CODE:" label.
  const codeBlockMatches = [...raw.matchAll(/```[\w]*\n?([\s\S]*?)```/g)];
  const fixedCode = codeBlockMatches.length > 0 ? codeBlockMatches[0][1].trim() : originalCode;

  // If there was no EXPLANATION: label, fall back to the raw text minus any code
  // blocks — otherwise the explanation shown to the user redundantly repeats the same
  // code that's already shown separately (and applied via the Apply/Insert button).
  const explanation = explanationMatch
    ? explanationMatch[1].trim()
    : raw.replace(/```[\w]*\n?[\s\S]*?```/g, '').trim();

  return { fixedCode, explanation };
}

export async function explainCode(params: { language: string; code: string }): Promise<string> {
  const { language, code } = params;

  const prompt = `You are a senior software engineer explaining code to a developer who wants to understand it.

Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Explain, in plain language a beginner could follow:
1. What this code does overall
2. How it works, step by step, for any non-obvious parts
3. Any important concepts it demonstrates

Be detailed and specific — do not give a one-line answer.`;

  return generateContent(prompt);
}

export interface ImprovedCode {
  improvedCode: string;
  explanation: string;
}

export async function improveCode(params: { language: string; code: string }): Promise<ImprovedCode> {
  const { language, code } = params;

  const prompt = `You are a senior software engineer doing a code review, focused on cleaner code, better performance, and best practices.

Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Suggest improvements — cleaner structure, better naming, performance optimizations, or best-practice fixes. The code may already work correctly; you're improving quality, not fixing a bug. If the code is already solid, say so honestly rather than inventing changes for the sake of it.

Respond in EXACTLY this format and nothing else:

EXPLANATION:
<what you changed and why, as a few sentences or short bullet points>

FIXED_CODE:
\`\`\`${language}
<the complete improved code, ready to run as-is>
\`\`\`
`;

  const raw = await generateContent(prompt);
  const parsed = parseFixResponse(raw, code);
  return { improvedCode: parsed.fixedCode, explanation: parsed.explanation };
}

export interface DocumentationResult {
  documentedCode: string;
  readme: string;
}

export async function generateDocumentation(params: { language: string; code: string }): Promise<DocumentationResult> {
  const { language, code } = params;

  const prompt = `You are a senior software engineer writing documentation for a piece of code.

Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Do two things:
1. Add clear, valuable inline comments to the code (explaining non-obvious logic, parameters, and return values — not restating what's already obvious from the code itself).
2. Write a short README-style description: what this code does, how to use it, and any important notes.

Respond in EXACTLY this format and nothing else:

DOCUMENTED_CODE:
\`\`\`${language}
<the complete code with comments added>
\`\`\`

README:
<the short README-style description in markdown>
`;

  const raw = await generateContent(prompt);
  const codeBlockMatch = raw.match(/```[\w]*\n([\s\S]*?)```/);
  const readmeMatch = raw.match(/README:\s*([\s\S]*)$/i);

  return {
    documentedCode: codeBlockMatch ? codeBlockMatch[1].trim() : code,
    readme: readmeMatch ? readmeMatch[1].trim() : raw.trim(),
  };
}

export interface GeneratedCode {
  code: string;
  explanation: string;
}

/**
 * Writes new code from scratch based on a plain-language prompt — distinct from the
 * other functions here, which all analyze/modify code the user already wrote. Handles
 * prompts of any real size (up to the validator's limit), from a one-line request to a
 * detailed multi-paragraph spec.
 */
export async function generateCode(params: { language: string; prompt: string }): Promise<GeneratedCode> {
  const { language, prompt } = params;

  const promptText = `You are a senior software engineer writing code from a request.

Language: ${language}

Request:
${prompt}

Write complete, working, well-structured ${language} code that fulfills this request. Follow the language's own conventions and best practices. If the request is genuinely ambiguous in an important way, make a reasonable assumption and briefly note it — don't ask a clarifying question back, since there's no way for the user to reply in this flow.

Your response MUST contain the code inside a single fenced code block using triple backticks (\`\`\`), with the code and nothing else inside it. Do not skip the code block under any circumstances — a response with no fenced code block is not usable.

Respond in EXACTLY this format and nothing else:

EXPLANATION:
<2-4 sentences on what the code does and any assumptions made>

FIXED_CODE:
\`\`\`${language}
<the complete, ready-to-run code>
\`\`\`
`;

  const raw = await generateContent(promptText);
  const parsed = parseFixResponse(raw, '');

  // Unlike fix/improve (where falling back to the original code is a safe no-op),
  // there's no "original code" to fall back to here — if the model genuinely returned
  // no parseable code block at all, that's a real failure, not a silent empty success.
  if (!parsed.fixedCode.trim()) {
    throw new AiUnavailableError('AI did not return usable code for that request. Try rephrasing your prompt, or try again.');
  }

  return { code: parsed.fixedCode, explanation: parsed.explanation };
}

export async function askLearningAssistant(params: {
  question: string;
  language?: string;
  code?: string;
}): Promise<string> {
  const { question, language, code } = params;

  const codeContext = code
    ? `\n\nFor context, here's the code they're looking at (${language || 'unspecified language'}):\n\`\`\`${language || ''}\n${code}\n\`\`\``
    : '';

  const prompt = `You are a patient, knowledgeable programming tutor helping a developer learn.

Question: ${question}${codeContext}

Give a detailed, clear answer that actually teaches the concept — not just a definition. Use a concrete example where it helps. If the question relates to the provided code, refer to it specifically.`;

  return generateContent(prompt);
}
