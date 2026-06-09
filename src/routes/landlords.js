const router   = require('express').Router();
const auth     = require('../middleware/auth');
const { Landlord, House } = require('../models');

router.get('/', auth, async (req, res) => {
  try {
    const items = await Landlord.findAll({
      order: [['createdAt','DESC']],
      include: [{ model: House, as: 'houses', attributes: ['id'] }]
    });
    res.json({ status:'success', data: items.map(l => ({
      id: l.id, full_name: l.full_name, phone: l.phone,
      email: l.email, address: l.address,
      house_count: l.houses.length,
      created_at: l.createdAt
    }))});
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { full_name, phone, email, address } = req.body;
    if (!full_name || !phone || !email)
      return res.status(400).json({ status:'error', message:'full_name, phone, email required' });
    const exists = await Landlord.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ status:'error', message:'Email already exists' });
    const l = await Landlord.create({ full_name, phone, email, address });
    res.status(201).json({ status:'success', message:'Landlord added', data: { id: l.id } });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const l = await Landlord.findByPk(req.params.id);
    if (!l) return res.status(404).json({ status:'error', message:'Not found' });
    await l.update(req.body);
    res.json({ status:'success', message:'Landlord updated' });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const l = await Landlord.findByPk(req.params.id);
    if (!l) return res.status(404).json({ status:'error', message:'Not found' });
    await l.destroy();
    res.json({ status:'success', message:'Landlord deleted' });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

module.exports = router;