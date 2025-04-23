export const translateText = async (text, targetLang) => {
    const apiUrl = import.meta.env.VITE_TRANSLATION_API_URL;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en', // Source language (English)
          target: targetLang, // Target language (e.g., 'es' for Spanish)
          format: 'text',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch translation');
      }
  
      const data = await response.json();
      return data.translatedText; // Return the translated text
    } catch (error) {
      console.error('Error translating text:', error);
      return null; // Return null if translation fails
    }
  };