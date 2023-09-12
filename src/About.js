import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom'; 

function About() {
  return (
    <div>
      <Helmet>
        <title>About</title>
        <meta name="description" content="Learn more about Hoopsbot and our mission to provide the best basketball content." />
      </Helmet>

      <h2>About</h2>
      <p>
        ShotQuality wire helps you win more
      </p>
      <p>
      {/* <Link to="/checkout" className="nav-link">Checkout</Link> */}
      </p>
      {/* You can add more content or sections as needed */}
    </div>
  );
}

export default About;
