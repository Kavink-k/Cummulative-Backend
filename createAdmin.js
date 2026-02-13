// Script to create the first admin user
// Run this once after the database is synced

const bcrypt = require('bcrypt');
const { User } = require('./modals');
const db = require('./modals');

async function createAdminUser() {
    try {
        // Sync database first
        await db.sequelize.sync();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ where: { role: 'admin' } });

        if (existingAdmin) {
            console.log('✅ Admin user already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Create admin user
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('admin123', saltRounds);

        const admin = await User.create({
            name: 'System Administrator',
            designation: 'Administrator',
            institutionId: 1, // Assuming institution with ID 1 exists (create it first if needed)
            email: 'admin@test.com',
            phone: '1234567890',
            password: hashedPassword,
            role: 'admin',
            isActive: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@test.com');
        console.log('🔑 Password: admin123');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
