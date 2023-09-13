import React, { useState } from 'react';
import axios from 'axios';

const EmailCaptureForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/.netlify/functions/capture-email', { email });
      setMessage('Thanks for subscribing!');
    } catch (error) {
      setMessage('Oops, something went wrong. Please try again.');
    }
  };

  return (
    <div className="card text-white bg-primary mb-3">
      <div className="card-body">
        <h5 className="card-title">Get the Latest from ShotQuality!</h5>
        <p className="card-text">Stay updated with the latest news and analyses directly in your inbox.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Your email"
              aria-label="Your email"
              aria-describedby="basic-addon2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-dark" type="submit">Let's Go 👍</button>
            </div>
          </div>
        </form>

        {message && <p className="mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default EmailCaptureForm;
