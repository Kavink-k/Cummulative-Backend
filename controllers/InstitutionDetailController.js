// controllers/InstitutionDetailController.js
const { InstitutionDetail } = require("../modals");

// @desc   Create or Update Institution Detail
// @route  POST /api/institution-details
exports.createInstitutionDetail = async (req, res) => {
    try {
        const {
            institutionName,
            address,
            batch,
        } = req.body;

        // --- Required field validation ---
        if (!institutionName) {
            return res.status(400).json({ message: "Required field: institutionName" });
        }

        if (!address || !batch) {
            return res.status(400).json({
                message: "Required fields: address, batch.",
            });
        }

        // --- UPSERT LOGIC: Check if record exists ---
        const existingRecord = await InstitutionDetail.findOne({
            where: { institutionName },
        });

        if (existingRecord) {
            // --- UPDATE Existing Record ---
            await existingRecord.update({
                address,
                batch,
            });

            return res.status(200).json({
                message: "Institution detail record updated successfully.",
                data: existingRecord,
            });
        } else {
            // --- CREATE New Record ---
            const newInstitution = await InstitutionDetail.create({
                institutionName,
                address,
                batch,
            });

            return res.status(201).json({
                message: "Institution detail record saved successfully.",
                data: newInstitution,
            });
        }
    } catch (error) {
        console.error("Error saving institution detail record:", error);
        res.status(500).json({
            message: "Server error while saving institution detail record.",
        });
    }
};

// @desc   Get all Institution Details
// @route  GET /api/institution-details
exports.getAllInstitutions = async (req, res) => {
    try {
        const institutions = await InstitutionDetail.findAll();
        res.status(200).json({
            message: "Institution details retrieved successfully.",
            data: institutions,
        });
    } catch (error) {
        console.error("Error retrieving institution details:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// @desc   Get Institution Detail by Primary Key ID
// @route  GET /api/institution-details/:id
exports.getInstitutionById = async (req, res) => {
    try {
        const { id } = req.params;
        const institution = await InstitutionDetail.findByPk(id);

        if (!institution) {
            return res.status(404).json({ message: "Institution detail not found." });
        }

        res.status(200).json({
            message: "Institution detail retrieved successfully.",
            data: institution,
        });
    } catch (error) {
        console.error("Error retrieving institution detail:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// @desc   Get Institution Detail by Institution Name
// @route  GET /api/institution-details/institution/:institutionName
exports.getInstitutionByName = async (req, res) => {
    try {
        const { institutionName } = req.params;
        const institution = await InstitutionDetail.findOne({ where: { institutionName } });

        if (!institution) {
            return res.status(404).json({ message: "Institution detail not found for this institution name." });
        }

        res.status(200).json({
            message: "Institution detail retrieved successfully.",
            data: institution,
        });
    } catch (error) {
        console.error("Error retrieving institution detail:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};


// @desc   Update Institution Detail by ID
// @route  PUT /api/institution-details/:id
exports.updateInstitutionDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const { institutionName, address, batch } = req.body;

        const institution = await InstitutionDetail.findByPk(id);

        if (!institution) {
            return res.status(404).json({ message: "Institution detail not found." });
        }

        // Check if institutionName is being changed and if it already exists
        if (institutionName && institutionName !== institution.institutionName) {
            const existing = await InstitutionDetail.findOne({ where: { institutionName } });
            if (existing) {
                return res.status(400).json({ message: "Institution name already exists." });
            }
        }

        await institution.update({
            institutionName: institutionName || institution.institutionName,
            address: address || institution.address,
            batch: batch || institution.batch,
        });

        res.status(200).json({
            message: "Institution detail updated successfully.",
            data: institution,
        });
    } catch (error) {
        console.error("Error updating institution detail:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// @desc   Delete Institution Detail by ID
// @route  DELETE /api/institution-details/:id
exports.deleteInstitutionDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const institution = await InstitutionDetail.findByPk(id);

        if (!institution) {
            return res.status(404).json({ message: "Institution detail not found." });
        }

        await institution.destroy();

        res.status(200).json({
            message: "Institution detail deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting institution detail:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
