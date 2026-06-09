const router = require('express').Router();
const auth   = require('../middleware/auth');
const { House, Landlord } = require('../models');

router.get('/', auth, async (req, res) => {
  try {
    const items = await House.findAll({
      order: [['createdAt','DESC']],
      include: [{ model: Landlord, as:'landlord', attributes:['full_name'] }]
    });
    res.json({ status:'success', data: items.map(h => ({
      id: h.id, address: h.address,
      landlord_id: h.landlord_id, landlord: h.landlord?.full_name,
      total_rooms: h.total_rooms, rent_per_room: h.rent_per_room,
      status: h.status, latitude: h.latitude, longitude: h.longitude,
      created_at: h.createdAt
    }))});
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { address, landlord_id, total_rooms, rent_per_room, latitude, longitude } = req.body;
    if (!address || !landlord_id)
      return res.status(400).json({ status:'error', message:'address and landlord_id required' });
    const h = await House.create({ address, landlord_id, total_rooms, rent_per_room, latitude, longitude });
    res.status(201).json({ status:'success', message:'House added', data: { id: h.id } });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const h = await House.findByPk(req.params.id);
    if (!h) return res.status(404).json({ status:'error', message:'Not found' });
    await h.update(req.body);
    res.json({ status:'success', message:'House updated' });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const h = await House.findByPk(req.params.id);
    if (!h) return res.status(404).json({ status:'error', message:'Not found' });
    await h.destroy();
    res.json({ status:'success', message:'House deleted' });
  } catch (err) { res.status(500).json({ status:'error', message: err.message }); }
});

module.exports = router;