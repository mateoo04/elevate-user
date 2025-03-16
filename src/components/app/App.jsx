import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import imageSvg from '../../assets/image.svg';
import { toast } from 'react-toastify';

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
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (!response.ok) throw new Error('Failed to fetch posts');

        const json = await response.json();

        setPosts(json.posts);
      } catch {
        toast.error('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Header />
      <main className='container mt-4 mb-4'>
        {posts.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className='row g-3'>
            {posts.map((post) => {
              return (
                <div className='col-sm-6 col-lg-4' key={'container-' + post.id}>
                  <div
                    className='card h-100'
                    onClick={() => navigate(`/posts/${post.id}`)}
                    key={post.id}
                  >
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        className='card-img-top'
                        alt=''
                      />
                    ) : (
                      <div className='card-img-top d-flex align-content-center justify-content-center border-bottom border-2'>
                        <img src={imageSvg} width='64px' alt='' />
                      </div>
                    )}
                    <div className='card-body'>
                      <h3 className='card-title'>{post.title}</h3>
                      <p>
                        {post.author
                          ? `By ${post.author.firstName} ${post.author.lastName}`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default App;
