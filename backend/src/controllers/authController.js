require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Admin emails
const ADMIN_EMAILS = ['admin@example.com'];

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /login-or-create (main login route)
exports.loginOrCreate = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      const isAdminEmail = ADMIN_EMAILS.includes(normalizedEmail);
      const role = isAdminEmail ? 'admin' : 'employee';
      const department = isAdminEmail ? 'Management' : 'General';

      user = await User.create({
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: password,
        role,
        department
      });

      user = await User.findById(user._id).select('+password');
    } else {
      const isAdminEmail = ADMIN_EMAILS.includes(normalizedEmail);
      if (isAdminEmail && user.role !== 'admin') {
        user = await User.findByIdAndUpdate(
          user._id,
          { role: 'admin', department: 'Management' },
          { new: true }
        ).select('+password');
      }
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });

  } catch (error) {
    console.error('Login/Create error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /login-or-create?email=xxx&password=yyy (for testing)
exports.loginOrCreateGet = async (req, res) => {
  try {
    const { email, password } = req.query;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      const isAdminEmail = ADMIN_EMAILS.includes(normalizedEmail);
      const role = isAdminEmail ? 'admin' : 'employee';
      const department = isAdminEmail ? 'Management' : 'General';

      user = await User.create({
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: password,
        role,
        department
      });

      user = await User.findById(user._id).select('+password');
    } else {
      const isAdminEmail = ADMIN_EMAILS.includes(normalizedEmail);
      if (isAdminEmail && user.role !== 'admin') {
        user = await User.findByIdAndUpdate(
          user._id,
          { role: 'admin', department: 'Management' },
          { new: true }
        ).select('+password');
      }
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });

  } catch (error) {
    console.error('Login/Create GET error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.healthCheck = (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
};
