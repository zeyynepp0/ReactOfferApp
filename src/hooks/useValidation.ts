import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseValidationOptions {
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const useValidation = (options: UseValidationOptions = {}) => {
  const { autoClose = true, autoCloseDelay = 5000 } = options;
  const [errors, setErrors] = useState<string[]>([]);

  const validate = useCallback(<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
    const result = schema.safeParse(data);
    
    if (result.success) {
      setErrors([]);
      return { success: true, data: result.data };
    } else {
      const formattedErrors = result.error.issues.map((error: any) => {
        const path = error.path.join('.');
        return path ? `${path}: ${error.message}` : error.message;
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

