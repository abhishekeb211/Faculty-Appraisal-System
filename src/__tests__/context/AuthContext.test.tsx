import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { mockUserData } from '../../utils/test-utils';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide initial state when user is not authenticated', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.userData).toBeNull();
    expect(result.current.userRole).toBeNull();
  });

  it('should login user and update state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login(mockUserData);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userData).toEqual(mockUserData);
    expect(result.current.userRole).toBe('faculty');
  });

  it('should logout user and clear state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Login first
    act(() => {
      result.current.login(mockUserData);
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.userData).toBeNull();
    expect(localStorage.getItem('userData')).toBeNull();
  });

  it('should derive userRole from role field', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login({ ...mockUserData, role: 'hod' });
    });

    expect(result.current.userRole).toBe('hod');
  });

  it('should derive userRole from desg field when role is not present', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login({ ...mockUserData, role: undefined, desg: 'Dean' });
    });

    expect(result.current.userRole).toBe('dean');
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });

  it('should initialize with userData from localStorage', () => {
    localStorage.setItem('userData', JSON.stringify(mockUserData));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userData).toEqual(mockUserData);
  });

  it('should handle all user roles correctly', () => {
    const roles = ['admin', 'hod', 'dean', 'director', 'external', 'verification_team'];

    roles.forEach((role) => {
      localStorage.clear();
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      act(() => {
        result.current.login({ ...mockUserData, role });
      });

      expect(result.current.userRole).toBe(role);
    });
  });

  it('should handle case-insensitive desg field', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login({ ...mockUserData, role: undefined, desg: 'HOD' });
    });

    expect(result.current.userRole).toBe('hod');
  });

  it('should handle lowercase desg field', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login({ ...mockUserData, role: undefined, desg: 'dean' });
    });

    expect(result.current.userRole).toBe('dean');
  });

  it('should return null userRole when neither role nor desg is present', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login({ ...mockUserData, role: undefined, desg: undefined });
    });

    expect(result.current.userRole).toBeNull();
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('userData', 'invalid-json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.userData).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);

    consoleSpy.mockRestore();
  });

  it('should handle multiple login/logout cycles', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // First cycle
    act(() => {
      result.current.login(mockUserData);
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);

    // Second cycle
    act(() => {
      result.current.login(mockUserData);
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should persist userData in localStorage after login', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login(mockUserData);
    });

    const stored = localStorage.getItem('userData');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual(mockUserData);
  });

  it('should handle userData with token', () => {
    const userDataWithToken = {
      ...mockUserData,
      token: 'test-token-123',
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login(userDataWithToken);
    });

    expect(result.current.userData?.token).toBe('test-token-123');
    const stored = JSON.parse(localStorage.getItem('userData')!);
    expect(stored.token).toBe('test-token-123');
  });

  it('should handle userData with additional properties', () => {
    const extendedUserData = {
      ...mockUserData,
      customField: 'customValue',
      nested: { property: 'value' },
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login(extendedUserData);
    });

    expect(result.current.userData?.customField).toBe('customValue');
    expect(result.current.userData?.nested).toEqual({ property: 'value' });
  });

  it('should update userData when login is called multiple times', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login(mockUserData);
    });

    const updatedUserData = { ...mockUserData, name: 'Updated Name' };
    act(() => {
      result.current.login(updatedUserData);
    });

    expect(result.current.userData?.name).toBe('Updated Name');
    expect(localStorage.getItem('userData')).toBe(JSON.stringify(updatedUserData));
  });

  it('should handle empty localStorage gracefully', () => {
    localStorage.removeItem('userData');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.userData).toBeNull();
  });

  it('should handle logout when not logged in', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isAuthenticated).toBe(false);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('userData')).toBeNull();
  });

  it('should handle role priority (role over desg)', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login({
        ...mockUserData,
        role: 'admin',
        desg: 'Dean',
      });
    });

    // Should use role, not desg
    expect(result.current.userRole).toBe('admin');
  });
});

