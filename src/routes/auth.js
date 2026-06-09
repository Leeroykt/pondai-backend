const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const { User } = require('../models');
const auth   = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ status:'error', message:'Email and password required' });

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.checkPassword(password)))
      return res.status(401).json({ status:'error', message:'Invalid email or password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({ status:'success', data: {
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email }
    }});
  } catch (err) {
    res.status(500).json({ status:'error', message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json({ status:'success', data: {
    id: req.user.id, full_name: req.user.full_name, email: req.user.email
  }});
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { full_name, email } = req.body;
    await req.user.update({ full_name, email });
    res.json({ status:'success', message:'Profile updated' });
  } catch (err) {
    res.status(500).json({ status:'error', message: err.message });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;
    if (!(await req.user.checkPassword(current_password)))
      return res.status(401).json({ status:'error', message:'Current password incorrect' });
    if (new_password !== confirm_password)
      return res.status(400).json({ status:'error', message:'Passwords do not match' });
    await req.user.setPassword(new_password);
    await req.user.save();
    res.json({ status:'success', message:'Password changed' });
  } catch (err) {
    res.status(500).json({ status:'error', message: err.message });
  }
});

module.exports = router;