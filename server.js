const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT;
const app = express();
//connect to db
const connectToDB = require('./db/conn');
connectToDB();

//models $ data files
//for starting and uploading data pruposes
const Post = require('./models/postModel');
const User = require('./models/userModel');
const Comment = require('./models/commentModel');
const postsData = require('./data/posts');
const usersData = require('./data/users');
const commentData = require('./data/comments');

//routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postsRoutes');
const commentRoutes = require('./routes/commentRoutes');

//set up template engine
app.set('view engine', 'ejs');

//add static files from 'public' directory
app.use(express.static('public'));

//use body-parser to access send body in the request
app.use(express.json());
//encoding for data in the form!
app.use(express.urlencoded({ extended: true }));

//Logging requests, custom middleware
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `\n At ${time.toLocaleTimeString()}: ${req.method} request recieved to ${
      req.url
    }`
  );
  if (Object.keys(req.body).length > 0) {
    console.log(`Containg the data: `);
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

//custom middleware for all users routes
app.use('/api/users', (req, res, next) => {
  console.log('---------Users route---------');
  next();
});

//homepage
//render view with main links for /api routes
app.get('/', async (req, res) => {
  const menuLinks = [
    { tagName: 'Users', href: '/api/users' },
    { tagName: 'All Posts', href: '/api/posts' },
  ];
  const posts = await Post.find();
  if (posts.length === 0) {
    await Post.insertMany(postsData);
  }
  const users = await User.find();
  if (users.length === 0) {
    await User.insertMany(usersData);
  }
  const comments = await Comment.find();
  if (comments.length === 0) {
    await Comment.insertMany(commentData);
  }
  res.render('home', { title: 'Welcome to the world of magic', menuLinks });
});

//add hypermedia for /api route
app.get('/api', (req, res) => {
  res.json({
    links: [
      {
        href: 'api/users',
        rel: 'users',
        type: 'GET',
      },
      {
        href: 'api/users',
        rel: 'users',
        type: 'POST',
      },
      {
        href: 'api/posts',
        rel: 'posts',
        type: 'GET',
      },
      {
        href: 'api/posts',
        rel: 'posts',
        type: 'POST',
      },
      {
        href: 'api/comments',
        rel: 'comments',
        type: 'GET',
      },
      {
        href: 'api/comments',
        rel: 'comments',
        type: 'POST',
      },
    ],
  });
});

//use the users router and posts router and comments router
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

//middleware to handling if route not found 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = '404';
  next(err);
});

//error handling middleware
//render view for error
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.message;
  const title = 'error';
  res.status(status);
  res.render('error', { status, msg, title });
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}.`);
});
