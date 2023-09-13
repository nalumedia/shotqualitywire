const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    // Extract email from POST request body
    const email = JSON.parse(event.body).email;

    // Define the data for adding email to SendGrid list
    const listId = process.env.YOUR_SENDGRID_LIST_ID;
    
    const data = {
      list_ids: [listId],
      contacts: [{ email: email }]
    };

    // Make the API call to add the email to the SendGrid list
    const response = await axios({
      method: 'put',
      url: `https://api.sendgrid.com/v3/marketing/contacts`,
      headers: {
        'Authorization': `Bearer ${process.env.YOUR_SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data)
    });

    if (response.status === 202) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email successfully captured" })
      };
    } else {
      throw new Error("Non-202 response from SendGrid");
    }

  } catch (error) {
    console.error("Error capturing email: ", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to capture email" })
    };
  }
};
