import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../header/Header';

export default function LogIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const logInUrl = import.meta.env.VITE_API_BASE_URL + '/auth/log-in';

  const handleLogIn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(logInUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header hideLogInButton={true}></Header>
      <main>
        <form onSubmit={handleLogIn}>
          <label htmlFor='email'>
            Email
            <input type='email' name='email' onChange={handleChange} />
          </label>
          <label htmlFor='password'>
            Password
            <input type='password' name='password' onChange={handleChange} />
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
