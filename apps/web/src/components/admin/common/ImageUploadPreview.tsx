import React, { useState, useEffect } from 'react';
import { X, Upload, Crop as CropIcon } from 'lucide-react';
import { ImageCropDialog, type CropTarget } from './ImageCropDialog';

// Must match the multer limit in apps/api/src/shared/upload.middleware.ts —
// rejecting an oversized file here saves the round trip to the server just
// to get the same answer back.
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FILE_SIZE_LABEL = '10MB';

interface ImageUploadPreviewProps {
  label: string;
  initialImageUrl?: string | null;
  onImageChange: (file: File | null) => void;
  className?: string;
  /**
   * When set, a picked file opens the crop dialog before it reaches
   * onImageChange — the file that ultimately gets passed on is the cropped
   * result, sized to target.outputWidth/outputHeight. Omit to keep a field
   * uncropped (e.g. Partner Logo, which needs its native padding intact).
   */
  cropTarget?: CropTarget;
}

export function ImageUploadPreview({ label, initialImageUrl, onImageChange, className = '', cropTarget }: ImageUploadPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCropSrc, setPendingCropSrc] = useState<string | null>(null);
  const [pendingFileName, setPendingFileName] = useState<string>('image.jpg');

  useEffect(() => {
    if (initialImageUrl) {
      setPreviewUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

  const applyFile = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file);
    } else {
      setPreviewUrl(null);
      onImageChange(null);
    }
  };

  const handleFile = (file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`Image is too large. Please upload a file under ${MAX_FILE_SIZE_LABEL}.`);
        return;
      }
      setError(null);
      if (cropTarget) {
        setPendingFileName(file.name);
        setPendingCropSrc(URL.createObjectURL(file));
        return;
      }
      applyFile(file);
    } else {
      setError(null);
      applyFile(null);
    }
  };

  const handleReplace = () => {
    if (cropTarget && previewUrl) {
      setPendingFileName('image.jpg');
      setPendingCropSrc(previewUrl);
    }
  };

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        {cropTarget && <span className="text-xs text-gray-500">{cropTarget.label}px</span>}
      </div>

      {pendingCropSrc && cropTarget && (
        <ImageCropDialog
          imageSrc={pendingCropSrc}
          fileName={pendingFileName}
          target={cropTarget}
          onCancel={() => setPendingCropSrc(null)}
          onConfirm={(file) => {
            setPendingCropSrc(null);
            applyFile(file);
          }}
        />
      )}

      {previewUrl ? (
        <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-admin-card group bg-[#12181d]">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {cropTarget && (
              <button
                type="button"
                onClick={handleReplace}
                className="bg-admin-accent text-white px-4 py-2 rounded-md hover:bg-admin-accent/90 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <CropIcon className="w-4 h-4" /> Adjust Crop
              </button>
            )}
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
            onChange={(e) => {
              handleFile(e.target.files?.[0] || null);
              // Reset so picking the same (rejected) file again still fires onChange.
              e.target.value = '';
            }}
          />
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-400">Click or drag image to upload</p>
          <p className="mt-1 text-xs text-gray-500">
            Max size {MAX_FILE_SIZE_LABEL}
            {cropTarget && <> · crops to {cropTarget.label}px</>}
          </p>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
