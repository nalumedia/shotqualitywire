import React, { useState, useEffect } from 'react';
import client from './Contentful';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function extractTextFromRichText(richText) {
    if (!richText || !richText.content) return '';
    let text = '';
    richText.content.forEach(item => {
        if (item.nodeType === 'text') {
            text += item.value;
        } else if (item.content) {
            text += extractTextFromRichText(item);
        }
    });
    return text;
}

function AuthorPosts() {
    const [posts, setPosts] = useState([]);
    const { authorId } = useParams();

    useEffect(() => {
        client.getEntries({
            content_type: 'blog',
            order: '-fields.published',
            'fields.blogAuthor.sys.id': authorId,
            'fields.targetSite': 'ShotQualityWire'  // Adding this line to filter by targetSite
        })
        .then(response => {
            setPosts(response.items);
        })
        .catch(console.error);
    }, [authorId]);

    const author = posts[0]?.fields.blogAuthor;

    return (
        <div>
            {author && (
                <div className="d-flex align-items-center mb-4">
                    <img
                        src={author.fields.authorImage.fields.file.url}
                        alt={author.fields.name}
                        style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '20px' }}
                    />
                    <div>
                        <h2>{author.fields.name}</h2>
                        <p>{extractTextFromRichText(author.fields.authorBio)}</p>
                    </div>
                </div>
            )}

            <div className="row">
                {posts.map(post => (
                    <div key={post.sys.id} className="col-md-4 mb-5">
                        <div className="card">
                            <Link to={post.fields.postUrl}>
                                {post.fields.postImage &&
                                    <img
                                        src={post.fields.postImage.fields.file.url}
                                        alt={post.fields.postImage.fields.description || ''}
                                        className="card-img-top"
                                    />
                                }
                            </Link>
                            <div className="card-body">
                                <Link to={post.fields.postUrl} className="text-decoration-none text-dark">
                                    <h5 className="card-title">{post.fields.title}</h5>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AuthorPosts;
