
import React from 'react';
import { Recipe } from '../types';
import { Clock, Fire, BarChart, ChefHat } from './icons';
import { useTranslation } from '../hooks/useTranslation';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const { t } = useTranslation();
  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const difficultyText = {
    Easy: t('recipeCard.difficulty.easy'),
    Medium: t('recipeCard.difficulty.medium'),
    Hard: t('recipeCard.difficulty.hard'),
  }

  return (
    <div
      onClick={onSelect}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 flex flex-col"
    >
      {recipe.imageUrl ? (
        <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{recipe.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{recipe.description}</p>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <BarChart className="w-5 h-5 mr-2 text-blue-500" />
            <span>{t('recipeCard.difficulty.label')}:</span>
            <span className={`ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full ${difficultyColor[recipe.difficulty]}`}>{difficultyText[recipe.difficulty]}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          <span>{t('recipeCard.prepTime')}:</span>
          <span className="ml-auto font-medium">{recipe.prepTime}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <Fire className="w-5 h-5 mr-2 text-blue-500" />
          <span>{t('recipeCard.calories')}:</span>
          <span className="ml-auto font-medium">{recipe.calories} kcal</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;