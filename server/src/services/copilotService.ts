import axios from 'axios';
import { Threat } from '../models/Threat';

export class CopilotService {
  private getApiKey(): string | null {
    return process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || null;
  }

  private getProvider(): 'openai' | 'groq' | 'none' {
    if (process.env.OPENAI_API_KEY) return 'openai';
    if (process.env.GROQ_API_KEY) return 'groq';
    return 'none';
  }

  async queryCopilot(question: string): Promise<string> {
    const provider = this.getProvider();
    const apiKey = this.getApiKey();

    // Pull latest active threats to inject context for the AI Copilot
    const latestThreats = await Threat.find({ status: 'Active' }).sort({ detectedAt: -1 }).limit(5);
    const context = latestThreats.map(t => (
      `- [Severity: ${t.severity}] ${t.classification}: ${t.description} (Source: ${t.detectionSource})`
    )).join('\n');

    const prompt = `You are the CyberShield Security Copilot, an advanced AI Assistant helping Security Analysts inside the SOC.
You have the following recent active threats in context:
${context || 'No active threats currently detected.'}

Question: "${question}"

Respond clearly, emphasizing threat details, possible mitigation strategies, and maintaining a professional, alert posture.`;

    if (provider === 'none' || !apiKey) {
      return `[CyberShield Copilot (Offline Heuristic Mode)]:
Based on current active threats, we have analyzed your query: "${question}".
Active alerts include:
${context || 'No active threats.'}

Please set up a free GROQ_API_KEY or OPENAI_API_KEY to activate full conversation/generative capabilities!`;
    }

    try {
      if (provider === 'openai') {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }]
          },
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
        return response.data.choices[0].message.content;
      } else {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content: prompt }]
          },
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
        return response.data.choices[0].message.content;
      }
    } catch (error: any) {
      return `[CyberShield Copilot Error]: Failed to contact LLM provider (${error.message}). Offline Context:\n${context}`;
    }
  }
}

export const copilotService = new CopilotService();
