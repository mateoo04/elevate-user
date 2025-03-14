import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Post() {
  const [post, setPost] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const logInUrl = import.meta.env.VITE_API_BASE_URL + '/posts/' + id;

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

        setPost(json.post);
        console.log(json.post);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, [id]);

  return (
    <>
      <main>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </main>
    </>
  );
}
