const router = require('express').Router();
const auth   = require('../middleware/auth');
const { Assignment, Student, House } = require('../models');

router.get('/', auth, async (req, res) => {
  try {
    const items = await Assignment.findAll({
      order: [['createdAt','DESC']],
      include: [
        { model: Student, as:'student', attributes:['full_name','email','phone'] },
        { model: House,   as:'house',   attributes:['address','rent_per_room'] }
      ]
    });
    res.json({ status:'success', data: items });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { student_id, house_id, room_number, start_date, end_date } = req.body;
    if (!student_id || !house_id || !start_date)
      return res.status(400).json({ status:'error', message:'student_id, house_id, start_date required' });
    const a = await Assignment.create({ student_id, house_id, room_number, start_date, end_date });
    res.status(201).json({ status:'success', message:'Assignment created', data: { id: a.id } });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.put('/:id/end', auth, async (req, res) => {
  try {
    const a = await Assignment.findByPk(req.params.id);
    if (!a) return res.status(404).json({ status:'error', message:'Not found' });
    await a.update({ status:'ended', end_date: new Date() });
    res.json({ status:'success', message:'Assignment ended' });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const a = await Assignment.findByPk(req.params.id);
    if (!a) return res.status(404).json({ status:'error', message:'Not found' });
    await a.destroy();
    res.json({ status:'success', message:'Assignment deleted' });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

module.exports = router;