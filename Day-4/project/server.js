const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// Mount routes
app.use('/', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));