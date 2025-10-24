import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY is not defined in environment variables");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The title of the recipe." },
      description: { type: Type.STRING, description: "A brief, appealing description of the dish." },
      difficulty: { type: Type.STRING, description: "Difficulty level: 'Easy', 'Medium', or 'Hard'." },
      prepTime: { type: Type.STRING, description: "Estimated preparation and cooking time, e.g., '45 minutes'." },
      calories: { type: Type.INTEGER, description: "Estimated calorie count per serving." },
      imageUrl: { type: Type.STRING, description: "A URL to a high-quality, royalty-free image of the finished dish." },
      ingredients: {
        type: Type.ARRAY,
        description: "List of all ingredients required for the recipe.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            quantity: { type: Type.STRING },
          },
          required: ["name", "quantity"],
        },
      },
      missingIngredients: {
        type: Type.ARRAY,
        description: "A list of essential ingredients for the recipe that were NOT identified in the image.",
        items: { type: Type.STRING },
      },
      steps: {
        type: Type.ARRAY,
        description: "Step-by-step cooking instructions.",
        items: { type: Type.STRING },
      },
    },
    required: ["name", "description", "difficulty", "prepTime", "calories", "ingredients", "missingIngredients", "steps"],
  },
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        identifiedIngredients: {
            type: Type.ARRAY,
            description: "A list of all ingredients identified in the image.",
            items: { type: Type.STRING }
        },
        recipes: recipeSchema,
    },
    required: ["identifiedIngredients", "recipes"],
};

export const generateRecipesFromImage = async (base64ImageData: string, filters: string[], language: 'en' | 'tr'): Promise<{ identifiedIngredients: string[], recipes: Recipe[] }> => {
  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: 'image/jpeg',
    },
  };

  let filterInstructions = language === 'tr'
    ? "Beslenme kısıtlaması yok."
    : "There are no dietary restrictions.";
  if (filters.length > 0) {
    filterInstructions = language === 'tr'
      ? `Kullanıcının şu beslenme kısıtlamaları var: ${filters.join(", ")}. Lütfen tüm tariflerin bunlara uygun olduğundan emin olun.`
      : `The user has the following dietary restrictions: ${filters.join(", ")}. Please ensure all recipes adhere to these.`;
  }
  
  const promptText = language === 'tr'
    ? `Bu buzdolabı fotoğrafındaki malzemeleri analiz et.
       İlk olarak, resimde tanımlayabildiğin tüm malzemelerin bir listesini oluştur.
       Ardından, bu malzemelere dayanarak, özellikle Türk mutfağına özgü 3 ila 5 yaratıcı yemek tarifi öner.
       Her tarif için açıklama, zorluk, hazırlık süresi, kalori, tam bir malzeme listesi, eksik olan temel malzemelerin özel bir listesi ve adım adım talimatlar içeren ayrıntılı bir döküm sağla. Mümkünse, bitmiş yemeğin yüksek kaliteli, telifsiz bir resminin URL'sini de ekle.
       ${filterInstructions}
       Cevabı, 'identifiedIngredients' (bir string dizisi) ve 'recipes' (tarif nesneleri dizisi) olmak üzere iki anahtarı olan tek bir JSON nesnesi olarak, sağlanan şemaya sıkı sıkıya uyarak döndür. Tüm metin alanları Türkçe olmalıdır.`
    : `Analyze the ingredients in this image of a refrigerator.
       First, provide a list of all the ingredients you can identify in the image.
       Then, based on those ingredients, suggest 3 to 5 creative recipes, focusing on dishes popular in Western cuisine (e.g., American, British).
       For each recipe, provide a detailed breakdown including a description, difficulty, prep time, calories, a full list of ingredients, a specific list of missing essential ingredients, and step-by-step instructions. If possible, also include a URL for a high-quality, royalty-free image of the finished dish.
       ${filterInstructions}
       Return the response as a single JSON object with two keys: 'identifiedIngredients' (an array of strings) and 'recipes' (an array of recipe objects), strictly following the provided schema.`;

  const textPart = {
    text: promptText,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    const difficultyMap: { [key: string]: 'Easy' | 'Medium' | 'Hard' } = {
        'easy': 'Easy', 'kolay': 'Easy',
        'medium': 'Medium', 'orta': 'Medium',
        'hard': 'Hard', 'zor': 'Hard',
    };

    const validatedRecipes = result.recipes.map((recipe: any) => ({
        ...recipe,
        difficulty: difficultyMap[recipe.difficulty.toLowerCase()] || 'Medium',
    }));

    return { identifiedIngredients: result.identifiedIngredients, recipes: validatedRecipes };
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to get recipes from AI model.");
  }
};