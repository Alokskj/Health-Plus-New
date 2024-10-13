import mongoose from "mongoose";
import PatientRecord from "../models/patientRecord.models.js";
import XLSX from "xlsx";
import fs from 'fs';

export const createPatientRecord = async (req, res) => {
  const userId = req.user._id;
  const {
    PName,
    mobileNumber,
    username,
    age,
    gender,
    doctorname,
    LabNo,
    tests,
  } = req.body;

  try {
    const newRecord = new PatientRecord({
      userId,
      PName,
      mobileNumber,
      username,
      age,
      gender,
      doctorname,
      tests,
    });

    if (newRecord) {
      await newRecord.save();
      res.status(201).json({
        success: true,
        message: "Patient record created successfully",
        data: newRecord,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid patient record",
      });
    }
  } catch (error) {
    console.error("Error in create record: ", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create patient record",
    });
  }
};

// export const createPatientRecord = async (req, res) => {
//   const userId = req.user._id;
//   const {
//     PName,
//     mobileNumber,
//     username,
//     age,
//     gender,
//     doctorname,
//     PanelName,
//     PanelId,
//     ClientCode,
//     ItemName,
//     LabNo,
//     amountPaid,
//     amountDue,
//     DATE,
//     dateOfReport,
//   } = req.body;

//   try {
//     const newRecord = new PatientRecord({
//       userId,
//       PName,
//       mobileNumber,
//       username,
//       age,
//       gender,
//       doctorname,
//       PanelName,
//       PanelId,
//       ClientCode,
//       ItemName,
//       LabNo,
//       amountPaid,
//       amountDue,
//       DATE,
//       dateOfReport,
//     });

//     if (newRecord) {
//       await newRecord.save();
//       res.status(201).json({
//         success: true,
//         message: "Patient record created successfully",
//         data: newRecord,
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Invalid patient record",
//       });
//     }
//   } catch (error) {
//     console.error("Error in create record: ", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create patient record",
//     });
//   }
// };

export const editPatientRecord = async (req, res) => {
  const { id } = req.params; // Assuming you pass the patient record ID in the URL
  const {
    PName,
    mobileNumber,
    username,
    age,
    gender,
    doctorname,
    PanelName,
    PanelId,
    ClientCode,
    ItemName,
    LabNo,
    amountPaid,
    amountDue,
    DATE,
    dateOfReport,
    collectedBy,
  } = req.body;

  try {
    const updatedRecord = await PatientRecord.findByIdAndUpdate(
      id,
      {
        PName,
        mobileNumber,
        username,
        age,
        gender,
        doctorname,
        PanelName,
        PanelId,
        ClientCode,
        ItemName,
        LabNo,
        amountPaid,
        amountDue,
        DATE,
        dateOfReport,
        collectedBy,
      },
      { new: true }
    );

    if (updatedRecord) {
      res.status(200).json({
        success: true,
        message: "Patient record updated successfully",
        data: updatedRecord,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Patient record not found",
      });
    }
  } catch (error) {
    console.error("Error in edit record: ", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update patient record",
    });
  }
};

export const deletePatientRecord = async (req, res) => {
  const { id } = req.params; // Assuming you pass the patient record ID in the URL

  try {
    const deletedRecord = await PatientRecord.findByIdAndDelete(id);

    if (deletedRecord) {
      res.status(200).json({
        success: true,
        message: "Patient record deleted successfully",
        data: deletedRecord,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Patient record not found",
      });
    }
  } catch (error) {
    console.error("Error in delete record: ", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete patient record",
    });
  }
};

