const { User, InstitutionDetail } = require("../modals");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");

// @desc   Register a new user
// @route  POST /api/users/register
exports.registerUser = async (req, res) => {
    try {
        const { name, designation, institutionId, email, phone, password } = req.body;

        // Validate required fields
        if (!name || !designation || !institutionId || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required (name, designation, institutionId, email, phone, password)"
            });
        }

        // Validate institution exists
        const institution = await InstitutionDetail.findByPk(institutionId);
        if (!institution) {
            return res.status(400).json({ message: "Invalid institution ID" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user (always as 'user' role for public registration)
        const newUser = await User.create({
            name,
            designation,
            institutionId,
            email,
            phone,
            password: hashedPassword,
            role: 'user', // Default role for registration
            isActive: true
        });

        // Fetch user with institution data
        const userWithInstitution = await User.findByPk(newUser.id, {
            include: [{ model: InstitutionDetail, as: 'institution' }]
        });

        // Remove password from response
        const userResponse = {
            id: userWithInstitution.id,
            name: userWithInstitution.name,
            designation: userWithInstitution.designation,
            institutionId: userWithInstitution.institutionId,
            institution: userWithInstitution.institution,
            email: userWithInstitution.email,
            phone: userWithInstitution.phone,
            role: userWithInstitution.role,
            isActive: userWithInstitution.isActive,
            createdAt: userWithInstitution.createdAt
        };

        return res.status(201).json({
            message: "User registered successfully",
            data: userResponse
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            message: "Server error while registering user",
            error: error.message
        });
    }
};

// @desc   Login user
// @route  POST /api/users/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user by email with institution data
        const user = await User.findOne({
            where: { email },
            include: [{ model: InstitutionDetail, as: 'institution' }]
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                message: "User account is deactivated"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Update last login
        await user.update({ lastLogin: new Date() });

        // Remove password from response
        const userResponse = {
            id: user.id,
            name: user.name,
            designation: user.designation,
            institutionId: user.institutionId,
            institution: user.institution,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin
        };

        return res.status(200).json({
            message: "Login successful",
            data: userResponse
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            message: "Server error while logging in",
            error: error.message
        });
    }
};

// @desc   Get all users
// @route  GET /api/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Exclude password from response
        });

        res.status(200).json({
            message: "Users retrieved successfully",
            data: users
        });

    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({
            message: "Server error while retrieving users",
            error: error.message
        });
    }
};

// @desc   Get user by ID
// @route  GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User retrieved successfully",
            data: user
        });

    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({
            message: "Server error while retrieving user",
            error: error.message
        });
    }
};

// @desc   Update user
// @route  PUT /api/users/:id
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, designation, institutionId, email, phone, password } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Prepare update data
        const updateData = {};
        if (name) updateData.name = name;
        if (designation) updateData.designation = designation;

        // Validate institution if provided
        if (institutionId) {
            const institution = await InstitutionDetail.findByPk(institutionId);
            if (!institution) {
                return res.status(400).json({ message: "Invalid institution ID" });
            }
            updateData.institutionId = institutionId;
        }

        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;

        // Hash new password if provided
        if (password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        await user.update(updateData);

        // Fetch updated user with institution data
        const updatedUser = await User.findByPk(id, {
            include: [{ model: InstitutionDetail, as: 'institution' }]
        });

        // Remove password from response
        const userResponse = {
            id: updatedUser.id,
            name: updatedUser.name,
            designation: updatedUser.designation,
            institutionId: updatedUser.institutionId,
            institution: updatedUser.institution,
            email: updatedUser.email,
            phone: updatedUser.phone,
            isActive: updatedUser.isActive,
            role: updatedUser.role
        };

        res.status(200).json({
            message: "User updated successfully",
            data: userResponse
        });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            message: "Server error while updating user",
            error: error.message
        });
    }
};

// @desc   Delete user (soft delete by deactivating)
// @route  DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Soft delete - deactivate user
        await user.update({ isActive: false });

        res.status(200).json({
            message: "User deactivated successfully"
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            message: "Server error while deleting user",
            error: error.message
        });
    }
};

