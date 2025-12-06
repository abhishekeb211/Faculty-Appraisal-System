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
});

