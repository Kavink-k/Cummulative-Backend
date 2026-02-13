// routes/InstitutionDetailRoutes.js
const express = require("express");
const router = express.Router();
const {
    createInstitutionDetail,
    getAllInstitutions,
    getInstitutionById,
    getInstitutionByName,
    updateInstitutionDetail,
    deleteInstitutionDetail,
} = require("../controllers/InstitutionDetailController");

// POST /api/institution-details - Create or Update
router.post("/", createInstitutionDetail);

// GET /api/institution-details - Get All
router.get("/", getAllInstitutions);

// GET /api/institution-details/institution/:institutionName - Get by Institution Name
// IMPORTANT: This must come BEFORE /:id to avoid route matching conflicts
router.get("/institution/:institutionName", getInstitutionByName);

// GET /api/institution-details/:id - Get by Primary Key ID
router.get("/:id", getInstitutionById);

// PUT /api/institution-details/:id - Update by ID
router.put("/:id", updateInstitutionDetail);

// DELETE /api/institution-details/:id - Delete by ID
router.delete("/:id", deleteInstitutionDetail);

module.exports = router;
