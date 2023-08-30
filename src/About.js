import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom'; 

function About() {
  return (
    <div>
      <Helmet>
        <title>About - Hoopsbot Blog 🏀🤖</title>
        <meta name="description" content="Learn more about Hoopsbot and our mission to provide the best basketball content." />
      </Helmet>

      <h2>About Hoopsbot</h2>
      <p>
        Hoopsbot is your go-to platform for the latest basketball news, stories, and updates. 
        Our mission is to provide fans with unparalleled insights into the world of basketball.
      </p>
      <p>
      {/* <Link to="/checkout" className="nav-link">Checkout</Link> */}
      </p>
      {/* You can add more content or sections as needed */}
    </div>
  );
}

export default About;
