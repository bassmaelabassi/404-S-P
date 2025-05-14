// frontend/src/utils/validationSchemas.js
import * as yup from 'yup';

// Registration form validation schema
export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9+\s()-]{8,15}$/, 'Invalid phone number format'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
});

// Login form validation schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  
  password: yup
    .string()
    .required('Password is required')
});

// Profile update validation schema
export const profileUpdateSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
});

// Email update validation schema
export const emailUpdateSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format')
});

// Phone update validation schema
export const phoneUpdateSchema = yup.object().shape({
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9+\s()-]{8,15}$/, 'Invalid phone number format')
});

// Password change validation schema
export const passwordChangeSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .notOneOf([yup.ref('currentPassword')], 'New password must be different from current password'),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
});

// Password reset validation schema
export const passwordResetSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  
  code: yup
    .string()
    .required('Verification code is required')
    .min(6, 'Code must be at least 6 characters'),
  
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
});

// Forgot password validation schema
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format')
});

// Email verification schema
export const emailVerificationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  
  code: yup
    .string()
    .required('Verification code is required')
    .min(6, 'Code must be at least 6 characters')
});

// Admin user update schema
export const adminUserUpdateSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9+\s()-]{8,15}$/, 'Invalid phone number format'),
  
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['user', 'admin'], 'Invalid role'),
  
  isVerified: yup
    .boolean()
    .required('Verification status is required')
});