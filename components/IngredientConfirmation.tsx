import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface IngredientConfirmationProps {
  ingredients: string[];
  onConfirm: () => void;
  onReset: () => void;
}

const IngredientConfirmation: React.FC<IngredientConfirmationProps> = ({ ingredients, onConfirm, onReset }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t('ingredientConfirmation.title')}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t('ingredientConfirmation.description')}
      </p>
      
      <div className="flex flex-wrap justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700">
        {ingredients.length > 0 ? ingredients.map((item, index) => (
            <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-semibold rounded-full">
                {item}
            </span>
        )) : (
            <p className="text-gray-500 dark:text-gray-400">{t('ingredientConfirmation.noIngredients')}</p>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {t('common.startOver')}
        </button>
        <button
          onClick={onConfirm}
          className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
        >
          {t('ingredientConfirmation.continueButton')}
        </button>
      </div>
    </div>
  );
};

export default IngredientConfirmation;
