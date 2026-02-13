// const XLSX = require("xlsx");
// const fs = require("fs");
// const https = require("https");

// const {
//   PersonalProfile,
//   AdmissionDetail,
//   EducationalQualification,
//   ClinicalExperience,
//   AdditionalCourse,
//   CourseInstruction,
//   AttendanceRecord,
//   ResearchProject,
//   CourseCompletion,
//   Verification,
//   ActivityParticipation,
//   ObservationalVisit,
// } = require("../modals");

// // Helper: Clean value (convert empty string → null)
// const clean = (val) => (val === undefined || val === "" || val === null ? null : val.trim());

// const bulkUploadExcel = async (req, res) => {
//   try {
//     let rows = [];

//     // === 1. Handle File Upload (xlsx/csv) ===
//     if (req.file) {
//       const workbook = XLSX.readFile(req.file.path);
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       rows = XLSX.utils.sheet_to_json(sheet);
//       fs.unlinkSync(req.file.path);
//     }
//     // === 2. Handle Google Sheet URL ===
//     else if (req.body.googleSheetUrl) {
//       const url = req.body.googleSheetUrl.trim();
//       const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
//       if (!match) return res.status(400).json({ error: "Invalid Google Sheet URL" });

//       const sheetId = match[1];
//       const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

//       const csvData = await new Promise((resolve, reject) => {
//         https.get(csvUrl, (res) => {
//           let data = "";
//           res.on("data", chunk => data += chunk);
//           res.on("end", () => resolve(data));
//         }).on("error", reject);
//       });

//       const workbook = XLSX.read(csvData, { type: "string" });
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       rows = XLSX.utils.sheet_to_json(sheet);
//     } else {
//       return res.status(400).json({ error: "Upload file or provide googleSheetUrl" });
//     }

//     if (rows.length === 0) return res.status(400).json({ error: "Empty file" });

//     const groupedData = {};
//     rows.forEach(row => {
//       const id = clean(row.studentId);
//       if (id) {
//         if (!groupedData[id]) groupedData[id] = [];
//         groupedData[id].push(row);
//       }
//     });

//     let processed = 0;

//     for (const [studentId, studentRows] of Object.entries(groupedData)) {
//       const r = studentRows[0]; // First row has personal/admission data

//       // === 1. PersonalProfile – Now SAFE for empty fields ===
//       await PersonalProfile.upsert({
//         studentId,
//         studentName: clean(r.studentName) || "Unknown Student",
//         age: r.age ? parseInt(r.age) || null : null,
//         gender: clean(r.gender) || "Null",
//         dateOfBirth: clean(r.dateOfBirth) || null,
//         nationality: clean(r.nationality) || "Indian",
//         religion: clean(r.religion) || null,
//         community: clean(r.community) || null,
//         nativity: clean(r.nativity) || null,
//         maritalStatus: clean(r.maritalStatus) || "Single", // default
//         parentGuardianName: clean(r.parentGuardianName) || "Guardian",
//         motherTongue: clean(r.motherTongue) || "Null",
//         communicationAddress: clean(r.communicationAddress) || "Address Not Provided",
//         permanentAddress: clean(r.permanentAddress) || clean(r.communicationAddress) || "Same as Communication",
//         contactMobile: clean(r.contactMobile) || "0000000000", // temporary
//         studentEmail: clean(r.studentEmail) || `${studentId}@college.edu`,
//         aadharNo: clean(r.aadharNo) || "000000000000",
//         ociNumber: clean(r.ociNumber) || null,
//         emisNo: clean(r.emisNo) || studentId,
//         mediumOfInstruction: clean(r.mediumOfInstruction_personal) || clean(r.mediumOfInstruction_hsc) || "English",
//         photoUrl: clean(r.photoUrl) || null,
//       }).catch(err => console.warn("PersonalProfile warning:", err.message));

