import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const registerSchema = yup.object().shape({
  fullName: yup.string().required('Full name required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email(' Invalid email').required(' Email required'),
  phone: yup.string().required('Phone number required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password required'),
});

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', data);
      console.log(response.data);
      alert('Registration successful! Please check your email or phone number.');
      navigate('/verify');
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'An error occurred while registering.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4"> Create a new account</h2>
        <div>
          <label className="block mb-1 font-medium">user name</label>
          <input {...register('username')} className="input" />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium"> email</label>
          <input type="email" {...register('email')} className="input" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium"> phone</label>
          <input {...register('phone')} className="input" />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">password </label>
          <input type="password" {...register('password')} className="input" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
