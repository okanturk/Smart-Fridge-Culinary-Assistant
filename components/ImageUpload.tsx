
import React, { useState, useRef, useCallback } from 'react';
import { Camera } from './icons';
import { useTranslation } from '../hooks/useTranslation';

interface ImageUploadProps {
  onImageUpload: (base64Image: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = () => {
    if (preview) {
      const base64String = preview.split(',')[1];
      onImageUpload(base64String);
    }
  };

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t('upload.title')}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t('upload.description')}
      </p>
      
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div 
        onClick={triggerFileSelect} 
        className={`w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors
        ${preview ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'}`}
      >
        {preview ? (
          <img src={preview} alt={t('upload.previewAlt')} className="object-cover w-full h-full rounded-lg" />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Camera className="w-12 h-12 mx-auto mb-2" />
            <p className="font-semibold">{t('upload.prompt')}</p>
          </div>
        )}
      </div>

      {preview && (
        <button
          onClick={handleAnalyzeClick}
          className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
        >
          {t('upload.button')}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
