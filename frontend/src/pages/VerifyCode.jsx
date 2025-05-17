import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const codeSchema = yup.object().shape({
  code: yup.string()
    .required('Verification code required')
    .length(6, 'Verification code must be 6 digits')
})

const VerifyCode = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(codeSchema),
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/auth/verify',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Verified successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Confirm code </h2>

        <div>
          <label className="block mb-1 font-medium">Enter verification code (6 digits)</label>
          <input {...register('code')} className="input" />
          {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          {isSubmitting ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default VerifyCode;
