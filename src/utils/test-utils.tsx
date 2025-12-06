import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { FormProvider } from '../context/FormContext';
import { User } from '../types/user.types';

interface AllTheProvidersProps {
  children: React.ReactNode;
  userData?: User | null;
}

const AllTheProviders = ({ children, userData }: AllTheProvidersProps) => {
  // Mock user data in localStorage if provided
  if (userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <FormProvider>
          {children}
        </FormProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  userData?: User | null;
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { userData, ...renderOptions } = options;
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} userData={userData} />,
    ...renderOptions,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Helper functions
export const mockUserData: User = {
  _id: 'test-user-123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'faculty',
  dept: 'CS',
  desg: 'Professor',
  department: 'CS',
};

export const mockAdminUser: User = {
  ...mockUserData,
  _id: 'admin2025',
  role: 'admin',
  desg: 'Admin',
};

export const mockHODUser: User = {
  ...mockUserData,
  role: 'hod',
  desg: 'HOD',
};

export const mockDeanUser: User = {
  ...mockUserData,
  role: 'dean',
  desg: 'Dean',
};

export const mockDirectorUser: User = {
  ...mockUserData,
  role: 'director',
  desg: 'Director',
};

