'use client';

import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { cropImageToFile } from '../../../lib/crop-image';

export interface CropTarget {
  /** width / height, e.g. 16/9. */
  aspect: number;
  /** Output pixel dimensions the cropped file is rendered at. */
  outputWidth: number;
  outputHeight: number;
  /** Human label shown in the dialog, e.g. "1600 × 900". */
  label: string;
}

interface ImageCropDialogProps {
  imageSrc: string;
  fileName: string;
  target: CropTarget;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

export function ImageCropDialog({ imageSrc, fileName, target, onCancel, onConfirm }: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsSaving(true);
    try {
      const file = await cropImageToFile(
        imageSrc,
        croppedAreaPixels,
        target.outputWidth,
        target.outputHeight,
        fileName
      );
      onConfirm(file);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-admin-card bg-admin-bg">
        <div className="flex items-center justify-between border-b border-admin-card px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Adjust image</h2>
            <p className="mt-0.5 text-xs text-gray-400">Target size: {target.label}px</p>
          </div>
        </div>

        <div className="relative h-[420px] w-full bg-[#0c1116]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={target.aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-3 border-t border-admin-card px-5 py-4">
          <ZoomOut className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-admin-accent"
            aria-label="Zoom"
          />
          <ZoomIn className="h-4 w-4 shrink-0 text-gray-400" />
        </div>

        <div className="flex justify-end gap-3 border-t border-admin-card px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-md border border-admin-card px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSaving || !croppedAreaPixels}
            className="rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-admin-accent/90 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save crop'}
          </button>
        </div>
      </div>
    </div>
  );
}
