import React, { useState, useEffect } from 'react';
import client from './Contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { BrowserRouter as Router, Route, Link, Routes, useLocation } from 'react-router-dom';
import PostDetails from './PostDetails';
import CheckoutForm from './CheckoutForm'; 
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import About from './About'; 
import Calendar from './Calendar'; 
import Contact from './Contact';  
import { Helmet } from 'react-helmet';
import ReactGA4 from 'react-ga4';

const stripePromise = loadStripe("YOUR_PUBLIC_KEY");

function MainContent() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    client.getEntries({
      content_type: 'blog',
      order: '-fields.published'
    })
    .then(response => {
      setPosts(response.items);
    })
    .catch(console.error);
  }, []);

  useEffect(() => {
    ReactGA4.initialize('G-80L7YYXV7R');
    ReactGA4.send('pageview');
  }, [location]);

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
    <div className="container">
      <Helmet>
        <title>All things Basketball Analytics ~ Hoopsbot</title>
        <meta name="description" content="Dive deep into the world of basketball analytics with Hoopsbot." />
      </Helmet>

      <header className="d-flex justify-content-between align-items-center my-4">
        <Link to="/" className="text-decoration-none">
          <h1 className="logo">Hoopsbot 🏀🤖</h1>
        </Link>
        <input type="text" placeholder="Search..." className="form-control w-50" />
      </header>

      <nav className="mb-5">
        <ul className="nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">Blog</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">About</Link>
          </li>
          <li className="nav-item">
            <Link to="/calendar" className="nav-link">Calendar</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">Contact</Link>
          </li>
        </ul>
      </nav>

      <Elements stripe={stripePromise}>
        <Routes>
          {posts.map((post) => (
            <Route path={post.fields.postUrl} key={post.sys.id} element={<PostDetails id={post.sys.id} />} />
          ))}
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/" element={
            <>
              <main>
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

      <footer className="mt-5">
        <p>© 2023 Hoopsbot. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;
