// Shared constants extracted from StepOfferContent for reuse across sections

export const AVAILABLE_CATEGORIES = [
  { label: "Food & Dining", value: "1" },
  { label: "Pizza", value: "2" },
  { label: "Burgers", value: "3" },
  { label: "Fine Dining", value: "4" },
  { label: "Fast Food", value: "5" },
  { label: "Cafe & Bakery", value: "6" },
  { label: "Retail", value: "7" },
  { label: "Clothing", value: "8" },
  { label: "Electronics", value: "9" },
  { label: "Home Goods", value: "10" },
  { label: "Entertainment", value: "11" },
  { label: "Movies", value: "12" },
  { label: "Sports Events", value: "13" },
  { label: "Services", value: "14" },
  { label: "Auto Repair", value: "15" },
  { label: "Home Services", value: "16" },
  { label: "Health & Wellness", value: "17" },
  { label: "Automotive", value: "18" },
  { label: "Travel", value: "19" },
];

export const AVAILABLE_COMMODITIES = [
  { label: "Entrees", value: "1" },
  { label: "Appetizers", value: "2" },
  { label: "Desserts", value: "3" },
  { label: "Beverages", value: "4" },
  { label: "Alcohol", value: "5" },
  { label: "Gift Cards", value: "6" },
  { label: "Merchandise", value: "7" },
  { label: "Services", value: "8" },
];

export const IMAGE_GUIDELINES = {
  offerImage: {
    recommended: { width: 400, height: 400 },
    minWidth: 200,
    minHeight: 200,
    aspectRatio: "1:1 (square)",
    description: "Square image for offer cards and circle logo overlay",
  },
  offerBanner: {
    recommended: { width: 1200, height: 400 },
    minWidth: 600,
    minHeight: 200,
    aspectRatio: "3:1 (wide)",
    description: "Wide banner for offer detail hero section",
  },
};

// Shared image validation helper
export function validateImageFile(file: File): boolean {
  const validTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    alert("Only PNG and JPG files are allowed.");
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("File must be under 5MB.");
    return false;
  }
  return true;
}

// Get image dimensions from a file
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = URL.createObjectURL(file);
  });
}
