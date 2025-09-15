import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.ENCRYPTION_SECRET || "your-secret-key-here";

export function encryptMonthlyIncome(income: number): string {
  const encrypted = CryptoJS.AES.encrypt(
    income.toString(),
    SECRET_KEY
  ).toString();
  return encrypted;
}

export function decryptMonthlyIncome(encryptedIncome: string): number {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedIncome, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return parseInt(decrypted, 10);
  } catch (error) {
    console.error("Decryption error:", error);
    return 0; // Fallback value
  }
}

// Helper to check if a value looks encrypted
export function isEncrypted(value: string | null): boolean {
  if (!value) return false;
  // crypto-js encrypted strings typically contain base64 characters
  return /^[A-Za-z0-9+/]+=*$/.test(value);
}
