// Shared validation utilities for edge functions
// Note: We can't import zod in Deno edge functions directly, so we use manual validation

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function validateEmail(email: string): ValidationResult<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = email.trim();
  
  if (!trimmed) {
    return { success: false, error: "L'email est requis" };
  }
  
  if (trimmed.length > 255) {
    return { success: false, error: "L'email ne peut pas dépasser 255 caractères" };
  }
  
  if (!emailRegex.test(trimmed)) {
    return { success: false, error: "Format d'email invalide" };
  }
  
  return { success: true, data: trimmed };
}

export function validateNumber(value: any, fieldName: string, options: { min?: number; max?: number; integer?: boolean } = {}): ValidationResult<number> {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { success: false, error: `${fieldName} doit être un nombre valide` };
  }
  
  if (options.integer && !Number.isInteger(num)) {
    return { success: false, error: `${fieldName} doit être un nombre entier` };
  }
  
  if (options.min !== undefined && num < options.min) {
    return { success: false, error: `${fieldName} doit être supérieur ou égal à ${options.min}` };
  }
  
  if (options.max !== undefined && num > options.max) {
    return { success: false, error: `${fieldName} doit être inférieur ou égal à ${options.max}` };
  }
  
  return { success: true, data: num };
}

export function validateString(value: any, fieldName: string, options: { minLength?: number; maxLength?: number; required?: boolean } = {}): ValidationResult<string> {
  const str = typeof value === 'string' ? value.trim() : String(value || '');
  
  if (options.required && !str) {
    return { success: false, error: `${fieldName} est requis` };
  }
  
  if (options.minLength !== undefined && str.length < options.minLength) {
    return { success: false, error: `${fieldName} doit contenir au moins ${options.minLength} caractères` };
  }
  
  if (options.maxLength !== undefined && str.length > options.maxLength) {
    return { success: false, error: `${fieldName} ne peut pas dépasser ${options.maxLength} caractères` };
  }
  
  return { success: true, data: str };
}

export function validateEnum<T extends string>(value: any, fieldName: string, allowedValues: T[]): ValidationResult<T> {
  const str = typeof value === 'string' ? value.trim() : String(value || '');
  
  if (!allowedValues.includes(str as T)) {
    return { success: false, error: `${fieldName} doit être l'une des valeurs suivantes: ${allowedValues.join(', ')}` };
  }
  
  return { success: true, data: str as T };
}
