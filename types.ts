
export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  calories: number;
  ingredients: Ingredient[];
  missingIngredients: string[];
  steps: string[];
  imageUrl?: string;
}