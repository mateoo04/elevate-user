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
    <header>
      <h1>
        <Link to='/'>Elevate</Link>
      </h1>
      {hideLogInButton || (
        <>
          {isTokenExpired() ? (
            <button onClick={() => navigate(`/log-in`)}>Log in</button>
          ) : (
            <>
              <p>{fullName}</p>
              <button onClick={handleLogOut}>Log out</button>
            </>
          )}
        </>
      )}
    </header>
  );
}
