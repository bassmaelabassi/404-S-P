const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { protect } = require('./middlewares/authMiddleware');

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json()); //middlewar

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', dbStatus: mongoose.connection.readyState });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});