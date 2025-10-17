import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseValidationOptions {
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const useValidation = (options: UseValidationOptions = {}) => {// validation işlemleri için custom hook
  const { autoClose = true, autoCloseDelay = 50 } = options;// otomatik kapanma seçenekleri
  const [errors, setErrors] = useState<string[]>([]);// hata mesajları state'i

  // validation fonksiyonu. Tüm zod şemaları için kullanılabilir. zod kütüphanesini kullanır ve bu kütüphanede tanımlı tüm doğrulama kurallarını destekler
  const validate = useCallback(<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
    const result = schema.safeParse(data);// veriyi şemaya göre doğrula
    
    if (result.success) {
      setErrors([]);
      return { success: true, data: result.data };// doğrulama başarılıysa veriyi döndür
    } else {
      const formattedErrors = result.error.issues.map((error: any) => {// hata mesajlarını formatla
  
      return error.message;
      });
      setErrors(formattedErrors);
      return { success: false, errors: formattedErrors };
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const setCustomErrors = useCallback((customErrors: string[]) => {
    setErrors(customErrors);
  }, []);

  return {
    errors,
    validate,
    clearErrors,
    setCustomErrors,
    autoClose,
    autoCloseDelay
  };
};

