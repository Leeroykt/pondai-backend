require('dotenv').config();
const app = require('./src/app');
const { sequelize, User } = require('./src/models');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Log out details to Render console to help verify if the strings exist
    console.log('Checking database connection availability...');
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL variable is missing or empty inside environment configurations.");
    }

    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');

    // Create default agent account if none exists
    const exists = await User.findOne();
    if (!exists) {
      const u = User.build({ full_name: 'Agent', email: 'agent@pondaihousing.com' });
      await u.setPassword('admin1234');
      await u.save();
      console.log('✅ Default account created');
      console.log('   Email:    agent@pondaihousing.com');
      console.log('   Password: admin1234');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Pondai Housing API running on http://localhost:${PORT}`);
    });

  } catch (err) {
    // This will now print the EXACT system error tracking down the bug
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

start();