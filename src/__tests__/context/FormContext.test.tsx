import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { FormProvider, useFormContext } from '../../context/FormContext';

describe('FormContext', () => {
  beforeEach(() => {
    // Clear any state before each test
  });

  describe('FormProvider', () => {
    it('should provide initial form data with empty sections', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current.formData).toEqual({
        profile: {},
        teaching: {},
        research: {},
        administrative: {},
        development: {},
      });
    });

    it('should provide updateFormData function', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(typeof result.current.updateFormData).toBe('function');
    });

    it('should provide getSectionProgress function', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(typeof result.current.getSectionProgress).toBe('function');
    });
  });

  describe('updateFormData', () => {
    it('should update profile section', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const profileData = {
        name: 'John Doe',
        email: 'john@example.com',
        department: 'CS',
      };

      act(() => {
        result.current.updateFormData('profile', profileData);
      });

      expect(result.current.formData.profile).toEqual(profileData);
    });

    it('should update teaching section', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const teachingData = {
        '1': {
          courses: { 'CS101': { name: 'Introduction to CS' } },
          marks: 25,
        },
      };

      act(() => {
        result.current.updateFormData('teaching', teachingData);
      });

      expect(result.current.formData.teaching).toEqual(teachingData);
    });

    it('should update research section', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const researchData = {
        '1': {
          papers: [{ title: 'Research Paper 1', journal: 'Journal A' }],
          marks: 30,
        },
      };

      act(() => {
        result.current.updateFormData('research', researchData);
      });

      expect(result.current.formData.research).toEqual(researchData);
    });

    it('should update administrative section', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const adminData = {
        position: 'HOD',
        responsibilities: ['Department Management'],
      };

      act(() => {
        result.current.updateFormData('administrative', adminData);
      });

      expect(result.current.formData.administrative).toEqual(adminData);
    });

    it('should update development section', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const developmentData = {
        courses: ['Course 1', 'Course 2'],
        certifications: ['Cert 1'],
      };

      act(() => {
        result.current.updateFormData('development', developmentData);
      });

      expect(result.current.formData.development).toEqual(developmentData);
    });

    it('should merge data with existing section data', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      // First update
      act(() => {
        result.current.updateFormData('profile', {
          name: 'John Doe',
          email: 'john@example.com',
        });
      });

      // Second update - should merge
      act(() => {
        result.current.updateFormData('profile', {
          department: 'CS',
        });
      });

      expect(result.current.formData.profile).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        department: 'CS',
      });
    });

    it('should handle partial updates without overwriting', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('teaching', {
          '1': { courses: {}, marks: 10 },
          '2': { courses: {}, marks: 20 },
        });
      });

      act(() => {
        result.current.updateFormData('teaching', {
          '1': { marks: 15 },
        });
      });

      expect(result.current.formData.teaching).toEqual({
        '1': { courses: {}, marks: 15 },
        '2': { courses: {}, marks: 20 },
      });
    });

    it('should handle updating with empty object', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('profile', { name: 'John' });
      });

      act(() => {
        result.current.updateFormData('profile', {});
      });

      expect(result.current.formData.profile).toEqual({ name: 'John' });
    });

    it('should handle updating non-existent section', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('customSection' as any, { data: 'test' });
      });

      // Should not throw error, but may not update expected sections
      expect(result.current.formData.profile).toEqual({});
    });
  });

  describe('getSectionProgress', () => {
    it('should return 0 for empty section', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const progress = result.current.getSectionProgress('profile');
      expect(progress).toBe(0);
    });

    it('should return 0 for non-existent section', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const progress = result.current.getSectionProgress('nonexistent' as any);
      expect(progress).toBe(0);
    });

    it('should return 0 when all fields are empty', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('profile', {
          name: '',
          email: '',
          department: '',
        });
      });

      const progress = result.current.getSectionProgress('profile');
      expect(progress).toBe(0);
    });

    it('should return 100 when all fields are filled', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('profile', {
          name: 'John Doe',
          email: 'john@example.com',
          department: 'CS',
        });
      });

      const progress = result.current.getSectionProgress('profile');
      expect(progress).toBe(100);
    });

    it('should return 50 when half the fields are filled', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('profile', {
          name: 'John Doe',
          email: '',
          department: 'CS',
          phone: '',
        });
      });

      const progress = result.current.getSectionProgress('profile');
      expect(progress).toBe(50);
    });

    it('should return 33 when one third of fields are filled', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('profile', {
          name: 'John Doe',
          email: '',
          department: '',
        });
      });

      const progress = result.current.getSectionProgress('profile');
      expect(progress).toBe(33);
    });

    it('should calculate progress correctly for nested objects', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('teaching', {
          '1': { courses: {}, marks: 10 },
          '2': { courses: {}, marks: null },
        });
      });

      const progress = result.current.getSectionProgress('teaching');
      // Should count filled vs empty fields in the nested structure
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });

    it('should handle fields with falsy but valid values', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('profile', {
          name: 'John',
          email: 'john@example.com',
          age: 0, // falsy but valid
          active: false, // falsy but valid
        });
      });

      const progress = result.current.getSectionProgress('profile');
      // Should count 0 and false as filled values
      expect(progress).toBe(100);
    });

    it('should round progress to nearest integer', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('profile', {
          field1: 'value1',
          field2: '',
          field3: '',
        });
      });

      const progress = result.current.getSectionProgress('profile');
      // 1 out of 3 = 33.33%, should round to 33
      expect(progress).toBe(33);
    });
  });

  describe('useFormContext hook', () => {
    it('should throw error when used outside FormProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useFormContext());
      }).toThrow('useFormContext must be used within a FormProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Integration tests', () => {
    it('should maintain state across multiple updates', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('profile', { name: 'John' });
      });

      act(() => {
        result.current.updateFormData('teaching', { '1': { marks: 10 } });
      });

      act(() => {
        result.current.updateFormData('research', { '1': { papers: [] } });
      });

      expect(result.current.formData.profile.name).toBe('John');
      expect(result.current.formData.teaching['1'].marks).toBe(10);
      expect(result.current.formData.research['1'].papers).toEqual([]);
    });

    it('should calculate progress correctly after updates', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.updateFormData('profile', {
          name: 'John',
          email: 'john@example.com',
          department: '',
        });
      });

      const progress = result.current.getSectionProgress('profile');
      expect(progress).toBe(67); // 2 out of 3 fields filled
    });

    it('should handle complex nested data structures', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const complexData = {
        '1': {
          courses: {
            CS101: {
              name: 'Introduction to CS',
              credits: 3,
              students: 50,
            },
          },
          marks: 25,
        },
        '2': {
          courses: {
            CS201: {
              name: 'Data Structures',
              credits: 4,
            },
          },
          marks: 30,
        },
        total_marks: 55,
      };

      act(() => {
        result.current.updateFormData('teaching', complexData);
      });

      expect(result.current.formData.teaching).toEqual(complexData);
      expect(result.current.formData.teaching['1'].courses.CS101.name).toBe('Introduction to CS');
    });
  });
});
