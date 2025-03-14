import { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsUrl = BASE_URL + '/posts';

    const fetchPosts = async () => {
      try {
        const response = await fetch(postsUrl, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const json = await response.json();

        setPosts(json.posts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Header />
      <main>
        {posts.length === 0 ? (
          <p>Loading...</p>
        ) : (
          posts.map((post) => {
            return (
              <div onClick={() => navigate(`/posts/${post.id}`)} key={post.id}>
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
