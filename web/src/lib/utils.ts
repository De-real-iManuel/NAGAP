/**
 * Utility functions for NAGAP portal
 */

/**
 * Generates a NAGAP-XXXXXX reference number
 * Uses timestamp + random suffix for uniqueness
 */
export function generateReferenceNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'NAGAP-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

/**
 * Formats a number as Nigerian Naira
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a date as DD/MM/YYYY HH:MM WAT
 */
export function formatNigerianDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} at ${hours}:${mins} WAT`;
}

/**
 * Validates Nigerian phone number format
 */
export function isValidNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return /^(0[789][01]\d{8}|234[789][01]\d{8})$/.test(cleaned);
}

/**
 * Validates BVN format (11 digits)
 */
export function isValidBVN(bvn: string): boolean {
  return /^\d{11}$/.test(bvn.replace(/\s/g, ''));
}

/**
 * Converts file to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

/**
 * Truncates text to given length with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '…';
}

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

export const GRANT_PROGRAMS = [
  'CBN Anchor Borrowers Programme',
  'NIRSAL AGSMEIS',
  'BOA Micro-Agriculture Loan',
  'BOA Small/Medium Agriculture Loan',
  'FMARD APPEALS',
  'IFAD VCDP',
  'State Ministry Program',
];

export const FARM_TYPES = [
  'Crop Farming',
  'Livestock',
  'Poultry',
  'Fishery',
  'Mixed Farming',
  'Agro-processing',
  'Others',
];

export const CROP_LIVESTOCK_OPTIONS = [
  { id: 'crop_rice', label: 'Rice' },
  { id: 'crop_maize', label: 'Maize' },
  { id: 'crop_cassava', label: 'Cassava' },
  { id: 'crop_yam', label: 'Yam' },
  { id: 'crop_poultry', label: 'Poultry' },
  { id: 'crop_catfish', label: 'Catfish' },
  { id: 'crop_cattle', label: 'Cattle' },
  { id: 'crop_goat', label: 'Goat' },
  { id: 'crop_soybean', label: 'Soybean' },
  { id: 'crop_tomato', label: 'Tomato' },
  { id: 'crop_pepper', label: 'Pepper' },
  { id: 'crop_others', label: 'Others' },
];