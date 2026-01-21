const sequelize = require("../config/database");
const Sequelize = require("sequelize");

const db = {};

// db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.ActivityParticipation = require("./ActivityParticipation")(sequelize, Sequelize);
db.AdditionalCourses = require("./AdditionalCourse")(sequelize, Sequelize);
db.AdmissionDetail = require("./AdmissionDetail")(sequelize, Sequelize);
db.AttendanceRecord = require("./AttendanceRecord")(sequelize, Sequelize);
db.ClinicalExperience = require("./ClinicalExperience")(sequelize, Sequelize);
db.CourseCompletion = require("./CourseCompletion")(sequelize, Sequelize);
db.CourseInstruction = require("./CourseInstruction")(sequelize, Sequelize);
db.EducationalQualification = require("./EducationalQualification")(sequelize, Sequelize);
db.ObservationalVisit = require("./ObservationalVisit")(sequelize, Sequelize);
db.PersonalProfile = require("./PersonalProfile")(sequelize, Sequelize);
db.ResearchProject = require("./ResearchProject")(sequelize, Sequelize);
db.Verification = require("./Verification")(sequelize, Sequelize);
db.User = require("./User")(sequelize, Sequelize);

module.exports = db;
