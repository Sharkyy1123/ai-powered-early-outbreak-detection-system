
import { GoogleGenAI } from "@google/genai";
import { AIAnalysis, CountryData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartExplanation = async (analysis: AIAnalysis, data: CountryData): Promise<string> => {
  try {
    const prompt = `
      As an expert epidemiologist and AI system, explain the current health situation for ${data.name}.
      Metrics:
      - Risk Level: ${analysis.riskLevel}
      - Growth Rate: ${analysis.growthRate}%
      - Anomalies Detected: ${analysis.anomaliesCount}
      - Confidence: ${analysis.confidence}%
      - Trend: ${analysis.next7DayTrend}

      Keep the explanation professional, data-driven, and concise (under 80 words). 
      Identify potential causes for anomalies if the risk is high.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate smart analysis at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Our AI detected a ${analysis.growthRate}% growth rate with ${analysis.anomaliesCount} significant statistical anomalies. This suggests a ${analysis.riskLevel.toLowerCase()} probability of a major outbreak event within the coming weeks.`;
  }
};
