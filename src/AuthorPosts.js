import React, { useState, useEffect } from 'react';
import client from './Contentful';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function AuthorPosts() {
  const [posts, setPosts] = useState([]);
  const { authorId } = useParams();  // Extracting the authorId from the URL

  useEffect(() => {
    client.getEntries({
      content_type: 'blog',
      order: '-fields.published',
      'fields.blogAuthor.sys.id': authorId  // Using the authorId to fetch posts
    })
    .then(response => {
      console.log("Author Posts:", response.items);
      setPosts(response.items);
    })
    .catch(console.error);
  }, [authorId]);

  return (
    <div>
      {posts.map(post => (
        <div key={post.sys.id}>
          <Link to={post.fields.postUrl}>
            {post.fields.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default AuthorPosts;
