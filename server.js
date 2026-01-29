const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./modals");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const activityParticipationRoutes = require("./routes/ActivityParticipationRoutes");
const additionalCoursesRoutes = require("./routes/AdditionalCoursesRoutes");
const admissionDetailRoutes = require("./routes/AdmissionDetailRoutes");
const attendanceRecordRoutes = require("./routes/AttendanceRecordRoutes");
const clinicalExperienceRoutes = require("./routes/ClinicalExperienceRoutes");
const courseCompletionRoutes = require("./routes/CourseCompletionRoutes");
const educationalQualificationRoutes = require("./routes/EducationalQualificationRoutes");
const observationalVisitRoutes = require("./routes/ObservationalVisitRoutes");
const personalProfileRoutes = require("./routes/PersonalProfileRoutes");
const researchProjectRoutes = require("./routes/ResearchProjectRoutes");
const verificationRoutes = require("./routes/VerificationRoutes");
const courseInstructionRoutes = require("./routes/CourseInstructionRoutes");
const bulkUploadRoutes = require("./routes/BulkUploadRoutes");
const userRoutes = require("./routes/UserRoutes");

app.use("/api/activity-participation", activityParticipationRoutes);
app.use("/api/additional-courses", additionalCoursesRoutes);
app.use("/api/admission-details", admissionDetailRoutes);
app.use("/api/attendance-records", attendanceRecordRoutes);
app.use("/api/clinical-experiences", clinicalExperienceRoutes);
app.use("/api/course-completions", courseCompletionRoutes);
app.use("/api/course-instructions", courseInstructionRoutes);
app.use("/api/educational-qualifications", educationalQualificationRoutes);
app.use("/api/observational-visits", observationalVisitRoutes);
app.use("/api/personal-profiles", personalProfileRoutes);
app.use("/api/research-projects", researchProjectRoutes);
app.use("/api/verifications", verificationRoutes);
app.use("/api/bulk-upload", bulkUploadRoutes);
app.use("/api/users", userRoutes);

db.sequelize.sync({ force: true }).then(() => {
  console.log("Database synced successfully");
  app.listen(5000, () => console.log("Server running on port 5000"));
});
