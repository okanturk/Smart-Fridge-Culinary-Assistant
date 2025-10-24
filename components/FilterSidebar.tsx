
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Dairy-Free'];

interface FilterSidebarProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ selectedFilters, onFilterChange }) => {
  const { t } = useTranslation();

  const handleCheckboxChange = (option: string) => {
    const newFilters = selectedFilters.includes(option)
      ? selectedFilters.filter(filter => filter !== option)
      : [...selectedFilters, option];
    onFilterChange(newFilters);
  };

  return (
    <aside className="w-full lg:w-64 lg:flex-shrink-0 mb-8 lg:mb-0">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">{t('filter.title')}</h3>
        <div className="space-y-3">
          {DIETARY_OPTIONS.map(option => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{t(`filter.options.${option.toLowerCase().replace('-', '')}`)}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
