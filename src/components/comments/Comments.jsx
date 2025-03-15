import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const commentSchema = z.object({
  content: z.string().min(5, 'Comment must be at least 5 characters long'),
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Comments({ commentsArray, postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (Array.isArray(commentsArray)) {
      setComments(commentsArray);
    }
  }, [commentsArray]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(commentSchema) });

  const postComment = async (data) => {
    reset();
    try {
      const response = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({ content: data.content, postId }),
      });

      if (!response.ok) toast.error('Error posting the comment');

      refreshComments();
    } catch {
      toast.error('Error posting the comment');
    }
  };

  const refreshComments = async () => {
    fetch(`${BASE_URL}/comments?postId=${postId}`, { method: 'GET' })
      .then((response) => response.json())
      .then((json) => {
        setComments(json.comments);
      })
      .catch(() => toast.error('Error fetching comments'));
  };

  const deleteComment = async (comment) => {
    if (comment.user.email !== localStorage.getItem('userEmail')) return;

    fetch(`${BASE_URL}/comments/${comment.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(async (response) => {
        if (response.status === 200) await refreshComments();
      })
      .catch(() => toast.error('Error deleting the comment'));
  };

  return (
    <div className='comments'>
      {localStorage.getItem('token') ? (
        <>
          {Object.values(errors) != 0 && (
            <p>{Object.values(errors).at(0)?.message}</p>
          )}
          <form onSubmit={handleSubmit(postComment)} className='mb-3'>
            <textarea
              className='form-control mb-3'
              name='content'
              id='content'
              {...register('content')}
            ></textarea>
            <button className='btn bg-primary text-white' type='submit'>
              Post comment
            </button>
          </form>
        </>
      ) : (
        <p>
          <Link to='/log-in'>Log in</Link> or <Link to='/sign-up'>sign up</Link>{' '}
          to comment.
        </p>
      )}
      {comments?.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        comments.map((comment) => {
          return (
            <div key={comment.id}>
              <div className='d-flex justify-content-between align-items-center'>
                <p className='text-muted mb-0'>
                  {format(comment.date, 'd.M.yyyy., HH:mm')}
                </p>
                {comment.user?.email === localStorage.getItem('userEmail') ? (
                  <div className='dropdown'>
                    <button
                      className='btn btn-secondary bg-transparent border-0 text-black three-dots'
                      type='button'
                      data-bs-toggle='dropdown'
                      aria-expanded='false'
                    >
                      &#x22EE;
                    </button>
                    <ul className='dropdown-menu'>
                      <li>
                        <button
                          className='dropdown-item'
                          onClick={() => deleteComment(comment)}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <h4>{comment.user?.firstName + ' ' + comment.user?.lastName}</h4>
              <p>{comment.content}</p>
            </div>
          );
        })
      )}
    </div>
  );
}
