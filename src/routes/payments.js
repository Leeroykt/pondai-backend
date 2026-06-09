const router = require('express').Router();
const auth   = require('../middleware/auth');
const { Payment, Assignment, Student } = require('../models');

router.get('/', auth, async (req, res) => {
  try {
    const items = await Payment.findAll({
      order: [['payment_date','DESC']],
      include: [{ model: Assignment, as:'assignment',
        include: [{ model: Student, as:'student', attributes:['full_name'] }]
      }]
    });
    res.json({ status:'success', data: items });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { assignment_id, amount, payment_date, month_paid_for, method, notes } = req.body;
    if (!assignment_id || !amount || !payment_date || !month_paid_for)
      return res.status(400).json({ status:'error', message:'assignment_id, amount, payment_date, month_paid_for required' });
    const p = await Payment.create({ assignment_id, amount, payment_date, month_paid_for, method, notes });
    res.status(201).json({ status:'success', message:'Payment recorded', data: { id: p.id } });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const p = await Payment.findByPk(req.params.id);
    if (!p) return res.status(404).json({ status:'error', message:'Not found' });
    await p.destroy();
    res.json({ status:'success', message:'Payment deleted' });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

module.exports = router;