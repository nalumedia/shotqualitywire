// Contentful.js

import { createClient } from 'contentful';

// console.log("Access Token:", process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN);
// console.log("Space:", process.env.REACT_APP_CONTENTFUL_SPACE);

const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN
});

export default client;
