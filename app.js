const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const serviceProviderRoutes = require('./routes/serviceProviderRoutes');
const profileRoutes = require('./routes/profileRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

//require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://tirthshsh2123:tirth2123@cluster0.cbn7ivh.mongodb.net/');

//mongoose.connect(process.env.MONGO_URI);

app.use('/api/user', userRoutes);
app.use('/api/provider', serviceProviderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/review', reviewRoutes);

app.listen(3000, () => console.log('Server started on port 3000'));
