require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

(async ()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI, {autoIndex:true});
    console.log('MongoDB connected');
  }catch(err){
    console.error('MongoDB connection error:', err.message);
  }

  app.use(express.json());
  app.use(express.urlencoded({extended:true}));

  app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
  }));

  app.use('/api/auth', authRoutes);

  // Serve static frontend
  app.use(express.static(path.join(__dirname, 'public')));

  // Fallback to index.html for SPA-style routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
})();
