export const OPENAI_CONFIG = {
  API_KEY: 'My-furniture-store-assist-key', // Get this from OpenAI
  API_URL: 'https://api.openai.com/v1/chat/completions',
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
};

export const STORAGE_KEYS = {
  CHAT_HISTORY: 'furniture_chat_history',
  USER_ID: 'user_id',
  USER_PREFERENCES: 'user_preferences',
};