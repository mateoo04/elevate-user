import { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const logInUrl = BASE_URL + '/posts';

    const fetchPosts = async () => {
      try {
        const response = await fetch(logInUrl, {
          method: 'GET',
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const json = await response.json();

        setPosts(json.posts);
        console.log(json.posts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <h1>Home</h1>
      <main>
        {posts.length === 0 ? (
          <p>Loading...</p>
        ) : (
          posts.map((post) => {
            return (
              <div onClick={() => navigate(`/posts/${post.id}`)}>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
              </div>
            );
          })
        )}
      </main>
    </>
  );
}

export default App;