//       // === 2. Admission Details ===
//       await AdmissionDetail.upsert({
//         studentId,
//         dateOfAdmission: clean(r.dateOfAdmission) || new Date().toISOString().split("T")[0],
//         admissionNumber: clean(r.admissionNumber) || studentId,
//         rollNumber: clean(r.rollNumber) || studentId,
//         universityRegistration: clean(r.universityRegistration) || null,
//         migrationCertificateNo: clean(r.migrationCertificateNo) || null,
//         migrationCertificateDate: clean(r.migrationCertificateDate) || null,
//         eligibilityCertificateNo: clean(r.eligibilityCertificateNo) || null,
//         eligibilityCertificateDate: clean(r.eligibilityCertificateDate) || null,
//         allotmentCategory: clean(r.allotmentCategory) || "Management",
//         govtAllotmentNo: clean(r.govtAllotmentNo) || null,
//         privateAllotmentNo: clean(r.privateAllotmentNo) || null,
//         communityCertificateNo: clean(r.communityCertificateNo) || null,
//         communityCertificateDate: clean(r.communityCertificateDate) || null,
//         nativityCertificateNo: clean(r.nativityCertificateNo) || null,
//         nativityCertificateDate: clean(r.nativityCertificateDate) || null,
//         dateOfDiscontinuation: clean(r.dateOfDiscontinuation) || null,
//         reasonForDiscontinuation: clean(r.reasonForDiscontinuation) || null,
//         scholarshipSource: clean(r.scholarshipSource) || null,
//         scholarshipAmount: r.scholarshipAmount ? parseInt(r.scholarshipAmount) || null : null,
//         bankLoanSource: clean(r.bankLoanSource) || null,
//         bankLoanAmount: r.bankLoanAmount ? parseInt(r.bankLoanAmount) || null : null,
//       }).catch(() => {});

//       // === 3. Educational Qualification ===
//       await EducationalQualification.upsert({
//         studentId,
//         streamGroup: clean(r.streamGroup) || "Biology",
//         certificateNo: clean(r.certificateNo) || "TEMP123",
//         certificateDate: clean(r.certificateDate) || null,
//         yearOfPassing: clean(r.yearOfPassing) || "2022",
//         boardOfExamination: clean(r.boardOfExamination) || "State Board",
//         mediumOfInstruction: clean(r.mediumOfInstruction_hsc) || "English",
//         hscVerificationNo: clean(r.hscVerificationNo) || null,
//         hscVerificationDate: clean(r.hscVerificationDate) || null,
//       }).catch(() => {});

//       // === REPEATING SECTIONS – All safe now ===
//       for (const row of studentRows) {
//         if (row.semester && row.clinicalArea) {
//           await ClinicalExperience.upsert({
//             studentId,
//             semester: clean(row.semester),
//             clinicalArea: clean(row.clinicalArea),
//             credits: clean(row.credits),
//             prescribedWeeks: clean(row.prescribedWeeks),
//             prescribedHours: clean(row.prescribedHours),
//             completedHours: row.completedHours ? parseInt(row.completedHours) || 0 : 0,
//             hospital: clean(row.hospital) || "Not Assigned",
//           }).catch(err => console.error(`ClinicalExperience Error (ID: ${studentId}):`, err.message));
//         }
//         // Additional Courses
//         if (row.additionalCourseId || row.additionalCourseName) {
//           await AdditionalCourse.upsert({
//             studentId,
//             courseId: row.additionalCourseId || row.courseId || null,
//             courseName: row.additionalCourseName || row.courseName || null,
//             from: row.additionalCourseFrom || row.from || null,
//             to: row.additionalCourseTo || row.to || null,
//           });
//         }

