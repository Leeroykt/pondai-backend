const router  = require('express').Router();
const auth    = require('../middleware/auth');
const { House, Landlord, Student, Assignment, Payment, sequelize } = require('../models');

router.get('/', auth, async (req, res) => {
  try {
    const [
      landlord_count, house_count, student_count,
      assignment_count, revenueResult,
      available_houses, full_houses, recent_houses, recent_payments
    ] = await Promise.all([
      Landlord.count(),
      House.count(),
      Student.count(),
      Assignment.count({ where: { status: 'active' } }),
      Payment.findOne({ attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']] }),
      House.count({ where: { status: 'available' } }),
      House.count({ where: { status: 'full' } }),
      House.findAll({ limit: 6, order:[['createdAt','DESC']], include:[{ model: Landlord, as:'landlord', attributes:['full_name'] }] }),
      Payment.findAll({ limit: 5, order:[['payment_date','DESC']],
        include:[{ model: Assignment, as:'assignment',
          include:[{ model: Student, as:'student', attributes:['full_name'] }]
        }]
      })
    ]);

    res.json({ status:'success', data: {
      landlord_count,
      house_count,
      student_count,
      assignment_count,
      total_revenue: parseFloat(revenueResult?.dataValues?.total || 0),
      available_houses,
      full_houses,
      recent_houses: recent_houses.map(h => ({
        id: h.id, address: h.address,
        landlord: h.landlord?.full_name,
        total_rooms: h.total_rooms,
        rent_per_room: h.rent_per_room,
        status: h.status
      })),
      recent_payments: recent_payments.map(p => ({
        id: p.id, amount: p.amount,
        method: p.method, payment_date: p.payment_date,
        student: p.assignment?.student?.full_name
      }))
    }});
  } catch (err) {
    res.status(500).json({ status:'error', message: err.message });
  }
});

module.exports = router;