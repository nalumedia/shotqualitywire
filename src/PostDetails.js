// PostDetail.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import client from './Contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types'; // Import BLOCKS and MARKS from rich text types
import { Helmet } from 'react-helmet';  // Import Helmet

function PostDetail({ id }) { // Destructure the id prop
  const [post, setPost] = useState(null);

  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const { title, description, file } = node.data.target.fields;
        const imageUrl = file.url;
        return <img src={`https:${imageUrl}`} alt={title ? title['en-US'] : null} className="img-fluid mb-3" />;
      },
    },
    renderMark: {
      [MARKS.BOLD]: text => <strong>{text}</strong>,
    },
  };

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
      <Helmet>
        <title>{post.fields.metaTitle || post.fields.title}</title>  {/* Use metaTitle if available, fallback to post title */}
        {post.fields.metaDescription && <meta name="description" content={post.fields.metaDescription} />} {/* Set meta description if available */}
      </Helmet>

      {post.fields.postImage &&
        <img
          src={post.fields.postImage.fields.file.url}
          alt={post.fields.postImage.fields.description || ''}
          style={{ maxWidth: '600px' }}
          className="img-fluid mb-3"
        />
      }

      <h2>{post.fields.title}</h2>
      {documentToReactComponents(post.fields.body, options)}
      {/* Add other post details as needed */}
    </div>
  );
}

// Validate the id prop type
PostDetail.propTypes = {
  id: PropTypes.string.isRequired,
};

export default PostDetail;
