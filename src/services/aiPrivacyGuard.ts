import Anthropic from '@anthropic-ai/sdk';

export interface PrivacyReport {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
  trackers: string[];
  warnings: string[];
  recommendation: string;
}

/**
 * AI Privacy Guard — Analyzes web pages for privacy threats using Claude.
 *
 * Scans page content for trackers, fingerprinting scripts, and cookies.
 * Returns a structured privacy report with risk level.
 *
 * Requires ANTHROPIC_API_KEY environment variable.
 */
export async function analyzePagePrivacy(
  url: string,
  pageContent: string
): Promise<PrivacyReport> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      riskLevel: 'UNKNOWN',
      trackers: [],
      warnings: ['ANTHROPIC_API_KEY not set — AI analysis unavailable'],
      recommendation: 'Set your Anthropic API key to enable AI privacy analysis.',
    };
  }

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Analyze this webpage for privacy threats.

URL: ${url}
Page content (first 2000 chars):
${pageContent.slice(0, 2000)}

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "trackers": ["list of tracking scripts/services found"],
  "warnings": ["list of privacy warnings"],
  "recommendation": "one sentence privacy advice"
}`,
        },
      ],
    });

    const textContent = response.content[0];
    if (textContent.type === 'text') {
      const parsed = JSON.parse(textContent.text);
      return {
        riskLevel: parsed.riskLevel || 'UNKNOWN',
        trackers: parsed.trackers || [],
        warnings: parsed.warnings || [],
        recommendation: parsed.recommendation || 'No recommendation available.',
      };
    }

    return getDefaultReport();
  } catch (error) {
    console.error('AI Privacy Guard analysis error:', error);
    return {
      riskLevel: 'UNKNOWN',
      trackers: [],
      warnings: ['AI analysis failed — check API key and network connection'],
      recommendation: 'Could not complete privacy analysis.',
    };
  }
}

function getDefaultReport(): PrivacyReport {
  return {
    riskLevel: 'UNKNOWN',
    trackers: [],
    warnings: ['Could not parse AI response'],
    recommendation: 'Manual privacy review recommended.',
  };
}
