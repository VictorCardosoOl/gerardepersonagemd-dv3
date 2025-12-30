import { GoogleGenAI } from "@google/genai";
import { Character } from "../types";

// Note: Using the new SDK syntax as requested.
const apiKey = process.env.API_KEY || ''; 

export const generateBackstory = async (char: Character): Promise<string> => {
  if (!apiKey) {
    return "API Key não configurada. Adicione sua chave para gerar histórias com IA.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Crie uma história de fundo curta e envolvente (máximo 1 parágrafo) e uma descrição física breve para o seguinte personagem de RPG D&D 5e:
      Nome: ${char.name}
      Raça: ${char.race}
      Classe: ${char.class}
      Antecedente: ${char.background}
      Alinhamento: ${char.alignment}
      Atributo mais alto: ${Object.entries(char.attributes).reduce((a, b) => a[1] > b[1] ? a : b)[0]} (${Math.max(...Object.values(char.attributes))})
      
      Mantenha o tom épico, misterioso ou heróico. Responda em Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest', // Fast and good for text
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a história.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "O bardo estava bêbado e esqueceu a história (Erro ao conectar com a IA).";
  }
};