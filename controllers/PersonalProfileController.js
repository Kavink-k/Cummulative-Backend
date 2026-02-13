


const { PersonalProfile, User, InstitutionDetail } = require("../modals");

// @desc   Create or Update Personal Profile record
// @route  POST /api/personal-profiles
exports.createPersonalProfile = async (req, res) => {
  try {
    const {
      studentId,
      institutionId,
      studentName,
      age,
      gender,
      dateOfBirth,
      nationality,
      religion,
      community,
      nativity,
      maritalStatus,
      parentGuardianName,
      motherTongue,
      communicationAddress,
      permanentAddress,
      contactMobile,
      studentEmail,
      aadharNo,
      ociNumber,
      emisNo,
      mediumOfInstruction,
    } = req.body;

    // --- 1. Check Required Field ---
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Get file uploaded by multer
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // --- 2. UPSERT LOGIC: Check if record exists ---
    const existingProfile = await PersonalProfile.findOne({ where: { studentId } });

    if (existingProfile) {
      // --- UPDATE Existing Record ---

      // Check edit permissions for mentors
      if (req.user && req.user.role === 'user' && existingProfile.approvalStatus === 'APPROVED') {
        if (existingProfile.editRequestStatus !== 'ALLOWED') {
          return res.status(403).json({
            message: "This record is approved and locked. Please request edit access from your Principal."
          });
        }
      }

      // Prepare update object with all potential fields
      const potentialUpdates = {
        institutionId: institutionId || existingProfile.institutionId,
        studentName,
        age,
        gender,
        dateOfBirth,
        nationality,
        religion,
        community,
        nativity,
        maritalStatus,
        parentGuardianName,
        motherTongue,
        communicationAddress,
        permanentAddress,
        contactMobile,
        studentEmail,
        aadharNo,
        ociNumber,
        emisNo,
        mediumOfInstruction,
        editedBy: req.user ? req.user.id : existingProfile.editedBy,
        editRequestStatus: 'NONE' // Reset request status after edit, but KEEP THE REASON for final approval review
      };

      // Filter out undefined or null values
      const finalUpdateData = {};
      Object.keys(potentialUpdates).forEach(key => {
        const value = potentialUpdates[key];
        if (value !== undefined && value !== null) {
          finalUpdateData[key] = value;
        }
      });

      // Always reset to PENDING on update (re-approval required)
      finalUpdateData.approvalStatus = 'PENDING';

      // Handle photo deletion/replacement
      const fs = require('fs');
      const path = require('path');

      if (!req.file && (req.body.photoUrl === '' || req.body.photoUrl === 'null' || req.body.photoUrl === null)) {
        if (existingProfile.photoUrl) {
          const oldPhotoPath = path.join(__dirname, '..', existingProfile.photoUrl);
          if (fs.existsSync(oldPhotoPath)) {
            try { fs.unlinkSync(oldPhotoPath); } catch (err) { }
          }
        }
        finalUpdateData.photoUrl = null;
      } else if (req.file && photoUrl) {
        if (existingProfile.photoUrl && existingProfile.photoUrl !== photoUrl) {
          const oldPhotoPath = path.join(__dirname, '..', existingProfile.photoUrl);
          if (fs.existsSync(oldPhotoPath)) {
            try { fs.unlinkSync(oldPhotoPath); } catch (err) { }
          }
        }
        finalUpdateData.photoUrl = photoUrl;
      }

      await existingProfile.update(finalUpdateData);

      return res.status(200).json({
        message: "Personal profile updated successfully.",
        data: existingProfile,
      });

    } else {
      // --- CREATE New Record ---

      // Validate strictly for creation
      if (
        !studentName || !age || !gender || !dateOfBirth || !nationality ||
        !religion || !community || !nativity || !maritalStatus ||
        !parentGuardianName || !motherTongue || !communicationAddress ||
        !permanentAddress || !contactMobile || !studentEmail || !aadharNo ||
        !emisNo || !mediumOfInstruction
      ) {
        return res.status(400).json({
          message: "All required fields must be filled out to create a new profile.",
        });
      }

      const newProfile = await PersonalProfile.create({
        studentId,
        institutionId: institutionId || (req.user ? req.user.institutionId : null),
        studentName,
        age,
        gender,
        dateOfBirth,
        nationality,
        religion,
        community,
        nativity,
        maritalStatus,
        parentGuardianName,
        motherTongue,
        communicationAddress,
        permanentAddress,
        contactMobile,
        studentEmail,
        aadharNo,
        ociNumber,
        emisNo,
        mediumOfInstruction,
        photoUrl,
        createdBy: req.user ? req.user.id : null,
        approvalStatus: 'PENDING'
      });

      return res.status(201).json({
        message: "Personal profile record saved successfully.",
        data: newProfile,
      });
    }
  } catch (error) {
    console.error("Error saving personal profile record:", error);
    res.status(500).json({
      message: "Server error while saving personal profile record.",
      error: error.message,
    });
  }
};

