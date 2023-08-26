// PostDetail.js
import React, { useState, useEffect } from 'react';
import client from './Contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useParams } from 'react-router-dom';

function PostDetail() {
  const [post, setPost] = useState(null);
  const { id } = useParams();  // Extracting the 'id' from the current route's parameters

  useEffect(() => {
    client.getEntry(id)
      .then(response => {
        setPost(response);
      })
      .catch(console.error);
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h2>{post.fields.title}</h2>
      {documentToReactComponents(post.fields.body)}
      {/* Add other post details as needed */}
    </div>
  );
}

export default PostDetail;
