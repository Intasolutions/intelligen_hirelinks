import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

interface ImageUploadPreviewProps {
  label: string;
  initialImageUrl?: string;
  onImageChange: (file: File | null) => void;
  className?: string;
}

export function ImageUploadPreview({ label, initialImageUrl, onImageChange, className = '' }: ImageUploadPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (initialImageUrl) {
      setPreviewUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleFile = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file);
    } else {
      setPreviewUrl(initialImageUrl || null);
      onImageChange(null);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      
      {previewUrl ? (
        <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-admin-card group bg-[#12181d]">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button"
              onClick={() => handleFile(null)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <X className="w-4 h-4" /> Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`relative w-full max-w-sm aspect-video rounded-lg border-2 border-dashed ${isDragActive ? 'border-admin-accent bg-admin-accent/10' : 'border-admin-card bg-admin-bg'} flex flex-col items-center justify-center transition-colors hover:border-admin-accent/50 cursor-pointer`}
          onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragActive(false);
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
        >
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-400">Click or drag image to upload</p>
        </div>
      )}
    </div>
  );
}
