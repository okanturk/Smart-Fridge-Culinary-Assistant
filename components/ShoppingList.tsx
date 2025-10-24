
import React from 'react';
import { Trash } from './icons';
import { useTranslation } from '../hooks/useTranslation';

interface ShoppingListProps {
  items: string[];
  onRemoveItem: (item: string) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemoveItem }) => {
  const { t } = useTranslation();
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-4 dark:border-gray-700">{t('shoppingList.title')}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('shoppingList.empty')}</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all"
            >
              <span className="text-lg text-gray-800 dark:text-gray-200">{item}</span>
              <button
                onClick={() => onRemoveItem(item)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                title={t('shoppingList.removeItem')}
              >
                <Trash className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShoppingList;
