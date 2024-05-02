const User = require('../models/userModel');
const usersData = require('../data/users');

//get all users
module.exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.render('users', { title: 'users', users });
};
