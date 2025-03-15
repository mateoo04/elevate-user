import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Header from '../header/Header';
import Comments from '../comments/Comments';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Post() {
  const [post, setPost] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const logInUrl = BASE_URL + '/posts/' + id;

    const fetchPosts = async () => {
      try {
        const response = await fetch(logInUrl, {
          method: 'GET',
        });

        if (!response.ok) toast.error('Error fetching posts');

        const json = await response.json();

        setPost(json.post);
      } catch {
        toast.error('Error fetching posts');
      }
    };

    fetchPosts();
  }, [id]);

  return (
    <>
      <Header />
      <main className='container mt-4'>
        <div className='d-flex justify-content-between'>
          <p>{post.date ? format(post.date, 'd.M.yyyy., HH:mm') : ''}</p>
          {post.author ? (
            <p>By {post.author.firstName + ' ' + post.author.lastName}</p>
          ) : (
            ''
          )}
        </div>
        <h2 className='article-heading mb-3'>{post.title}</h2>
        {post.imageUrl && (
          <img
            className='article-image rounded-4 mb-4'
            src={post.imageUrl}
            alt=''
            width='800px'
            height='auto'
          />
        )}
        <p>{post.content}</p>
        <h3>Comments</h3>
        <Comments commentsArray={post.comments} postId={id} />
      </main>
    </>
  );
}
