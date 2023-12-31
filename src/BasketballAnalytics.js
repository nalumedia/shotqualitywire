import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from './Contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { Helmet } from 'react-helmet';

function BasketballAnalytics() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const entries = await client.getEntries({
        content_type: 'blog',
        order: '-fields.published',
        'metadata.tags.sys.id[in]': 'basketballAnalytics',
        'fields.targetSite': 'ShotQualityWire' // Adding this line to filter by targetSite
      });
      if (entries.items) setPosts(entries.items);
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const { title, file } = node.data.target.fields;
        const imageUrl = file.url;
        return <img src={`https:${imageUrl}`} alt={title ? title['en-US'] : null} className="img-fluid mb-3" />;
      },
    },
    renderMark: {
      [MARKS.BOLD]: text => <strong>{text}</strong>,
    },
  };

  return (
    <div>
      <Helmet>
        <title>ShotQualityWire - Basketball Analytics</title>
        <meta name="description" content="All about basketball analytics on ShotQualityWire." />
        <link rel="canonical" href="https://shotqualitywire.com/BasketballAnalytics" />
      </Helmet>

      <h2>Basketball Analytics</h2>

      {posts.map(post => (
        <div key={post.sys.id} className="mb-5">
          <Link to={post.fields.postUrl} className="text-decoration-none text-dark">
            {post.fields.postImage &&
              <img
                src={post.fields.postImage.fields.file.url}
                alt={post.fields.postImage.fields.description || ''}
                style={{ maxWidth: '600px' }}
                className="img-fluid mb-3"
              />
            }
            <h3>{post.fields.title}</h3>
          </Link>
          {documentToReactComponents(post.fields.body, options)}
          <p><strong>Published on:</strong> {formatDate(post.fields.published)}</p>
        </div>
      ))}
    </div>
  );
}

export default BasketballAnalytics;