//         // Course Instruction
//         if (row.courseSemester && row.courseCode) {
//           await CourseInstruction.upsert({
//             studentId,
//             semester: row.courseSemester,
//             sNo: row.sNo || null,
//             courseCode: row.courseCode,
//             universityCourseCode: row.universityCourseCode || null,
//             courseTitle: row.courseTitle || null,
//             theoryCredits: row.theoryCredits || null,
//             skillLabCredits: row.skillLabCredits || null,
//             clinicalCredits: row.clinicalCredits || null,
//             theoryPrescribed: row.theoryPrescribed || null,
//             theoryAttended: row.theoryAttended || null,
//             theoryPercentage: row.theoryPercentage || null,
//             skillLabPrescribed: row.skillLabPrescribed || null,
//             skillLabAttended: row.skillLabAttended || null,
//             skillLabPercentage: row.skillLabPercentage || null,
//             clinicalPrescribed: row.clinicalPrescribed || null,
//             clinicalAttended: row.clinicalAttended || null,
//             clinicalPercentage: row.clinicalPercentage || null,
//             theoryInternalMax: row.theoryInternalMax || null,
//             theoryInternalObtained: row.theoryInternalObtained || null,
//             theoryEndSemMax: row.theoryEndSemMax || null,
//             theoryEndSemObtained: row.theoryEndSemObtained || null,
//             theoryTotalMax: row.theoryTotalMax || null,
//             theoryTotalObtained: row.theoryTotalObtained || null,
//             practicalInternalMax: row.practicalInternalMax || null,
//             practicalInternalObtained: row.practicalInternalObtained || null,
//             practicalEndSemMax: row.practicalEndSemMax || null,
//             practicalEndSemObtained: row.practicalEndSemObtained || null,
//             practicalTotalMax: row.practicalTotalMax || null,
//             practicalTotalObtained: row.practicalTotalObtained || null,
//             gradePoint: row.gradePoint || null,
//             letterGrade: row.letterGrade || null,
//             sgpa: row.sgpa || null,
//             rank: row.rank || null,
//           });
//         }

//         // Attendance
//         if (row.attendanceSemester) {
//           await AttendanceRecord.upsert({
//             studentId,
//             semester: row.attendanceSemester,
//             workingDays: parseInt(row.workingDays) || null,
//             annualLeave: parseInt(row.annualLeave) || null,
//             sickLeave: parseInt(row.sickLeave) || null,
//             gazettedHolidays: parseInt(row.gazettedHolidays) || null,
//             otherLeave: parseInt(row.otherLeave) || null,
//             compensationDaysHours: row.compensationDaysHours || null,
//           });
//         }

//         // Research Projects
//         if (row.projectSemester && row.projectTitle) {
//           await ResearchProject.upsert({
//             studentId,
//             semester: row.projectSemester,
//             areaOfStudy: row.areaOfStudy || null,
//             type: row.projectType || null,
//             projectTitle: row.projectTitle,
//           });
//         }

//         // Course Completion
//         if (row.certificateCourseName) {
//           await CourseCompletion.upsert({
//             studentId,
//             courseName: row.certificateCourseName,
//             certificateNumber: row.certificateNumber || null,
//             dateOfIssue: row.certificateDateOfIssue || null,
//           });
//         }

//         // Verification
//         if (row.verificationSemester) {
//           await Verification.upsert({
//             studentId,
//             semester: row.verificationSemester,
//             classTeacherName: row.classTeacherName || null,
//             teacherSignature: row.teacherSignature || null,
//             principalSignature: row.principalSignature || null,
//           });
//         }

//         // Activities
//         if (row.activitySemester) {
//           await ActivityParticipation.upsert({
//             studentId,
//             semester: row.activitySemester,
//             sports: row.sports || null,
//             coCurricular: row.coCurricular || null,
//             extraCurricular: row.extraCurricular || null,
//             sna: row.sna || null,
//             nssYrcRrc: row.nssYrcRrc || null,
//             cne: row.cne || null,
//             awardsRewards: row.awardsRewards || null,
//           });
//         }

//         // Observational Visits
//         if (row.visitSemester && row.institutionPlace) {
//           await ObservationalVisit.upsert({
//             studentId,
//             semester: row.visitSemester,
//             institutionPlace: row.institutionPlace,
//             date: row.visitDate || null,
//           });
//         }
//       }
// processed++;
//     }

//     res.json({
//       success: true,
//       message: `Bulk upload successful! ${processed} students processed (empty fields auto-filled)`,
//       processed,
//     });

//   } catch (error) {
//     console.error("Bulk Upload Error:", error);
//     res.status(500).json({
//       success: false,
//       error: "Upload failed: " + error.message,
//     });
//   }
// };

// module.exports = { bulkUploadExcel };
const XLSX = require("xlsx");
const fs = require("fs");

const {
  PersonalProfile,
  AdmissionDetail,
  EducationalQualification,
  ClinicalExperience,
  AdditionalCourses,
  CourseInstruction,
  AttendanceRecord,
  ResearchProject,
  CourseCompletion,
  Verification,
  ActivityParticipation,
  ObservationalVisit,
} = require("../modals");

