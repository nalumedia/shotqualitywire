import React, { useState, useEffect } from 'react';
import client from './Contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import PostDetails from './PostDetails';
import CheckoutForm from './CheckoutForm'; 
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import About from './About';  // Ensure the path is correct
import { Helmet } from 'react-helmet';  // Import react-helmet

const stripePromise = loadStripe("YOUR_PUBLIC_KEY");

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    client.getEntries({ content_type: 'blog' })
      .then(response => {
        setPosts(response.items);
      })
      .catch(console.error);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

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

  return (
    <Router>
      <div className="container">

        {/* React Helmet for Meta Tags */}
        <Helmet>
          <title>All things Basketball Analytics ~ Hoopsbot</title>
          <meta name="description" content="Dive deep into the world of basketball analytics with Hoopsbot. Explore in-depth statistics, game insights, player performance metrics, and the latest trends shaping the court. Elevate your understanding of the game beyond the scoreboard." />
        </Helmet>

        {/* Header */}
        <header className="d-flex justify-content-between align-items-center my-4">
          <Link to="/" className="text-decoration-none">
            <h1 className="logo">Hoopsbot 🏀🤖</h1>
          </Link>
          <input type="text" placeholder="Search..." className="form-control w-50" />
        </header>

        {/* Navigation */}
        <nav className="mb-5">
          <ul className="nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">Blog</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">Contact</Link>
            </li>
            <li className="nav-item">
              <Link to="/checkout" className="nav-link">Checkout</Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={
              <>
                {/* Blog Posts */}
                <main>
                  {posts.map(post => (
                    <div key={post.sys.id} className="mb-5">
                      <Link to={`/post/${post.sys.id}`} className="text-decoration-none text-dark">
                        <h2>{post.fields.title}</h2>
                      </Link>
                      {documentToReactComponents(post.fields.body, options)}
                      <p><strong>Published on:</strong> {formatDate(post.fields.published)}</p>
                    </div>
                  ))}
                </main>
              </>
            } />
          </Routes>
        </Elements>

        {/* Footer */}
        <footer className="mt-5">
          <p>© 2023 Hoopsbot. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
