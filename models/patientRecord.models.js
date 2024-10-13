// import mongoose from "mongoose";
// const { Schema } = mongoose;

// const patientRecordSchema = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//     },
//      doctorname: {
//       type: String,
//       required: true,
//     },
//     DATE: {
//       type: Date,
//       required: true
//     },
//     username: {
//       type: String,
//     },
//     LabNo: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     PName: {
//       type: String,
//       minlength: 3,
//     },
//     PanelName: {
//       type: String,
//       minlength: 3
//     },
//     PanelId: { 
//       type: Number,
//       min: 0
//     },
//     ClientCode: {
//       type: String,
//       minlength: 3
//     },
//     ItemName: {
//       type: [String],
//       default: []
//     },
//      amountPaid: {
//       type: Number,
//       min: 0,
//     },
//     amountDue: {
//       type: Number,
//       min: 0,
//     },
//     collectedBy: {
//       type: String,
//     }
//     // dateOfVisit: {
//     //   type: Date,
//     //   required: true,
//     // },
//     // dateOfReport: {
//     //   type: Date,
//     //   required: true,
//     // },
//     // mobileNumber: {
//     //   type: String,
//     //   required: true,
//     //   match: /^\d{10}$/,
//     // },
//     //  age: {
//     //   type: Number,
//     //   required: true,
//     //   min: 0,
//     // },
//     //  gender: {
//     //   type: String,
//     //   required: true,
//     //   enum: ["Male", "Female", "Other"],
//     // },
//   },
//   {
//     timestamps: true,
//   }
// );

// const PatientRecord = mongoose.model("PatientRecord", patientRecordSchema);
// export default PatientRecord;


import mongoose from "mongoose";
const { Schema } = mongoose;

const testRecordSchema = new Schema(
  {
    LabNo: {
      type: Number,
      required: true,
      min: 0,
    },
    PanelName: {
      type: String,
      minlength: 3,
    },
    PanelId: {
      type: Number,
      min: 0,
    },
    mobileNumber: {
      type:String,
      minlength: 10,
    },
    ClientCode: {
      type: String,
      minlength: 3,
    },
    ItemName: {
      type: [String],
      default: [],
    },
    amountPaid: {
      type: Number,
      min: 0,
    },
    amountDue: {
      type: Number,
      min: 0,
    },
    DATE: {
      type: Date,
      required: true,
    },
    collectedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const patientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    PName: {
      type: String,
      minlength: 3,
    },
    doctorname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    gender: {
      type: String,
    },
    age: {
      type: Number,
    },
    tests: [testRecordSchema], // Embedded array of test records
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
