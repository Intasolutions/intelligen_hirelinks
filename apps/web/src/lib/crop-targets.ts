import type { CropTarget } from '../components/admin/common/ImageCropDialog';

function target(outputWidth: number, outputHeight: number): CropTarget {
  return {
    aspect: outputWidth / outputHeight,
    outputWidth,
    outputHeight,
    label: `${outputWidth} × ${outputHeight}`,
  };
}

// One crop per field, sized for that field's primary/most prominent public
// placement (see the image-upload case study). Fields not listed here
// (Partner Logo, Settings logos/favicon/OG image) stay uncropped —
// logos need their native transparent padding intact, not a forced crop.
export const CROP_TARGETS = {
  blogImage: target(1600, 900), // 16:9 — blog detail hero
  serviceProgramPrimary: target(1600, 900), // 16:9 — service/program detail hero
  serviceProgramSecondary: target(1200, 900), // 4:3 — benefits section
  customerPhoto: target(800, 800), // 1:1 — testimonial photo
  studentPhoto: target(750, 1000), // 3:4 — placed-student carousel
  pageCoverImage: target(1600, 686), // 21:9 — privacy/terms banner
} as const;
