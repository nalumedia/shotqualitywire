import React, { useState, useEffect } from 'react';
import client from './Contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
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
import AuthorPosts from './AuthorPosts';
import WNBABettingAnalysis from './WNBABettingAnalysis';
import WinningMetricsGlossary from './WinningMetricsGlossary.js';
import WinningMetricDetails from './WinningMetricDetails';


// Importing the required functions from helpers.js
import { formatDate, options, truncateWords, richTextToPlainText } from './helpers';

const stripePromise = loadStripe("YOUR_PUBLIC_KEY");

function MainContent() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    client.getEntries({
      content_type: 'blog',
      'fields.targetSite': 'ShotQualityWire', // add this line to filter by targetSite
      order: '-fields.published',
      include: 2  // fetch linked entries up to 2 levels deep
    })
    .then(response => {
      setPosts(response.items);
    })
    .catch(console.error);
  }, []);

  useEffect(() => {
    ReactGA4.initialize('G-Y7Y5QEKM7Q');  // New Measurement ID
    ReactGA4.send('pageview');
  }, [location]);

  return (
    <div className="container">
      <Helmet>
        <title>ShotQualityWire - Win More</title>
        <meta name="description" content="Basketball news, analysis, analytics, and predictions powered by the best data in basketball." />
      </Helmet>

      {/* <header className="d-flex justify-content-between align-items-center my-4">
        <Link to="/" className="text-decoration-none">
            <h1 className="logo">ShotQualityWire</h1>
        </Link>
        <CountdownTimer />
      </header> */}

      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
        <Link className="navbar-brand" to="/">ShotQualityWire</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to="/BasketballAnalytics" className="nav-link">📊 Basketball Analytics</Link>
            </li>
            <li className="nav-item">
              <Link to="/odds" className="nav-link">🤑 Basketball Odds</Link>
            </li>
            <li className="nav-item">
              <Link to="/wnba-betting-analysis" className="nav-link">📊 WNBA Betting Analysis</Link>
            </li>
            <li className="nav-item">
              <Link to="/winningmetricsglossary" className="nav-link">📊 Winning Metrics Glossary</Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/calendar" className="nav-link">🗓️ 2023-24 Basketball Calendar</Link>
            </li>
            <li className="nav-item">
              <Link to="/wnba" className="nav-link">🏀 WNBA Basketball Analysis</Link>
            </li>
           */}
          </ul>
          {/* Uncomment this section when you want to enable search */}
          {/* 
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
          */}
        </div>
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
          <Route path="/author/:authorId" element={<AuthorPosts />} />
          <Route path="/wnba-betting-analysis" element={<WNBABettingAnalysis />} />
          <Route path="/winningmetricsglossary" element={<WinningMetricsGlossary />} />
          <Route path="/winningmetric/:id" element={<WinningMetricDetails />} />
          <Route path="/" element={
            <>
              <main>
              <CountdownTimer />
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
                          <p>{truncateWords(richTextToPlainText(post.fields.body), 25)}
                          <br /><Link to={post.fields.postUrl} className="card-link">> More</Link></p>
                          
                          <p>{formatDate(post.fields.published)}</p>
                          {post.fields.blogAuthor && (
                            <div className="d-flex align-items-center mt-2">
                              <img
                                src={post.fields.blogAuthor.fields.authorImage.fields.file.url}
                                alt={post.fields.blogAuthor.fields.name}
                                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                              />
                              <span className="ml-2">
                                <Link to={`/author/${post.fields.blogAuthor.sys.id}`}>
                                  {post.fields.blogAuthor.fields.name}
                                </Link>
                              </span>
                            </div>
                          )}
                          
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
        <p>© 2023 ShotQualityWire. All rights reserved.</p>
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
