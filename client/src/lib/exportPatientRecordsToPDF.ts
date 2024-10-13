import { PatientRecord } from "@/pages/home/data";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerImage from "@/assets/images/invoice-header.png";
import footerImage from "@/assets/images/invoice-footer.png";
const exportPatientRecordsToPDF = (patientRecords: PatientRecord[]) => {
  const doc = new jsPDF("landscape");

  // Add the header image
  const headerImg = new Image();
  headerImg.src = headerImage;
  headerImg.onload = () => {
    const pageWidth = doc.internal.pageSize.getWidth(); // Get the full width of the page

    doc.addImage(headerImg, "JPEG", 0, 0, pageWidth, 30, undefined, "SLOW"); // Add header image

    let currentY = 40; // Y position for the content after the header, with a margin

    // Add business details
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102);
    doc.text("ARSH SERUM DIAGNOSIS & BROTHER'S CO.", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 8; // Increment Y position for the next line
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(
      "Post Office Gali, Near Karimganj Bridge, Karimganj, Gaya (Bihar)",
      pageWidth / 2,
      currentY,
      { align: "center" }
    );

    currentY += 6; // Increment Y position for the next line
    doc.text(
      "Mobile: 6204758086, 7004921818 | WhatsApp: 9234936845",
      pageWidth / 2,
      currentY,
      { align: "center" }
    );

    currentY += 6; // Increment Y position for the next line
    doc.text("GSTIN: 10ABEPB0117P1Z3", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5; // Adjust Y position after adding business details

    // Define the columns for the table
    const columns = [
      { header: "S. No", dataKey: "serialNo" },
      { header: "Patient Name", dataKey: "PName" },
      { header: "Doctor Name", dataKey: "doctorname" },
      { header: "Mobile Number", dataKey: "mobileNumber" },
      { header: "Gender", dataKey: "gender" },
      { header: "Age", dataKey: "age" },
      { header: "Test Lab Number", dataKey: "testLabNumber" },
      { header: "Panel Name", dataKey: "panelName" },
      { header: "Panel Id", dataKey: "panelId" },
      { header: "Client Code", dataKey: "clientCode" },
      { header: "Item Name", dataKey: "itemName" },
      { header: "Amount Paid", dataKey: "amountPaid" },
      { header: "Amount Due", dataKey: "amountDue" },
      { header: "Collected By", dataKey: "collectedBy" },
      { header: "Date", dataKey: "date" },
    ];

    let totalAmountPaid = 0;
    let totalAmountDue = 0;
    let serialNo = 1;

    // Prepare the data for the table
    const rows = patientRecords.flatMap((patient) =>
      patient.tests.map((test) => {
        // Sum the amounts
        const amountPaid = isNaN(test.amountPaid) ? 0 : Number(test.amountPaid);
        const amountDue = isNaN(test.amountDue) ? 0 : Number(test.amountDue);
        totalAmountPaid += amountPaid;
        totalAmountDue += amountDue;
        return {
          serialNo: String(serialNo++),
          PName: patient.PName,
          doctorname: patient.doctorname,
          mobileNumber: patient.mobileNumber || "N/A",
          gender: patient.gender || "N/A",
          age: patient.age || "N/A",
          testLabNumber: String(test.LabNo),
          panelName: test.PanelName,
          panelId: test.PanelId || "N/A",
          clientCode: test.ClientCode || "N/A",
          itemName: test.ItemName.join(", "),
          amountPaid: test.amountPaid || "N/A",
          amountDue: test.amountDue || "N/A",
          collectedBy: test.collectedBy || "N/A",
          date: new Date(test.DATE).toLocaleDateString(),
        };
      })
    );

    // Add total row
    rows.push({
      serialNo: "Total",
      PName: "",
      doctorname: "",
      mobileNumber: "",
      gender: "",
      age: "",
      testLabNumber: "",
      panelName: "",
      panelId: "",
      clientCode: "",
      itemName: "",
      amountPaid: totalAmountPaid.toString(),
      amountDue: totalAmountDue.toString(),
      collectedBy: "",
      date: "",
    });

    // Add the table to the PDF
    autoTable(doc, {
      columns,
      body: rows,
      styles: {
        fontSize: 8,
      },
      startY: currentY + 10, // Start table 10 units below the last text
      didParseCell: (data) => {
        if (data.row.index === rows.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [221, 234, 247];
        }
      },
      didDrawPage: function (data) {
        let str = "Page " + data.pageNumber;
        doc.setFontSize(10);
        doc.text(str, pageWidth / 2, 200, { align: "center" });
      },
    });

    // Add the footer image
    const footerImg = new Image();
    footerImg.src = footerImage;
    footerImg.onload = () => {
      const footerY = doc.internal.pageSize.getHeight() - 50; // Set footer position
      doc.addImage(
        footerImg,
        "JPEG",
        0,
        footerY,
        pageWidth,
        50,
        undefined,
        "SLOW"
      ); // Add footer image
      doc.save("patient_records.pdf");
    };
  };
};

export default exportPatientRecordsToPDF;
