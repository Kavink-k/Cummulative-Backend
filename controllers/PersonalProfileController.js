


const { PersonalProfile } = require("../modals");

// @desc   Create or Update Personal Profile record
// @route  POST /api/personal-profiles
exports.createPersonalProfile = async (req, res) => {
  try {
    const {
      studentId,
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

      // Prepare update object with all potential fields
      const potentialUpdates = {
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
        mediumOfInstruction
      };

      // Filter out undefined or null values to prevent overwriting existing data with blanks
      const finalUpdateData = {};
      Object.keys(potentialUpdates).forEach(key => {
        const value = potentialUpdates[key];
        // Update if value is valid (not undefined/null). 
        // Note: We allow empty strings if you assume the user cleared the field. 
        // If you want to prevent clearing fields, add: && value !== ""
        if (value !== undefined && value !== null) {
          finalUpdateData[key] = value;
        }
      });

      // Handle photo deletion/replacement
      const fs = require('fs');
      const path = require('path');

      // If user is removing the photo (no new file and photoUrl field is empty string or explicitly null)
      if (!req.file && (req.body.photoUrl === '' || req.body.photoUrl === 'null' || req.body.photoUrl === null)) {
        // Delete old photo file if it exists
        if (existingProfile.photoUrl) {
          const oldPhotoPath = path.join(__dirname, '..', existingProfile.photoUrl);
          if (fs.existsSync(oldPhotoPath)) {
            try {
              fs.unlinkSync(oldPhotoPath);
              console.log('✅ Deleted old photo:', oldPhotoPath);
            } catch (err) {
              console.error('❌ Error deleting old photo:', err);
            }
          }
        }
        // Set photoUrl to null in database
        finalUpdateData.photoUrl = null;
      }
      // If user is uploading a new photo
      else if (req.file && photoUrl) {
        // Delete old photo file if it exists and is different from new one
        if (existingProfile.photoUrl && existingProfile.photoUrl !== photoUrl) {
          const oldPhotoPath = path.join(__dirname, '..', existingProfile.photoUrl);
          if (fs.existsSync(oldPhotoPath)) {
            try {
              fs.unlinkSync(oldPhotoPath);
              console.log('✅ Deleted old photo:', oldPhotoPath);
            } catch (err) {
              console.error('❌ Error deleting old photo:', err);
            }
          }
        }
        // Set new photo URL
        finalUpdateData.photoUrl = photoUrl;
      }

      await existingProfile.update(finalUpdateData);

      return res.status(200).json({
        message: "Personal profile updated successfully.",
        data: existingProfile,
      });

    } else {
      // --- CREATE New Record ---

      // Validate strictly for creation (ensure all required fields are present)
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

    const updateData = { ...req.body };
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

// @desc   Get all Personal Profiles
// @route  GET /api/personal-profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await PersonalProfile.findAll();
    res.status(200).json({
      message: "Personal profiles retrieved successfully.",
      data: profiles,
    });
  } catch (error) {
    console.error("Error retrieving personal profiles:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
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

// @desc   Get Personal Profile by Student ID
// @route  GET /api/personal-profiles/student/:studentId
exports.getProfileByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const profile = await PersonalProfile.findOne({ where: { studentId } });

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