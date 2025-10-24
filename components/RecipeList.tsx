
import React from 'react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import { useTranslation } from '../hooks/useTranslation';

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onReset: () => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onSelectRecipe, onReset }) => {
  const { t } = useTranslation();

  if (recipes.length === 0) {
    return (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{t('recipeList.notFound.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t('recipeList.notFound.description')}</p>
            <button onClick={onReset} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('common.startOver')}</button>
        </div>
    );
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('recipeList.title')}</h2>
            <button onClick={onReset} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm">
                {t('common.startOver')}
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} onSelect={() => onSelectRecipe(recipe)} />
        ))}
        </div>
    </div>
  );
};

export default RecipeList;
