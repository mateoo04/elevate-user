import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../header/Header';

const logInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/\d/, 'Must contain at least one number'),
});

export default function LogIn() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(logInSchema) });

  const logInUrl = import.meta.env.VITE_API_BASE_URL + '/auth/log-in';

  const handleLogIn = async (data) => {
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
        <form onSubmit={handleSubmit(handleLogIn)}>
          <label htmlFor='email'>
            Email
            <input type='email' name='email' {...register('email')} />
          </label>
          <label htmlFor='password'>
            Password
            <input type='password' name='password' {...register('password')} />
          </label>
          <input type='submit' value='Log in' />
        </form>
        <p>
          Don't have an account yet? <Link to='/sign-up'>Sign up here</Link>
        </p>
      </main>
    </>
  );
}
