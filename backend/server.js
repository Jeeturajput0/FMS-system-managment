import app from './app.js';
import connectDB from './config/db.js';
import bcrypt from 'bcryptjs';
import User from './model/user.model.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const database = await connectDB();

  if (database) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@aischolar.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Super Admin',
        email: adminEmail,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12),
        role: 'SUPER_ADMIN',
      });
      console.log(`Seeded admin account: ${adminEmail}`);
    }
  }

  app.listen(PORT, () => {
    console.log(`AI Scholars backend running on http://localhost:${PORT}`);
  });
};

startServer();
