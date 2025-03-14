import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
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

  const logInUrl = import.meta.env.VITE_API_BASE_URL + '/auth/sign-up';

  const handleSignUp = async (data) => {
    try {
      const response = await fetch(logInUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const json = await response.json();

      localStorage.setItem('token', json.token);
      localStorage.setItem('tokenExpiry', json.expiresAt);
      localStorage.setItem(
        'userFullName',
        `${json.firstName} ${json.lastName}`
      );
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header hideLogInButton={true}></Header>
      <main>
        <ul>
          {Object.values(errors).map((error) => {
            return <li>{error.message}</li>;
          })}
        </ul>
        <form onSubmit={handleSubmit(handleSignUp)}>
          <label htmlFor='firstName'>
            First name
            <input type='text' name='fullName' {...register('firstName')} />
          </label>
          <label htmlFor='lastName'>
            Last name
            <input type='text' name='lastName' {...register('lastName')} />
          </label>
          <label htmlFor='email'>
            E-mail
            <input type='email' name='email' {...register('email')} />
          </label>
          Password
          <label htmlFor='password'>
            <input type='password' name='password' {...register('password')} />
          </label>
          <label htmlFor='confirmPassword'>
            Confirm password
            <input
              type='password'
              name='confirmPassword'
              {...register('confirmPassword')}
            />
          </label>
          <button type='submits'>Sign up</button>
        </form>
        <p>
          Already a user? <Link to='/log-in'>Log in here</Link>
        </p>
      </main>
    </>
  );
}
