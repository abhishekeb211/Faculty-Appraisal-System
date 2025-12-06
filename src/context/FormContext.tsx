import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormData } from '../types/form.types';

interface FormContextType {
  formData: {
    profile: Record<string, any>;
    teaching: FormData;
    research: FormData;
    administrative: Record<string, any>;
    development: FormData;
  };
  updateFormData: (section: string, data: any) => void;
  getSectionProgress: (section: string) => number;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  children: ReactNode;
}

export function FormProvider({ children }: FormProviderProps) {
  const [formData, setFormData] = useState({
    profile: {},
    teaching: {},
    research: {},
    administrative: {},
    development: {},
  });

  const updateFormData = (section: string, data: any): void => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...data }
    }));
  };

  const getSectionProgress = (section: string): number => {
    const sectionData = formData[section as keyof typeof formData];
    if (!sectionData) return 0;
    
    const totalFields = Object.keys(sectionData).length;
    const filledFields = Object.values(sectionData).filter(value => value && value !== '').length;
    
    return totalFields === 0 ? 0 : Math.round((filledFields / totalFields) * 100);
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, getSectionProgress }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext(): FormContextType {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

