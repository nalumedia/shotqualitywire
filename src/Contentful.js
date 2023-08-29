// Contentful.js
// import { createClient } from 'contentful';

// const client = createClient({
//   space: 'qzwnil1y1qss', // Replace with your Space ID
//   accessToken: 'Fpiwp5bs5R4-7kThDg0eJZemA_gDfBVkUHADoF1qlxg' // Replace with your Access Token
// });

// export default client;

import { createClient } from 'contentful';

console.log("Access Token:", process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN);
console.log("Space:", process.env.REACT_APP_CONTENTFUL_SPACE);

const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN
});

export default client;
