import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'react-toastify';
import Header from '../header/Header';

const createUserSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/\d/, 'Must contain at least one number'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
  })
  .superRefine(({ password, confirmPassword }, cxt) => {
    if (confirmPassword != password) {
      cxt.addIssue({ message: 'The passwords do not match' });
    }
  });

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createUserSchema) });

  const signUpUrl = import.meta.env.VITE_API_BASE_URL + '/auth/sign-up';

  const handleSignUp = async (data) => {
    try {
      const response = await fetch(signUpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) toast.error('Failed to sign up');

      const json = await response.json();

      localStorage.setItem('token', json.token);
      localStorage.setItem('tokenExpiry', json.expiresAt);
      localStorage.setItem(
        'userFullName',
        `${json.firstName} ${json.lastName}`
      );
      localStorage.setItem('userEmail', json.email);

      navigate('/');
    } catch {
      toast.error('Failed to sign up');
    }
  };

  return (
    <>
      <Header hideLogInButton={true}></Header>
      <main className='flex-grow-1 d-flex flex-column justify-content-center align-items-center'>
        {Object.values(errors).length ? (
          <div className='bg-warning rounded-4 p-3 mb-3'>
            <ul className='ps-3 mb-0'>
              {Object.values(errors).map((error) => {
                return <li>{error.message}</li>;
              })}
            </ul>
          </div>
        ) : (
          ''
        )}
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className='d-flex flex-column align-items-center mb-4'
        >
          <label htmlFor='firstName'>
            First name
            <input
              type='text'
              name='fullName'
              {...register('firstName')}
              className='form-control mb-3'
            />
          </label>
          <label htmlFor='lastName'>
            Last name
            <input
              type='text'
              name='lastName'
              {...register('lastName')}
              className='form-control mb-3'
            />
          </label>
          <label htmlFor='email'>
            E-mail
            <input
              type='email'
              name='email'
              {...register('email')}
              className='form-control mb-3'
            />
          </label>
          <label htmlFor='password'>
            Password
            <input
              type='password'
              name='password'
              {...register('password')}
              className='form-control mb-3'
            />
          </label>
          <label htmlFor='confirmPassword'>
            Confirm password
            <input
              type='password'
              name='confirmPassword'
              {...register('confirmPassword')}
              className='form-control mb-3'
            />
          </label>
          <button type='submits' className='btn bg-primary text-white'>
            Sign up
          </button>
        </form>
        <p className='text-center'>
          Already a user? <Link to='/log-in'>Log in here</Link>
        </p>
      </main>
    </>
  );
}
