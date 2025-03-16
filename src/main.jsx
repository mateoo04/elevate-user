import { createContext, StrictMode, useContext, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './scss/styles.scss';
import * as bootstrap from 'bootstrap';
import App from './components/app/App';
import Post from './components/post/Post';
import LogIn from './components/log-in/LogIn';
import SignUp from './components/sign-up/SignUp';
import { ToastContainer, Slide } from 'react-toastify';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/posts/:id',
    element: <Post />,
  },
  {
    path: '/log-in',
    element: <LogIn />,
  },
  { path: '/sign-up', element: <SignUp /> },
]);

export const FullNameContext = createContext();

export const FullNameProvider = ({ children }) => {
  const [fullName, setFullName] = useState(
    localStorage.getItem('userFullName')
  );

  const logIn = (newFullName) => setFullName(newFullName);
  const logOut = () => {
    console.log('logging out');
    setFullName('');
  };

  return (
    <FullNameContext.Provider value={{ fullName, logIn, logOut }}>
      {children}
    </FullNameContext.Provider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FullNameProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        transition={Slide}
      />
    </FullNameProvider>
  </StrictMode>
);
