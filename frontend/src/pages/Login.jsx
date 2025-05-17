import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const loginSchema = yup.object().shape({
  emailOrPhone: yup.string().required(' Email or phone number required'),
  password: yup.string().required('Password required'),
});

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data);
      const { token } = response.data;
      localStorage.setItem('token', token);
      alert('You have successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <div>
          <label className="block mb-1 font-medium">email ou telephone</label>
          <input {...register('emailOrPhone')} className="input" />
          {errors.emailOrPhone && (
            <p className="text-red-500 text-sm">{errors.emailOrPhone.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">password</label>
          <input type="password" {...register('password')} className="input" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isSubmitting ? 'Logging in...' : 'Logging in'}
        </button>
      </form>
    </div>
  );
};

export default Login;
