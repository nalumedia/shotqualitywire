const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email } = JSON.parse(event.body);

  if (!email) {
    return {
      statusCode: 400,
      body: 'Email is required'
    };
  }

  // Here we'll later integrate with SendGrid.
  
  return {
    statusCode: 200,
    body: 'Email capture successful',
  };
};