// Helper: Clean value (convert empty → "Null" or null safely)
const clean = (val) => {
  if (val === undefined || val === null || val === "") return null;
  const trimmed = val.toString().trim();
  return trimmed === "" ? null : trimmed;
};

// Helper: Parse Excel Date (Serial Number) or String to YYYY-MM-DD
const parseDate = (val) => {
  if (!val) return null;

  // 1. If it's already a string like "2023-12-05" or "2023-12-05T..."
  if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) {
    return val.split('T')[0];
  }

  // 2. If it's an Excel serial number (e.g., 45266)
  const serial = parseFloat(val);
  if (!isNaN(serial) && serial > 10000) { // arbitrary threshold to avoid confusing small nums
    // Excel base date: Dec 30, 1899. JS base: Jan 1, 1970. diff ~ 25569 days
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    // Return YYYY-MM-DD
    return date_info.toISOString().split('T')[0];
  }

  // 3. Fallback: try parsing normal string date
  const parsed = new Date(val);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return null;
};

const bulkUploadExcel = async (req, res) => {
  try {
    let rows = [];

    // === Handle File Upload ===
    if (req.file) {
      // FIX: Read file buffer instead of path to handle missing extension
      const fileBuffer = fs.readFileSync(req.file.path);
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet);

      // Clean up the uploaded file
      fs.unlinkSync(req.file.path);
    } else {
      return res.status(400).json({ error: "Please upload an Excel or CSV file" });
    }

    if (rows.length === 0) return res.status(400).json({ error: "Empty file" });

    const groupedData = {};
    rows.forEach(row => {
      // Use studentId or generate a TEMP ID if missing
      const id = clean(row.studentId) || `TEMP_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      if (!groupedData[id]) groupedData[id] = [];
      groupedData[id].push(row);
    });

    // DEBUG: Log the headers/keys from the first row to verify Excel column names
    if (rows.length > 0) {
      console.log("DEBUG: First row keys:", Object.keys(rows[0]));
      console.log("DEBUG: First row sample data:", rows[0]);
    }

    let processed = 0;

    for (const [studentId, studentRows] of Object.entries(groupedData)) {
      const r = studentRows[0]; // First row has main personal data

      // === 1. PersonalProfile ===
      await PersonalProfile.upsert({
        studentId,
        studentName: clean(r.studentName) || "Null",
        age: r.age ? parseInt(r.age) || null : null,
        gender: clean(r.gender) || "Null",
        dateOfBirth: parseDate(r.dateOfBirth) || "1900-01-01",
        nationality: clean(r.nationality) || "Null",
        religion: clean(r.religion) || "Null",
        community: clean(r.community) || "Null",
        nativity: clean(r.nativity) || "Null",
        maritalStatus: clean(r.maritalStatus) || "Null",
        parentGuardianName: clean(r.parentGuardianName) || "Null",
        motherTongue: clean(r.motherTongue) || "Null",
        communicationAddress: clean(r.communicationAddress) || "Null",
        permanentAddress: clean(r.permanentAddress) || clean(r.communicationAddress) || "Null",
        contactMobile: clean(r.contactMobile) || "Null",
        studentEmail: clean(r.studentEmail) || "Null",
        aadharNo: clean(r.aadharNo) || "Null",
        ociNumber: clean(r.ociNumber) || "Null",
        emisNo: clean(r.emisNo) || "Null",
        mediumOfInstruction: clean(r.mediumOfInstruction_personal) || clean(r.mediumOfInstruction_hsc) || "Null",
        photoUrl: clean(r.photoUrl) || null,
        approvalStatus: 'PENDING',
        createdBy: req.user ? req.user.id : null,
        institutionId: req.user ? req.user.institutionId : null,
      }).catch(err => console.warn("PersonalProfile warning:", err.message));

      // === 2. Admission Details ===
      await AdmissionDetail.upsert({
        studentId,
        dateOfAdmission: parseDate(r.dateOfAdmission),
        admissionNumber: clean(r.admissionNumber) || "Null",
        rollNumber: clean(r.rollNumber) || "Null",
        universityRegistration: clean(r.universityRegistration) || "Null",
        migrationCertificateNo: clean(r.migrationCertificateNo) || "Null",
        migrationCertificateDate: parseDate(r.migrationCertificateDate),
        eligibilityCertificateNo: clean(r.eligibilityCertificateNo) || "Null",
        eligibilityCertificateDate: parseDate(r.eligibilityCertificateDate),
        allotmentCategory: clean(r.allotmentCategory) || "Null",
        allotmentNo: clean(r.allotmentNo) || clean(r.govtAllotmentNo) || clean(r.privateAllotmentNo) || "Null",
        allotmentDate: parseDate(r.allotmentDate) || parseDate(r.govtAllotmentDate) || parseDate(r.privateAllotmentDate),
        communityCertificateNo: clean(r.communityCertificateNo) || "Null",
        communityCertificateDate: parseDate(r.communityCertificateDate),
        nativityCertificateNo: clean(r.nativityCertificateNo) || "Null",
        nativityCertificateDate: parseDate(r.nativityCertificateDate),
        dateOfDiscontinuation: parseDate(r.dateOfDiscontinuation),
        reasonForDiscontinuation: clean(r.reasonForDiscontinuation) || "Null",
        scholarshipSource: clean(r.scholarshipSource) || "Null",
        scholarshipAmount: r.scholarshipAmount ? parseInt(r.scholarshipAmount) || null : null,
        bankLoanSource: clean(r.bankLoanSource) || "Null",
        bankLoanAmount: r.bankLoanAmount ? parseInt(r.bankLoanAmount) || null : null,
      }).catch(err => console.error(`AdmissionDetail Error (ID: ${studentId}):`, err.message));

      // === 3. Educational Qualification ===
      await EducationalQualification.upsert({
        studentId,
        streamGroup: clean(r.streamGroup) || "Null",
        certificateNo: clean(r.certificateNo) || "Null",
        certificateDate: parseDate(r.certificateDate) || new Date().toISOString().split("T")[0],
        yearOfPassing: clean(r.yearOfPassing) || "Null",
        boardOfExamination: clean(r.boardOfExamination) || "Null",
        mediumOfInstruction: clean(r.mediumOfInstruction_hsc) || "Null",
        hscVerificationNo: clean(r.hscVerificationNo) || "Null",
        hscVerificationDate: parseDate(r.hscVerificationDate) || new Date().toISOString().split("T")[0],
      }).catch(err => console.error(`EducationalQualification Error (ID: ${studentId}):`, err.message));

      // Collections for JSON based or batch verification
      const verificationList = [];

      // === REPEATING SECTIONS ===
      for (const row of studentRows) {
        if (row.semester && row.clinicalArea) {
          console.log(`DEBUG: Processing ClinicalExperience for ${studentId}, Semester: ${row.semester}`);

          await ClinicalExperience.upsert({
            studentId,
            semester: clean(row.semester) || "Null",
            clinicalArea: clean(row.clinicalArea) || "Null",
            credits: clean(row.credits) || null,
            prescribedWeeks: clean(row.prescribedWeeks) || null,
            prescribedHours: clean(row.prescribedHours) || null,
            completedHours: row.completedHours ? parseInt(row.completedHours) || 0 : 0,
            hospital: clean(row.hospital) || "Null",
          }).catch(err => console.error(`ClinicalExperience Error (ID: ${studentId}):`, err.message));
        }

        if (row.additionalCourseName || row.courseName) {
          console.log(`DEBUG: Processing AdditionalCourse for ${studentId}`);
          await AdditionalCourses.upsert({
            studentId,
            courseId: clean(row.additionalCourseId || row.courseId) || "Null",
            courseName: clean(row.additionalCourseName || row.courseName) || "Null",
            from: parseDate(row.additionalCourseFrom || row.from),
            to: parseDate(row.additionalCourseTo || row.to),
          }).catch(err => console.error(`AdditionalCourses Error (ID: ${studentId}):`, err.message));
        }

        if (row.courseSemester && row.courseCode) {
          console.log(`DEBUG: Processing CourseInstruction for ${studentId}, Code: ${row.courseCode}`);
          await CourseInstruction.upsert({
            studentId,
            semester: clean(row.courseSemester) || "Null",
            sNo: clean(row.sNo) || "Null",
            courseCode: clean(row.courseCode) || "Null",
            courseTitle: clean(row.courseTitle) || "Null",
            theoryCredits: clean(row.theoryCredits) || null,
            skillLabCredits: clean(row.skillLabCredits) || null,
            clinicalCredits: clean(row.clinicalCredits) || null,
          }).catch(err => console.error(`CourseInstruction Error (ID: ${studentId}):`, err.message));
        }

        if (row.attendanceSemester) {
          console.log(`DEBUG: Processing AttendanceRecord for ${studentId}`);
          await AttendanceRecord.upsert({
            studentId,
            semester: clean(row.attendanceSemester) || "Null",
            workingDays: parseInt(row.workingDays) || 0,
            annualLeave: parseInt(row.annualLeave) || 0,
            sickLeave: parseInt(row.sickLeave) || 0,
            gazettedHolidays: parseInt(row.gazettedHolidays) || 0,
            otherLeave: parseInt(row.otherLeave) || 0,
            compensationDaysHours: clean(row.compensationDaysHours) || "Null",
          }).catch(err => console.error(`AttendanceRecord Error (ID: ${studentId}):`, err.message));
        }

        if (row.projectSemester && row.projectTitle) {
          await ResearchProject.upsert({
            studentId,
            semester: clean(row.projectSemester) || "Null",
            areaOfStudy: clean(row.areaOfStudy) || "Null",
            type: clean(row.projectType) || "Null",
            projectTitle: clean(row.projectTitle) || "Null",
          }).catch(err => console.error(`ResearchProject Error (ID: ${studentId}):`, err.message));
        }

        if (row.certificateCourseName) {
          await CourseCompletion.upsert({
            studentId,
            courseName: clean(row.certificateCourseName) || "Null",
            certificateNumber: clean(row.certificateNumber) || "Null",
            dateOfIssue: parseDate(row.certificateDateOfIssue),
          }).catch(err => console.error(`CourseCompletion Error (ID: ${studentId}):`, err.message));
        }

        if (row.activitySemester) {
          await ActivityParticipation.upsert({
            studentId,
            semester: clean(row.activitySemester) || "Null",
            sports: clean(row.sports) || "Null",
            coCurricular: clean(row.coCurricular) || "Null",
            extraCurricular: clean(row.extraCurricular) || "Null",
            sna: clean(row.sna) || "Null",
            nssYrcRrc: clean(row.nssYrcRrc) || "Null",
            cne: clean(row.cne) || "Null",
            awardsRewards: clean(row.awardsRewards) || "Null",
          }).catch(err => console.error(`ActivityParticipation Error (ID: ${studentId}):`, err.message));
        }

        if (row.visitSemester && row.institutionPlace) {
          await ObservationalVisit.upsert({
            studentId,
            semester: clean(row.visitSemester) || "Null",
            institutionPlace: clean(row.institutionPlace) || "Null",
            date: parseDate(row.visitDate),
          }).catch(err => console.error(`ObservationalVisit Error (ID: ${studentId}):`, err.message));
        }

        // Collect Verification Data
        if (row.verificationSemester) {
          verificationList.push({
            semester: clean(row.verificationSemester) || "Null",
            classTeacherName: clean(row.classTeacherName) || "Null",
            teacherSignature: clean(row.teacherSignature) || "Null",
            principalSignature: clean(row.principalSignature) || "Null",
          });
        }
      } // end repeating loop

      // === Handle Verification (One upsert per student, JSON array) ===
      if (verificationList.length > 0) {
        await Verification.upsert({
          studentId,
          verifications: verificationList
        }).catch(err => console.error(`Verification Error (ID: ${studentId}):`, err.message));
      }

      processed++;
    }

    res.json({
      success: true,
      message: `Bulk upload successful! ${processed} students processed.`,
      processed,
    });

  } catch (error) {
    console.error("Bulk Upload Error:", error);
    res.status(500).json({
      success: false,
      error: "Upload failed: " + error.message,
    });
  }
};

module.exports = { bulkUploadExcel };