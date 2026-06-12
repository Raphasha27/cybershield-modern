import axios from 'axios';

export interface AnomalyAnalysis {
  isAnomaly: boolean;
  threatScore: number;
  explanation: string;
  mitigationPlaybook: string;
}

export class AIThreatService {
  private getApiKey(): string | null {
    return process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || null;
  }

  private getProvider(): 'openai' | 'groq' | 'none' {
    if (process.env.OPENAI_API_KEY) return 'openai';
    if (process.env.GROQ_API_KEY) return 'groq';
    return 'none';
  }

  async analyzeLogs(logLines: string[]): Promise<AnomalyAnalysis> {
    const provider = this.getProvider();
    const apiKey = this.getApiKey();

    if (provider === 'none' || !apiKey) {
      // Free heuristic analysis fallback when no keys are present
      return this.heuristicAnalyze(logLines);
    }

    const prompt = `Analyze the following system logs for security threats, anomalies, or suspicious activity.
Identify:
1. If there's an anomaly (true/false)
2. Threat Risk Score (0 to 100)
3. Direct clear explanation of what is suspicious (e.g. brute forcing, impossible travel, lateral movement, insider mass downloads)
4. A short automated mitigation playbook step.

Log lines to inspect:
${logLines.join('\n')}

Response MUST be a valid JSON object format matching:
{
  "isAnomaly": boolean,
  "threatScore": number,
  "explanation": "string describing the detection",
  "mitigationPlaybook": "string describing mitigation steps"
}`;

    try {
      if (provider === 'openai') {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
          },
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
        return JSON.parse(response.data.choices[0].message.content) as AnomalyAnalysis;
      } else {
        // Groq API Call (completely free open-source models fallback)
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
          },
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
        return JSON.parse(response.data.choices[0].message.content) as AnomalyAnalysis;
      }
    } catch (error) {
      console.error('Error calling AI service, falling back to heuristic analysis:', error);
      return this.heuristicAnalyze(logLines);
    }
  }

  private heuristicAnalyze(logLines: string[]): AnomalyAnalysis {
    const combined = logLines.join('\n').toLowerCase();
    let score = 0;
    let explanation = '';
    let mitigation = '';

    if (combined.includes('failed login') || combined.includes('invalid password') || combined.includes('auth fail')) {
      const occurrences = (combined.match(/failed/g) || []).length;
      if (occurrences > 5) {
        score = 85;
        explanation = `Brute-force attack detected. Found ${occurrences} failed authentication attempts in a short timeframe.`;
        mitigation = 'IP Address blocked automatically. Enforce MFA validation check.';
      } else {
        score = 30;
        explanation = 'Minor failed login attempts detected.';
        mitigation = 'Monitor user login activity and trigger alert if count increases.';
      }
    } else if (combined.includes('impossible travel') || (combined.includes('login') && combined.includes('different country'))) {
      score = 90;
      explanation = 'Impossible Travel alert: User logged in from locations physically far apart within minutes.';
      mitigation = 'Terminate active session and lock user account. Require password reset.';
    } else if (combined.includes('download') && (combined.includes('2000') || combined.includes('mass') || combined.includes('sensitive'))) {
      score = 95;
      explanation = 'Insider Threat: Rapid download of high volume of sensitive files detected.';
      mitigation = 'Revoke data access privileges immediately and alert security manager.';
    }

    return {
      isAnomaly: score > 50,
      threatScore: score,
      explanation: explanation || 'No severe anomalies identified in logs.',
      mitigationPlaybook: mitigation || 'Continue standard log analysis.'
    };
  }
}

export const aiThreatService = new AIThreatService();
