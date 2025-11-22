// src/utils/entropy.ts

export const calculateEntropy = (str: string): number => {
    if (!str) return 0;
  
    const len = str.length;
    const frequencies: Record<string, number> = {};
  
    // Count character frequencies
    for (let i = 0; i < len; i++) {
      const char = str[i];
      frequencies[char] = (frequencies[char] || 0) + 1;
    }
  
    // Calculate entropy using Shannon formula
    let entropy = 0;
    for (const char in frequencies) {
      const p = frequencies[char] / len;
      entropy -= p * Math.log2(p);
    }
  
    return entropy;
  };
  
  export const isHighEntropy = (text: string): boolean => {
    // 1. Check Length (Keys are usually > 8 chars)
    if (text.length < 8) return false;
  
    // 2. Check Complexity (Must have numbers or special chars)
    const hasNumber = /\d/.test(text);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(text);
    if (!hasNumber && !hasSpecial) return false;
  
    // 3. Check Entropy Score
    // "password" = 2.7 (Low)
    // "7f8a92b1" = 4.1 (High)
    const score = calculateEntropy(text);
    return score > 4.0; 
  };

  