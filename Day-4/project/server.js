// server.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/register', (req, res) => {
  console.log('Register request:', req.body);
  res.status(201).json({ message: 'Test register', data: req.body });
});

app.listen(3000, () => console.log('Server running on port 3000'));