// @desc   Change password
// @route  POST /api/users/:id/change-password
exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await user.update({ password: hashedPassword });

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({
            message: "Server error while changing password",
            error: error.message
        });
    }
};

// ============================================
// ADMIN-ONLY FUNCTIONS
// ============================================

// @desc   Get all users with pagination and search (Admin only)
// @route  GET /api/users/admin/all
exports.getAllUsersForAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        // Build search condition
        const whereClause = search
            ? {
                [require('sequelize').Op.or]: [
                    { name: { [require('sequelize').Op.like]: `%${search}%` } },
                    { email: { [require('sequelize').Op.like]: `%${search}%` } },
                    { designation: { [require('sequelize').Op.like]: `%${search}%` } },
                    // { institutionName: { [require('sequelize').Op.like]: `%${search}%` } }
                ]
            }
            : {};

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            message: "Users retrieved successfully",
            data: {
                users: rows,
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error("Error retrieving users for admin:", error);
        res.status(500).json({
            message: "Server error while retrieving users",
            error: error.message
        });
    }
};

// @desc   Create user by admin
// @route  POST /api/users/admin/create
exports.createUserByAdmin = async (req, res) => {
    try {
        const { name, designation, institutionId, email, phone, password, role = 'user' } = req.body;

        // Validate required fields
        if (!name || !designation || !institutionId || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Validate institution exists
        const institution = await InstitutionDetail.findByPk(institutionId);
        if (!institution) {
            return res.status(400).json({ message: "Invalid institution ID" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user (admin can set role)
        const newUser = await User.create({
            name,
            designation,
            institutionId,
            email,
            phone,
            password: hashedPassword,
            role,
            isActive: true
        });

        // Fetch user with institution data
        const userWithInstitution = await User.findByPk(newUser.id, {
            include: [{ model: InstitutionDetail, as: 'institution' }]
        });

        // Remove password from response
        const userResponse = {
            id: userWithInstitution.id,
            name: userWithInstitution.name,
            designation: userWithInstitution.designation,
            institutionId: userWithInstitution.institutionId,
            institution: userWithInstitution.institution,
            email: userWithInstitution.email,
            phone: userWithInstitution.phone,
            role: userWithInstitution.role,
            isActive: userWithInstitution.isActive,
            createdAt: userWithInstitution.createdAt
        };

        return res.status(201).json({
            message: "User created successfully",
            data: userResponse
        });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Server error while creating user",
            error: error.message
        });
    }
};

// @desc   Update user by admin
// @route  PUT /api/users/admin/:id
exports.updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, designation, institutionId, email, phone, password, role, isActive } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Prepare update data
        const updateData = {};
        if (name) updateData.name = name;
        if (designation) updateData.designation = designation;

        // Validate institution if provided
        if (institutionId) {
            const institution = await InstitutionDetail.findByPk(institutionId);
            if (!institution) {
                return res.status(400).json({ message: "Invalid institution ID" });
            }
            updateData.institutionId = institutionId;
        }

        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (role) updateData.role = role; // Admin can change role
        if (typeof isActive !== 'undefined') updateData.isActive = isActive; // Admin can activate/deactivate

        // Hash new password if provided
        if (password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        await user.update(updateData);

        // Remove password from response
        const userResponse = {
            id: user.id,
            name: user.name,
            designation: user.designation,
            institutionId: user.institutionId,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            updatedAt: user.updatedAt
        };

        res.status(200).json({
            message: "User updated successfully",
            data: userResponse
        });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            message: "Server error while updating user",
            error: error.message
        });
    }
};

