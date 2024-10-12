const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../model/userSchema/userSchema');

// Signup
const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const isExist = await User.findOne({ $or: [{ email }, { username }] });

    if (isExist) {
      return res.status(400).json({ error: 'Email or Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userResponse = await User.findOne({ email });
    if (!userResponse) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, userResponse.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: userResponse._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const user = {
      _id: userResponse._id,
      name: userResponse.name
    }
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};


module.exports = {
  signup,
  login
}