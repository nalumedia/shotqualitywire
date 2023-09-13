import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import client from './Contentful';
import { Link } from 'react-router-dom';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { Helmet } from 'react-helmet';
import EmailCaptureForm from './EmailCaptureForm'; 

function PostDetail({ id }) {
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

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
    client.getEntry(id, {
      include: 3  // fetch linked entries up to 3 levels deep
    })
    .then(response => {
      setPost(response);
    })
    .catch(console.error);

    client.getEntries({
      content_type: 'blog',
      order: '-fields.published',
      limit: 5
    })
    .then(response => {
      setRecentPosts(response.items);
    })
    .catch(console.error);

  }, [id]);

  if (!post) return <div>Loading...</div>;

  const author = post.fields ? post.fields.blogAuthor : null;

  return (
    <div className="container mt-5">
      <Helmet>
        <title>{post.fields?.metaTitle || post.fields?.title}</title>
        {post.fields?.metaDescription && <meta name="description" content={post.fields.metaDescription} />}
        <link rel="canonical" href={`https://hoopsbot.com${post.fields?.postUrl}`} />
      </Helmet>
      <div className="row">
        <div className="col-md-8">
          {post.fields?.postImage && (
            <img
              src={post.fields.postImage.fields.file.url}
              alt={post.fields.postImage.fields.description || ''}
              className="img-fluid mb-3"
            />
          )}
          {post.fields && <h2>{post.fields.title}</h2>}
          {post.sys && <p className="text-muted">Posted at: {new Date(post.sys.createdAt).toLocaleDateString()}</p>}
          <div className="d-flex align-items-center mb-4">
            {author && author.fields && (
              <>
                <img
                  src={author.fields.authorImage.fields.file.url}
                  alt={author.fields.name}
                  style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px' }}
                />
                <Link to={`/author/${author.sys.id}`}>{author.fields.name}</Link>
              </>
            )}
          </div>
          {post.fields && documentToReactComponents(post.fields.body, options)}
        </div>
        <div className="col-md-4">
        <EmailCaptureForm /> 
          <h4 className="mb-4">Recent Posts</h4>
          <ul>
            {recentPosts.map(recentPost => (
              <li key={recentPost.sys.id} className="mb-2">
                <Link to={recentPost.fields.postUrl}>{recentPost.fields.title}</Link>
              </li>
            ))}
          </ul>
          {/* Added Winning Metrics Section */}
         {/* Display Winning Metrics if available */}
         {post.fields?.winningMetricsIn && post.fields.winningMetricsIn.length > 0 && (
          <>
            <h4 className="mb-4">Winning Metrics</h4>
            <ul>
              {post.fields.winningMetricsIn.map((metric, index) => (
                <li key={metric.sys.id}>
                  <Link to={`/winningmetric/${metric.sys.id}`}>{metric.fields.metricName}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      </div>
    </div>
  );
}

PostDetail.propTypes = {
  id: PropTypes.string.isRequired,
};

export default PostDetail;
