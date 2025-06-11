// services/ChatService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OPENAI_CONFIG} from '../config/open-ai';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export class ChatService {
  private static readonly OPENAI_API_URL =
    'https://api.openai.com/v1/chat/completions';

  // You need to set your OpenAI API key
  private static readonly API_KEY = OPENAI_CONFIG.API_KEY;

  static async sendMessage(userMessage: string): Promise<string> {
    try {
      const qaContent = await this.getQAContent();
      const systemPrompt = await this.getSystemPrompt();

      const response = await fetch(this.OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `${systemPrompt}\n\nReference Q&A:\n${qaContent}`,
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
  private static async getQAContent(): Promise<string> {
    return `
Q: What types of furniture do you sell?
A: We sell a wide range of furniture including sofas, chairs, tables, beds, wardrobes, cabinets, and home decor items.

Q: Do you offer delivery services?
A: Yes, we provide delivery services. Delivery fees vary based on location and furniture size.

Q: What is your return policy?
A: We offer a 30-day return policy for unused items in original condition.

Q: Do you provide assembly services?
A: Yes, we offer professional assembly services for an additional fee.

Q: What materials are your furniture made from?
A: Our furniture is made from high-quality materials including solid wood, engineered wood, metal, and premium fabrics.

Q: How do I care for wooden furniture?
A: Clean with a damp cloth, avoid direct sunlight, and use furniture polish monthly.

Q: What are your store hours?
A: We're open Monday-Sunday, 9 AM to 8 PM.

Q: Do you offer financing options?
A: Yes, we provide flexible payment plans and financing options.

Q: How long does delivery typically take?
A: Standard delivery takes 3-7 business days, depending on your location.

Q: Can I see furniture before buying?
A: Yes, visit our showroom to see and test furniture before purchasing.
    `;
  }

  private static async getSystemPrompt(): Promise<string> {
    return `
You are a helpful customer service assistant for Furnistore, a furniture retail store. 

STRICT GUIDELINES:
1. ONLY answer questions related to furniture, home decor, store policies, and shopping assistance
2. DO NOT provide information about topics outside of furniture retail (politics, medical advice, etc.)
3. If asked about unrelated topics, politely redirect to furniture-related assistance
4. Always be helpful, friendly, and professional
5. Use the provided Q&A reference to give accurate information
6. If you don't know specific store information, direct customers to contact the store directly
7. Keep responses concise but informative
8. Focus on helping customers with: product information, sizing, materials, care instructions, delivery, returns, store policies

RESPONSE FORMAT:
- Be conversational and friendly
- Provide specific, actionable information when possible
- If recommending products, ask about customer preferences
- Always end with an offer to help further

If asked about anything outside furniture/retail scope, respond with:
"I'm here to help with furniture and store-related questions. Is there anything about our furniture, delivery, or store services I can assist you with?"
    `;
  }
}
