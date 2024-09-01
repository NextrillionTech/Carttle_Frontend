import axios from "axios";

const accountSid = "AC9b89eb67bd3f759cf3a9cbb9161dca0e"; // Replace with your Account SID from Twilio
const authToken = "c2de72f3c3fca4f892dfc0e7831af6e2"; // Replace with your Auth Token from Twilio
const twilioNumber = "your_twilio_phone_number"; // Replace with your Twilio phone number

export const sendMessage = async (to, body) => {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const data = new URLSearchParams({
    From: twilioNumber,
    To: to,
    Body: body,
  });

  try {
    const response = await axios.post(url, data.toString(), {
      auth: {
        username: accountSid,
        password: authToken,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
