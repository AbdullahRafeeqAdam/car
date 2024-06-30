const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle VIN lookup
app.post('/api/vin', async (req, res) => {
  const { vin } = req.body;
  const apiUrl = `https://vin-decoder-api.p.rapidapi.com/decode-vin?vin=${vin}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'vin-decoder-api.p.rapidapi.com',
      'X-RapidAPI-Key': 'c00cdceac9msh525ee905171f7cdp1bdee6jsn3ab5a2a54938'
    }
  };

  try {
    console.log(`Requesting data for VIN: ${vin}`);
    const response = await axios.get(apiUrl, options);
    console.log('API Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: 'Error fetching data' });
    }
  }
});

// Explicitly serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
