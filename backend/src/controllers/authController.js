require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Admin emails from .env (NOT removed)
const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
  : [];

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ POST /api/auth/login
exports.loginOrCreate = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    const isAdminEmail = ADMIN_EMAILS.includes(normalizedEmail);

    // 🆕 Create user if not exists
    if (!user) {
      user = await User.create({
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password,
        role: isAdminEmail ? 'admin' : 'employee',
        department: isAdminEmail ? 'Management' : 'General'
      });

      user = await User.findById(user._id).select('+password');
    }

    // 🔄 Promote existing user if admin email
    if (isAdminEmail && user.role !== 'admin') {
      user.role = 'admin';
      user.department = 'Management';
      await user.save();
    }

    // 🔐 Password check
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
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
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ✅ Health check
exports.healthCheck = (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
};
