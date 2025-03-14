import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './components/app/App';
import Post from './components/post/Post';
import LogIn from './components/log-in/LogIn';
import SignUp from './components/sign-up/SignUp';

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
