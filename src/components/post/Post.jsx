import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../header/Header';

export default function Post() {
  const [post, setPost] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const logInUrl = import.meta.env.VITE_API_BASE_URL + '/posts/' + id;

    const fetchPosts = async () => {
      try {
        const response = await fetch(logInUrl, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const json = await response.json();

        setPost(json.post);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, [id]);

  return (
    <>
      <Header />
      <main>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <h3>Comments</h3>
        {post.comments?.length === 0 ? (
          <p>No comments</p>
        ) : (
          post.comments?.map((comment) => {
            return (
              <div key={comment.id}>
                <h4>{comment.user.firstName + ' ' + comment.user.lastName}</h4>
                <p>{comment.content}</p>
              </div>
            );
          })
        )}
      </main>
    </>
  );
}
