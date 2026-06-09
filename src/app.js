const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
require('dotenv').config();


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/dashboard',   require('./routes/dashboard'));
app.use('/api/landlords',   require('./routes/landlords'));
app.use('/api/houses',      require('./routes/houses'));
app.use('/api/students',    require('./routes/students'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/payments',    require('./routes/payments'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status:'success', message:'Pondai Housing API is running' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ status:'error', message:'Route not found' });
});

module.exports = app;