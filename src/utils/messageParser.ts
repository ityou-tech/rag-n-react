export interface ParsedMessage {
  reasoning: string | null;
  content: string;
}

export function parseMessageWithReasoning(text: string): ParsedMessage {
  // Regular expression to match content between <thinking> tags
  const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/gi;
  
  let reasoning: string | null = null;
  let content = text;
  
  // Extract all thinking sections
  const thinkingMatches = text.match(thinkingRegex);
  
  if (thinkingMatches && thinkingMatches.length > 0) {
    // Combine all thinking sections
    reasoning = thinkingMatches
      .map(match => match.replace(/<\/?thinking>/gi, '').trim())
      .join('\n\n');
    
    // Remove thinking sections from the main content
    content = text.replace(thinkingRegex, '').trim();
  }
  
  return { reasoning, content };
}

// Additional utility to determine if reasoning should use inline display
export function shouldUseInlineReasoning(reasoning: string): boolean {
  if (!reasoning) return false;
  
  // Use inline display for short reasoning (less than 2 lines or 150 characters)
  const lineCount = reasoning.split('\n').filter(line => line.trim()).length;
  return lineCount <= 2 || reasoning.length < 150;
}