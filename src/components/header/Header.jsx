import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ hideLogInButton }) {
  const [fullName, setFullName] = useState(
    localStorage.getItem('userFullName')
  );

  const navigate = useNavigate();

  const isTokenExpired = () => {
    const expiryTime = localStorage.getItem('tokenExpiry');

    if (!expiryTime || Date.now() >= expiryTime) return true;

    return false;
  };

  const handleLogOut = () => {
    localStorage.clear('token');
    localStorage.clear('tokenExpiry');
    localStorage.clear('userFullName');

    setFullName('');
  };

  return (
    <header className='container d-flex align-items-center justify-content-between mt-3'>
      <h1>
        <Link className='text-decoration-none text-black' to='/'>
          Elevate
        </Link>
      </h1>
      {hideLogInButton || (
        <div className='dropdown'>
          <button
            className='btn btn-secondary dropdown-toggle bg-transparent border-0 text-black'
            type='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            {fullName}
          </button>
          <ul className='dropdown-menu'>
            {isTokenExpired() ? (
              <>
                <li>
                  <button
                    className='dropdown-item'
                    onClick={() => navigate(`/log-in`)}
                  >
                    Log in
                  </button>
                </li>
                <li>
                  <button
                    className='dropdown-item'
                    onClick={() => navigate(`/sign-up`)}
                  >
                    Sign up
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button className='dropdown-item' onClick={handleLogOut}>
                  Log out
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