export const getAllPatientRecords = async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const {
    search,
    startDate,
    endDate,
    sortTime,
    page = 1,
    pageSize = 10,
  } = req.query;

  try {
    let query = {};

    if (userRole !== 'admin') {
      query.userId = userId;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i"); // case-insensitive regex
      // Check if search is numeric (for LabNo search)
      if (!isNaN(search)) {
        query["tests.LabNo"] = Number(search); // Direct numeric comparison for LabNo
      } else {
        query.$or = [
          { PName: searchRegex },
          { doctorname: searchRegex },
          {
            mobileNumber: search
          },
          { "tests.PanelName": searchRegex },
        ];
      }
    }

    // Add date range filter on DATE
    if (startDate || endDate) {
      query["tests.DATE"] = {};
      if (startDate) {
        query["tests.DATE"].$gte = new Date(startDate);
      }
      if (endDate) {
        query["tests.DATE"].$lte = new Date(endDate);
      }
    }

    // Add sortTime filter
    if (sortTime) {
      const now = new Date();
      let pastDate;

      switch (sortTime) {
        case "3-months":
          pastDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        case "6-months":
          pastDate = new Date(now.setMonth(now.getMonth() - 6));
          break;
        case "1-year":
          pastDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          pastDate = null;
      }

      if (pastDate) {
        if (!query["tests.DATE"]) {
          query["tests.DATE"] = {};
        }
        query["tests.DATE"].$gte = pastDate;
      }
    }

    const skip = (page - 1) * pageSize;

    // Fetch the patient records
    const patientRecords = await PatientRecord.find(query)
      .sort({ "tests.DATE": -1 })
      .skip(skip)
      .limit(parseInt(pageSize))
      .populate('userId', 'name');

    const totalRecords = await PatientRecord.countDocuments(query);

    // Calculate total earnings, total due, and total patients
    const totalAggregation = await PatientRecord.aggregate([
      { $match: query },
      { $unwind: "$tests" }, // Unwind the tests array
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$tests.amountPaid" },
          totalDue: { $sum: "$tests.amountDue" },
          totalPatients: { $addToSet: "$_id" }, // Using $addToSet to count unique patients
        },
      },
      {
        $project: {
          totalEarnings: 1,
          totalDue: 1,
          totalPatients: { $size: "$totalPatients" }, // Calculate the total number of unique patients
        },
      },
    ]);

    const totalEarnings = totalAggregation[0]?.totalEarnings || 0;
    const totalDue = totalAggregation[0]?.totalDue || 0;
    const totalPatients = totalAggregation[0]?.totalPatients || 0;

    // Calculate monthly earnings, due, and patients
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyAggregation = await PatientRecord.aggregate([
      {
        $match: {
          ...(userRole !== 'admin' && { userId: new mongoose.Types.ObjectId(userId) }),
          "tests.DATE": {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        },
      },
      { $unwind: "$tests" }, // Unwind the tests array
      {
        $group: {
          _id: null,
          monthlyEarnings: { $sum: "$tests.amountPaid" },
          monthlyDue: { $sum: "$tests.amountDue" },
          monthlyPatients: { $addToSet: "$_id" }, // Count unique patients
        },
      },
      {
        $project: {
          monthlyEarnings: 1,
          monthlyDue: 1,
          monthlyPatients: { $size: "$monthlyPatients" }, // Calculate the total number of unique patients
        },
      },
    ]);

    const monthlyEarnings = monthlyAggregation[0]?.monthlyEarnings || 0;
    const monthlyDue = monthlyAggregation[0]?.monthlyDue || 0;
    const monthlyPatients = monthlyAggregation[0]?.monthlyPatients || 0;

    res.status(200).json({
      success: true,
      message: "Patient records retrieved successfully",
      data: patientRecords,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      currentPage: parseInt(page),
      totalEarnings,
      totalDue,
      totalPatients,
      monthlyEarnings,
      monthlyDue,
      monthlyPatients,
    });
  } catch (error) {
    console.error("Error in getAllPatientRecords: ", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve patient records",
    });
  }
};


// export const getAllPatientRecords = async (req, res) => {
//   const userId = req.user._id;
//   console.log({ query: req.query });
//   const { search } = req.query;

//   try {
//     const patientRecords = await PatientRecord.find({ userId }).sort({
//       createdAt: -1,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Patient records retrieved successfully",
//       data: patientRecords,
//     });
//   } catch (error) {
//     console.error("Error in get all records: ", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to retrieve patient records",
//     });
//   }
// };



export const uploadPatientRecords = async (req, res) => {
  try {
    const userId = req.user._id;
    const filePath = req.file.path;

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const parseDate = (dateValue) => {
      if (typeof dateValue === 'number') {
        return new Date(Date.UTC(0, 0, dateValue - 1));
      } else {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid date format: ${dateValue}`);
        }
        return date;
      }
    };

    const bulkOps = worksheet.map((record) => {
      const filter = {
        userId: new mongoose.Types.ObjectId(userId),
        PName: record.PName,
      };

      const testRecord = {
        LabNo: record.LabNo,
        PanelName: record.PanelName,
        PanelId: record.PanelID,
        ClientCode: record.ClientCode,
        ItemName: Array.isArray(record.ItemName) ? record.ItemName : [record.ItemName],
        amountPaid: record.amountPaid,
        amountDue: record.amountDue,
        DATE: parseDate(record.DATE),

        collectedBy: record.collectedBy,
      };

      return {
        updateOne: {
          filter,
          update: {
            $setOnInsert: {
              userId: new mongoose.Types.ObjectId(userId),
              PName: record.PName,
              doctorname: record.doctorname,
              username: record.username,
              mobileNumber: record.mobileNumber,
              gender: record.gender,
              age: record.age,
            },
            $push: {
              tests: testRecord,
            },
          },
          upsert: true,
        },
      };
    });

    await PatientRecord.bulkWrite(bulkOps);

    res.status(200).send({ success: true, message: 'Records processed successfully!' });

    await fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send({ success: false, message: 'An error occurred while processing records.' });
  }
};


export const exportPatientRecords = async (req, res) => {
  try {
    const userId = req.user._id
    const records = await PatientRecord.find({ userId }).lean();
    console.log(records);
    if (!records || records.length === 0) {
      return res.status(404).json({ success: false, message: "No records found" });
    }
    const formattedRecords = records.map(record => {
      return record.tests.map(test => ({
        doctorname: record.doctorname,
        DATE: test.DATE,
        username: record.username,
        LabNo: test.LabNo,
        PName: record.PName,
        PanelName: test.PanelName,
        PanelID: test.PanelId,
        ClientCode: test.ClientCode,
        ItemName: test.ItemName.join(", "),
      }));
    }).flat();

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedRecords);
    XLSX.utils.book_append_sheet(workbook, worksheet, "PatientRecords");

    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers for file download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=PatientRecords.xlsx");

    res.send(excelBuffer);
  } catch (error) {
    console.error("Error exporting records:", error);
    res.status(500).send({ success: false, message: "Error exporting records" });
  }
};

