require('dotenv').config();
const app = require('./src/app');
const { sequelize, User } = require('./src/models');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    console.log('Checking database connection availability...');
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL variable is missing or empty inside environment configurations.");
    }

    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');

    // FIX: Look specifically for the target agent account instead of ANY generic row
    let agent = await User.findOne({ where: { email: 'agent@pondaihousing.com' } });
    
    if (!agent) {
      agent = User.build({ full_name: 'Agent', email: 'agent@pondaihousing.com' });
      await agent.setPassword('admin1234');
      await agent.save();
      console.log('✅ Default account created freshly');
    } else {
      // Force reset password to ensure it matches admin1234 exactly on every deploy
      await agent.setPassword('admin1234');
      await agent.save();
      console.log('🔄 Default account password verified/reset to admin1234');
    }

    console.log('   Email:    agent@pondaihousing.com');
    console.log('   Password: admin1234');

    app.listen(PORT, () => {
      console.log(`🚀 Pondai Housing API running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

start();