import React from 'react';
import { ChefHat, ShoppingCart } from './icons';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

type View = 'upload' | 'confirmIngredients' | 'recipes' | 'cooking' | 'shopping';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  getRecipeViewName: () => View;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, getRecipeViewName }) => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const isRecipeFlowView = ['upload', 'recipes', 'cooking', 'confirmIngredients'].includes(currentView);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-blue-500" />
          <span>{t('header.title')}</span>
        </h1>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-0.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${language === 'en' ? 'bg-white dark:bg-gray-900 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('tr')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${language === 'tr' ? 'bg-white dark:bg-gray-900 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
            >
              TR
            </button>
          </div>
          <nav>
            <ul className="flex items-center space-x-2">
              <li>
                <button
                  onClick={() => setView(getRecipeViewName())}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isRecipeFlowView
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  title={t('header.recipes')}
                >
                  <ChefHat className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('header.recipes')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView('shopping')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'shopping'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  title={t('header.shoppingList')}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('header.shoppingList')}</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