// @desc   Update Personal Profile record (Standard PUT route)
// @route  PUT /api/personal-profiles/:id
exports.updatePersonalProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProfile = await PersonalProfile.findByPk(id);

    if (!existingProfile) {
      return res.status(404).json({ message: "Personal profile record not found." });
    }

    // Check edit permissions for mentors
    if (req.user && req.user.role === 'user' && existingProfile.approvalStatus === 'APPROVED') {
      if (existingProfile.editRequestStatus !== 'ALLOWED') {
        return res.status(403).json({
          message: "This record is approved and locked. Please request edit access from your Principal."
        });
      }
    }

    const updateData = {
      ...req.body,
      approvalStatus: 'PENDING',
      editedBy: req.user ? req.user.id : existingProfile.editedBy,
      editRequestStatus: 'NONE', // Reset request status after edit, but KEEP THE REASON for final approval review
    };
    // Remove nulls/undefined
    Object.keys(updateData).forEach(key => (updateData[key] == null) && delete updateData[key]);

    if (req.file) {
      updateData.photoUrl = `/uploads/${req.file.filename}`;
    }

    await existingProfile.update(updateData);

    res.status(200).json({
      message: "Personal profile record updated successfully.",
      data: existingProfile,
    });
  } catch (error) {
    console.error("Error updating personal profile record:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Get all Personal Profiles (with filtering)
// @route  GET /api/personal-profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const { institutionId, approvalStatus } = req.query;
    const whereClause = {};

    if (institutionId) {
      whereClause.institutionId = institutionId;
    }

    if (approvalStatus) {
      whereClause.approvalStatus = approvalStatus;
    }

    const profiles = await PersonalProfile.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'creator', attributes: ['name', 'designation'] },
        { model: User, as: 'approver', attributes: ['name', 'designation'] },
        { model: User, as: 'editor', attributes: ['name', 'designation'] },
        { model: InstitutionDetail, as: 'institution', attributes: ['institutionName'] }
      ]
    });

    res.status(200).json({
      message: "Personal profiles retrieved successfully.",
      data: profiles,
    });
  } catch (error) {
    console.error("Error retrieving personal profiles:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Approve Student profile
// @route  PATCH /api/personal-profiles/approve/:studentId
exports.approveStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const profile = await PersonalProfile.findOne({ where: { studentId } });

    if (!profile) {
      return res.status(404).json({ message: "Personal profile not found." });
    }

    await profile.update({
      approvalStatus: "APPROVED",
      approvedBy: req.user ? req.user.id : null,
      editRequestStatus: 'NONE',
      editRequestReason: null // Finally clear it on approval
    });

    res.status(200).json({
      message: "Student profile approved successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Error approving student profile:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Reject Student profile
// @route  PATCH /api/personal-profiles/reject/:studentId
exports.rejectStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const profile = await PersonalProfile.findOne({ where: { studentId } });

    if (!profile) {
      return res.status(404).json({ message: "Personal profile not found." });
    }

    await profile.update({
      approvalStatus: "REJECTED",
      editRequestStatus: 'NONE',
      editRequestReason: null // Clear on rejection
    });

    res.status(200).json({
      message: "Student profile rejected successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Error rejecting student profile:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc   Request edit access (Mentors)
// @route  PATCH /api/personal-profiles/request-edit/:studentId
exports.requestEditAccess = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { reason } = req.body;
    const profile = await PersonalProfile.findOne({ where: { studentId } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    await profile.update({
      editRequestStatus: 'REQUESTED',
      editRequestReason: reason || "No reason provided"
    });
    res.json({ message: "Edit access requested successfully", data: profile });
  } catch (error) {
    res.status(500).json({ message: "Failed to request edit", error: error.message });
  }
};

// @desc   Allow edit access (Principals)
// @route  PATCH /api/personal-profiles/allow-edit/:studentId
exports.allowEditAccess = async (req, res) => {
  try {
    const { studentId } = req.params;
    const profile = await PersonalProfile.findOne({ where: { studentId } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    await profile.update({ editRequestStatus: 'ALLOWED' });
    res.json({ message: "Edit access granted successfully", data: profile });
  } catch (error) {
    res.status(500).json({ message: "Failed to allow edit", error: error.message });
  }
};


// @desc   Get Personal Profile by Primary Key ID
// @route  GET /api/personal-profiles/:id
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await PersonalProfile.findByPk(id);

    if (!profile) {
      return res.status(404).json({ message: "Personal profile not found." });
    }

    res.status(200).json({
      message: "Personal profile retrieved successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Error retrieving personal profile:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

exports.getProfileByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const profile = await PersonalProfile.findOne({
      where: { studentId },
      include: [
        { model: User, as: 'creator', attributes: ['name', 'designation'] },
        { model: User, as: 'approver', attributes: ['name', 'designation'] },
        { model: User, as: 'editor', attributes: ['name', 'designation'] },
        { model: InstitutionDetail, as: 'institution', attributes: ['institutionName'] }
      ]
    });

    if (!profile) {
      return res.status(404).json({ message: "Personal profile not found for this student ID." });
    }

    res.status(200).json({
      message: "Personal profile retrieved successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Error retrieving personal profile:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};