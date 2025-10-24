
import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import { ChevronLeft, ChevronRight, Speaker, PlusCircle, AlertTriangle, ChefHat } from './icons';
import { useTranslation } from '../hooks/useTranslation';

interface CookingModeProps {
  recipe: Recipe;
  onExit: () => void;
  onAddToShoppingList: (item: string) => void;
}

const CookingMode: React.FC<CookingModeProps> = ({ recipe, onExit, onAddToShoppingList }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const { t, currentLanguage } = useTranslation();

  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  const handleNextStep = () => {
    cancel();
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    cancel();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(recipe.steps[currentStep], currentLanguage === 'tr' ? 'tr-TR' : 'en-US');
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{recipe.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{recipe.description}</p>
        </div>
        <button onClick={onExit} className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          {t('cookingMode.exit')}
        </button>
      </div>
      
      <div className="lg:flex lg:gap-8">
        {/* Ingredients Section */}
        <div className="lg:w-1/3 mb-8 lg:mb-0">
          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-48 object-cover rounded-lg mb-6" />
          ) : (
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg mb-6">
                <ChefHat className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <h3 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-600">{t('cookingMode.ingredients')}</h3>
          <ul className="space-y-2 text-sm">
            {recipe.ingredients.map((ing, index) => (
              <li key={index} className="flex items-center">
                <span className="font-semibold text-gray-800 dark:text-gray-200">{ing.name}:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{ing.quantity}</span>
              </li>
            ))}
          </ul>
          {recipe.missingIngredients.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded-r-lg">
                <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3"/>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">{t('cookingMode.missingIngredients')}</h4>
                </div>
              <ul className="mt-2 space-y-2 text-sm">
                {recipe.missingIngredients.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-yellow-700 dark:text-yellow-200">{item}</span>
                    <button onClick={() => onAddToShoppingList(item)} title={t('cookingMode.addToShoppingList')} className="text-blue-500 hover:text-blue-700">
                      <PlusCircle className="w-5 h-5"/>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Steps Section */}
        <div className="lg:w-2/3">
            <div className="relative p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    {t('cookingMode.step', { current: currentStep + 1, total: recipe.steps.length })}
                  </p>
                  <button onClick={handleSpeak} className={`p-2 rounded-full transition-colors ${isSpeaking ? 'bg-blue-200 dark:bg-blue-800 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                      <Speaker className="w-6 h-6" />
                  </button>
              </div>
              
              <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-gray-800 dark:text-gray-200 min-h-[150px] sm:min-h-[200px]">
                {recipe.steps[currentStep]}
              </p>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <ChevronLeft className="w-5 h-5"/> {t('common.previous')}
              </button>
              <button
                onClick={handleNextStep}
                disabled={currentStep === recipe.steps.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                {t('common.next')} <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CookingMode;