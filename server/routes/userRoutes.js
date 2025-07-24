const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const bcrypt = require('bcrypt'); // bcrypt is a hashing library, meant to encrypt the password (protected it).

/*============= post: registering new user =============*/
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body; // destructuring the requested data from the frontend.

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10); // create protecting layer thst will secure the password.
    const hashedPassword = await bcrypt.hash(password, salt); // hashing non-protected password with salt protection, what creates encrypted password.

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

/*============= post: login existed user =============*/
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the stored hashed password (the hashed password is complicated)
    const isMatch = await bcrypt.compare(password, user.password); // comapre the function of brcypt library.
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful', username: user.username});
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

/*============= delete: deleting user =============*/
router.delete('/delete/:userId', async(req, res) => {

  const {userId} = req.params;

  try{
      const user = await User.findByIdAndDelete(userId);

      if (!user)
      {
        return res.status(400).json({message: 'User not found'})
      }

      res.status(200).json({message: 'User deleted successfully'});

  } catch (error) {
      res.status(500).json({message: 'Error deleting User', error});
  }
});

/*============= get: getting userId by username =============*/
router.get('/get/:username', async(req, res) => {
  
  const {username} = req.params;

  try {
    const user = await User.findOne({username});
    if (!user)
    {
      return res.status(404).json({message: 'User not found'});
    }

    const userId = user._id;
    if (!userId)
    {
      return res.status(400).json({ message: 'User does not have a userId' });
    }

    res.status(200).json({message: 'userId found', userId});

  } catch (error) {
    res.status(500).json({ message: 'Error retrieving UserId from user', error });
  }
});

/*============= Exporting router =============*/
module.exports = router;