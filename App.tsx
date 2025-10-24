import React, { useState, useCallback } from 'react';
import { Recipe } from './types';
import { generateRecipesFromImage } from './services/geminiService';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import RecipeList from './components/RecipeList';
import CookingMode from './components/CookingMode';
import ShoppingList from './components/ShoppingList';
import Spinner from './components/Spinner';
import FilterSidebar from './components/FilterSidebar';
import IngredientConfirmation from './components/IngredientConfirmation';
import { useLanguage } from './context/LanguageContext';
import { useTranslation } from './hooks/useTranslation';

type View = 'upload' | 'confirmIngredients' | 'recipes' | 'cooking' | 'shopping';

const App: React.FC = () => {
  const [view, setView] = useState<View>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [identifiedIngredients, setIdentifiedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const { t } = useTranslation();

  const handleImageAnalysis = useCallback(async (imageData: string, currentFilters: string[]) => {
    setImage(imageData);
    setIsLoading(true);
    setError(null);
    try {
      const { identifiedIngredients, recipes } = await generateRecipesFromImage(imageData, currentFilters, language);
      setIdentifiedIngredients(identifiedIngredients);
      setRecipes(recipes);
      setView('confirmIngredients');
    } catch (err) {
      setError(t('app.error.generateRecipes'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [language, t]);

  const handleFilterChange = (newFilters: string[]) => {
    setFilters(newFilters);
    if (image) {
      handleImageAnalysis(image, newFilters);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('cooking');
  };

  const handleExitCookingMode = () => {
    setSelectedRecipe(null);
    setView('recipes');
  };
  
  const handleReset = () => {
    setView('upload');
    setImage(null);
    setIdentifiedIngredients([]);
    setRecipes([]);
    setSelectedRecipe(null);
    setFilters([]);
    setError(null);
  };

  const addToShoppingList = (item: string) => {
    if (!shoppingList.includes(item)) {
      setShoppingList(prev => [...prev, item]);
    }
  };
  
  const removeFromShoppingList = (item: string) => {
    setShoppingList(prev => prev.filter(i => i !== item));
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><Spinner /></div>;
    }
    if (error) {
      return <div className="text-center p-8 text-red-500">
        <p>{error}</p>
        <button onClick={handleReset} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('common.tryAgain')}</button>
      </div>
    }
    switch (view) {
      case 'upload':
        return <ImageUpload onImageUpload={(img) => handleImageAnalysis(img, filters)} />;
      case 'confirmIngredients':
        return <IngredientConfirmation 
                  ingredients={identifiedIngredients} 
                  onConfirm={() => setView('recipes')}
                  onReset={handleReset} 
                />;
      case 'recipes':
        return <RecipeList recipes={recipes} onSelectRecipe={handleSelectRecipe} onReset={handleReset} />;
      case 'cooking':
        return selectedRecipe && <CookingMode recipe={selectedRecipe} onExit={handleExitCookingMode} onAddToShoppingList={addToShoppingList} />;
      case 'shopping':
        return <ShoppingList items={shoppingList} onRemoveItem={removeFromShoppingList} />;
      default:
        return <ImageUpload onImageUpload={(img) => handleImageAnalysis(img, filters)} />;
    }
  };

  const getRecipeViewName = (): View => {
    if (recipes.length > 0) return 'recipes';
    if (identifiedIngredients.length > 0) return 'confirmIngredients';
    return 'upload';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header currentView={view} setView={setView} getRecipeViewName={getRecipeViewName} />
      <main className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {view === 'recipes' && !isLoading && (
            <FilterSidebar selectedFilters={filters} onFilterChange={handleFilterChange} />
          )}
          <div className="flex-grow">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;