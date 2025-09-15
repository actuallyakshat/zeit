import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.ENCRYPTION_SECRET as string;

export function encryptMonthlyIncome(income: number): string {
  const encrypted = CryptoJS.AES.encrypt(
    income.toString(),
    SECRET_KEY
  ).toString();
  return encrypted;
}

export function decryptMonthlyIncome(encryptedIncome: string): number | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedIncome, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    // Check if decryption was successful
    if (!decrypted) {
      console.error("Decryption failed: empty result");
      return null;
    }

    const parsed = parseInt(decrypted, 10);

    // Check if parsing was successful
    if (isNaN(parsed)) {
      console.error("Failed to parse decrypted value:", decrypted);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Decryption error:", error);
    return null; // Return null instead of 0 to indicate failure
  }
}

// Improved helper to check if a value looks encrypted
export function isEncrypted(value: string | null): boolean {
  if (!value) return false;

  // Check if it looks like a CryptoJS encrypted string
  // CryptoJS typically produces base64 strings that start with "U2FsdGVkX1" when salted
  if (value.startsWith("U2FsdGVkX1") || /^[A-Za-z0-9+/]+=*$/.test(value)) {
    try {
      // Try to decrypt - if it fails, it might be encrypted with wrong key
      const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      // If decryption produces a valid result, it's encrypted and decryptable
      if (decrypted && decrypted.length > 0) {
        return true;
      }

      // If it looks encrypted but can't be decrypted, still consider it encrypted
      // This handles cases where the secret key might be different
      console.warn(
        "Value appears encrypted but cannot be decrypted with current key:",
        value.substring(0, 20) + "..."
      );
      return true;
    } catch (error) {
      console.warn("Decryption attempt failed:", error);
      // If it looks like encrypted data but throws an error, still consider it encrypted
      return true;
    }
  }

  return false;
}
