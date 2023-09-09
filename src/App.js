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
import WNBA from './WNBA';
import BasketballAnalytics from './BasketballAnalytics';
import CountdownTimer from './CountdownTimer';
import { Helmet } from 'react-helmet';
import OddsPage from './OddsPage';
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

  function truncateWords(text, limit) {
    const words = text.split(/\s+/).slice(0, limit);
    return words.join(' ') + (words.length < text.split(/\s+/).length ? '...' : '');
  }

  function richTextToPlainText(richText) {
    if (!richText || !richText.content) return '';

    let text = '';
    richText.content.forEach(item => {
      if (item.nodeType === 'text') {
        text += item.value;
      } else if (item.content) {
        text += richTextToPlainText(item);
      }
    });
    
    return text;
  }

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
        <CountdownTimer />
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
          <li className="nav-item">
            <Link to="/wnba" className="nav-link">WNBA</Link>
          </li>
          <li className="nav-item">
            <Link to="/BasketballAnalytics" className="nav-link">BasketballAnalytics</Link>
          </li>
          <li className="nav-item">
            <Link to="/odds" className="nav-link">Odds</Link>
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
          <Route path="/wnba" element={<WNBA />} />
          <Route path="/BasketballAnalytics" element={<BasketballAnalytics />} />
          <Route path="/odds" element={<OddsPage />} />
          <Route path="/" element={
            <>
              <main>
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
                          <p>{truncateWords(richTextToPlainText(post.fields.body), 25)}</p>
                          <p><strong>Published on:</strong> {formatDate(post.fields.published)}</p>
                          <Link to={post.fields.postUrl} className="card-link">Read more</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </>
          } />
        </Routes>
      </Elements>

      <footer className="mt-5 d-flex justify-content-between align-items-center">
        <p>© 2023 Hoopsbot. All rights reserved.</p>
        <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a>
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