// @desc   Bulk upload users from CSV/Excel
// @route  POST /api/users/admin/bulk-upload
exports.bulkUploadUsers = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        // Read the uploaded file
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
            return res.status(400).json({
                message: "File is empty or invalid format"
            });
        }

        const results = {
            success: [],
            errors: []
        };

        // Process each row
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNumber = i + 2; // Excel row number (accounting for header)

            try {
                // Validate required fields
                if (!row.name || !row.designation || !row.institutionName || !row.email || !row.phone || !row.password) {
                    results.errors.push({
                        row: rowNumber,
                        email: row.email || 'N/A',
                        error: "Missing required fields"
                    });
                    continue;
                }

                // Check if user already exists
                const existingUser = await User.findOne({ where: { email: row.email } });
                if (existingUser) {
                    results.errors.push({
                        row: rowNumber,
                        email: row.email,
                        error: "User with this email already exists"
                    });
                    continue;
                }

                // Hash password
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(row.password, saltRounds);

                // Create user
                const newUser = await User.create({
                    name: row.name,
                    designation: row.designation,
                    institutionName: row.institutionName,
                    email: row.email,
                    phone: row.phone,
                    password: hashedPassword,
                    role: row.role || 'user',
                    isActive: true
                });

                results.success.push({
                    row: rowNumber,
                    email: newUser.email,
                    name: newUser.name
                });

            } catch (error) {
                results.errors.push({
                    row: rowNumber,
                    email: row.email || 'N/A',
                    error: error.message
                });
            }
        }

        // Delete uploaded file
        const fs = require('fs');
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            message: "Bulk upload completed",
            data: {
                totalRows: data.length,
                successCount: results.success.length,
                errorCount: results.errors.length,
                success: results.success,
                errors: results.errors
            }
        });

    } catch (error) {
        console.error("Error in bulk upload:", error);
        res.status(500).json({
            message: "Server error during bulk upload",
            error: error.message
        });
    }
};

// @desc   Get user statistics for admin dashboard
// @route  GET /api/users/admin/stats
exports.getUserStats = async (req, res) => {
    try {
        const { Op } = require('sequelize');

        // Get total users count
        const totalUsers = await User.count();

        // Get active users count
        const activeUsers = await User.count({
            where: { isActive: true }
        });

        // Get inactive users count
        const inactiveUsers = await User.count({
            where: { isActive: false }
        });

        // Get recent registrations (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentRegistrations = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: sevenDaysAgo
                }
            }
        });

        // Get users by role
        const adminCount = await User.count({
            where: { role: 'admin' }
        });

        const userCount = await User.count({
            where: { role: 'user' }
        });

        // Get recent users (last 5)
        const recentUsers = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        res.status(200).json({
            message: "Statistics retrieved successfully",
            data: {
                totalUsers,
                activeUsers,
                inactiveUsers,
                recentRegistrations,
                usersByRole: {
                    admin: adminCount,
                    user: userCount,
                    principal: await User.count({ where: { role: 'principal' } })
                },
                recentUsers
            }
        });

    } catch (error) {
        console.error("Error retrieving user statistics:", error);
        res.status(500).json({
            message: "Server error while retrieving statistics",
            error: error.message
        });
    }
};

// @desc   Download user upload template
// @route  GET /api/users/admin/template
exports.downloadTemplate = async (req, res) => {
    try {
        const { format = 'csv' } = req.query;

        // Sample data for template
        const templateData = [
            {
                name: 'Dr. John Smith',
                designation: 'Professor',
                institutionName: 'ABC Medical College',
                email: 'john.smith@example.com',
                phone: '9876543210',
                password: 'password123',
                role: 'user'
            },
            {
                name: 'Dr. Jane Doe',
                designation: 'Associate Professor',
                institutionName: 'XYZ College',
                email: 'jane.doe@example.com',
                phone: '9876543211',
                password: 'password456',
                role: 'user'
            }
        ];

        // Create workbook
        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: format === 'xlsx' ? 'xlsx' : 'csv' });

        // Set headers
        res.setHeader('Content-Disposition', `attachment; filename=user_upload_template.${format}`);
        res.setHeader('Content-Type', format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv');

        res.send(buffer);

    } catch (error) {
        console.error("Error generating template:", error);
        res.status(500).json({
            message: "Server error while generating template",
            error: error.message
        });
    }
};
