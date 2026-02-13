const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const auth = require("../middleware/auth");
const { bulkUploadExcel } = require("../controllers/BulkUploadController");

router.use(auth);

router.post("/", upload.single("excel"), bulkUploadExcel);

module.exports = router;