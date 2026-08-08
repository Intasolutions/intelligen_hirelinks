import React, { useState, useEffect } from 'react';

interface ImageUploadPreviewProps {
  label: string;
  initialImageUrl?: string;
  onImageChange: (file: File | null) => void;
  className?: string;
}

export function ImageUploadPreview({ label, initialImageUrl, onImageChange, className = '' }: ImageUploadPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);

  useEffect(() => {
    if (initialImageUrl) {
      setPreviewUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file);
    } else {
      setPreviewUrl(null);
      onImageChange(null);
    }
  };

  return (
    <div className={className}>
      <label>{label}</label>
      {previewUrl ? (
        <div>
          <img src={previewUrl} alt="Preview" style={{ width: 100, height: 100 }} />
          <button onClick={() => { setPreviewUrl(null); onImageChange(null); }}>Remove</button>
        </div>
      ) : (
        <input type="file" onChange={handleFile} />
      )}
    </div>
  );
}

export default function TestPage() {
  const [file, setFile] = useState<File | null>(null);
  // Simulating form.getValues() which returns undefined
  const initialImageUrl = undefined;
  
  return (
    <div>
      <ImageUploadPreview 
        label="Test" 
        initialImageUrl={initialImageUrl} 
        onImageChange={setFile} 
      />
    </div>
  );
}
