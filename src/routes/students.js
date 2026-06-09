const router = require('express').Router();
const auth   = require('../middleware/auth');
const { Student, Assignment, House } = require('../models');

router.get('/', auth, async (req, res) => {
  try {
    const items = await Student.findAll({ order: [['createdAt','DESC']] });
    res.json({ status:'success', data: items });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const s = await Student.findByPk(req.params.id, {
      include: [{ model: Assignment, as:'assignments',
        include: [{ model: House, as:'house', attributes:['address','rent_per_room'] }]
      }]
    });
    if (!s) return res.status(404).json({ status:'error', message:'Not found' });
    res.json({ status:'success', data: s });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { full_name, phone, email, university, course, national_id } = req.body;
    if (!full_name || !phone || !email)
      return res.status(400).json({ status:'error', message:'full_name, phone, email required' });
    const exists = await Student.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ status:'error', message:'Email already exists' });
    const s = await Student.create({ full_name, phone, email, university, course, national_id });
    res.status(201).json({ status:'success', message:'Student added', data: { id: s.id } });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const s = await Student.findByPk(req.params.id);
    if (!s) return res.status(404).json({ status:'error', message:'Not found' });
    await s.update(req.body);
    res.json({ status:'success', message:'Student updated' });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const s = await Student.findByPk(req.params.id);
    if (!s) return res.status(404).json({ status:'error', message:'Not found' });
    await s.destroy();
    res.json({ status:'success', message:'Student deleted' });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

module.exports = router;