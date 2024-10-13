import { PatientRecord, TestRecord } from "@/pages/home/data";
import jsPDF from "jspdf";
import headerImage from "@/assets/images/invoice-header.png"; // Path to the uploaded header image
import footerImage from "@/assets/images/invoice-footer.png"; // Path to the uploaded footer image

const exportPatientRecordToPDF = async (
  patient: PatientRecord,
  test: TestRecord
) => {
  const doc = new jsPDF();

  // Add the header image
  const headerImg = new Image();
  headerImg.src = headerImage;

  headerImg.onload = () => {
    const pageWidth = doc.internal.pageSize.getWidth(); // Get the full width of the page
    const pageHeight = doc.internal.pageSize.getHeight(); // Get the full height of the page
    const headerAspectRatio = headerImg.height / headerImg.width; // Calculate the aspect ratio of the header
    const headerWidth = pageWidth; // Set image width to page width
    const headerHeight = headerWidth * headerAspectRatio; // Adjust height based on aspect ratio

    doc.addImage(
      headerImg,
      "JPEG",
      0,
      0,
      headerWidth,
      headerHeight,
      undefined,
      "SLOW"
    ); // Add header image

    let currentY = headerHeight; // Y position for the content after the header

    // Add business details
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102);
    doc.text("ARSH SERUM DIAGONOSIS & BROTHER'S CO.", 105, currentY + 5, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(
      "Post Office Gali, Near Karimganj Bridge, Karimganj, Gaya (Bihar)",
      105,
      currentY + 12,
      { align: "center" }
    );
    doc.text(
      "Mobile: 6204758086, 7004921818 | WhatsApp: 9234936845",
      105,
      currentY + 18,
      {
        align: "center",
      }
    );
    doc.text("GSTIN: 10ABEPB0117P1Z3", 105, currentY + 24, { align: "center" });

    currentY += 30; // Adjust Y position after adding business details
    // Optional line under the image
    doc.setLineWidth(0.5);
    doc.line(0, currentY, pageWidth, currentY);
    // Patient Information section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102);
    doc.text("Patient Information", 20, currentY + 10);

    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.roundedRect(18, currentY + 15, 175, 45, 3, 3);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Name:", 25, currentY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(`${patient.PName}`, 60, currentY + 25);

    doc.setFont("helvetica", "bold");
    doc.text("Doctor:", 25, currentY + 35);
    doc.setFont("helvetica", "normal");
    doc.text(`${patient.doctorname}`, 60, currentY + 35);

    doc.setFont("helvetica", "bold");
    doc.text("Username:", 25, currentY + 45);
    doc.setFont("helvetica", "normal");
    doc.text(`${patient.username}`, 60, currentY + 45);

    doc.setFont("helvetica", "bold");
    doc.text("Mobile:", 25, currentY + 55);
    doc.setFont("helvetica", "normal");
    doc.text(`${patient.mobileNumber || "N/A"}`, 60, currentY + 55);

    doc.setFont("helvetica", "bold");
    doc.text("Gender:", 120, currentY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(`${patient.gender || "N/A"}`, 145, currentY + 25);

    doc.setFont("helvetica", "bold");
    doc.text("Age:", 120, currentY + 35);
    doc.setFont("helvetica", "normal");
    doc.text(`${patient.age || "N/A"}`, 145, currentY + 35);

    currentY += 70; // Move Y position down after the patient information

    // Test Information section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102);
    doc.text("Test Information", 20, currentY);

    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.roundedRect(18, currentY + 5, 175, 85, 3, 3);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Lab No:", 25, currentY + 15);
    doc.setFont("helvetica", "normal");
    doc.text(`${test.LabNo}`, 60, currentY + 15);

    doc.setFont("helvetica", "bold");
    doc.text("Panel Name:", 25, currentY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(`${test.PanelName}`, 60, currentY + 25);

    doc.setFont("helvetica", "bold");
    doc.text("Client Code:", 25, currentY + 35);
    doc.setFont("helvetica", "normal");
    doc.text(`${test.ClientCode}`, 60, currentY + 35);

    doc.setFont("helvetica", "bold");
    doc.text("Items:", 25, currentY + 45);
    doc.setFont("helvetica", "normal");
    doc.text(`${test.ItemName.join(", ")}`, 60, currentY + 45);

    doc.setFont("helvetica", "bold");
    doc.text("Amount Paid:", 25, currentY + 55);
    doc.setFont("helvetica", "normal");
    doc.text(`${test.amountPaid || "N/A"}`, 60, currentY + 55);

    doc.setFont("helvetica", "bold");
    doc.text("Amount Due:", 25, currentY + 65);
    doc.setFont("helvetica", "normal");
    doc.text(`${test.amountDue || "N/A"}`, 60, currentY + 65);

    doc.setFont("helvetica", "bold");
    doc.text("Date:", 25, currentY + 75);
    doc.setFont("helvetica", "normal");
    doc.text(`${new Date(test.DATE).toLocaleDateString()}`, 60, currentY + 75);

    doc.setFont("helvetica", "bold");
    doc.text("Collected By:", 25, currentY + 85);
    doc.setFont("helvetica", "normal");
    doc.text(`${test.collectedBy || "N/A"}`, 60, currentY + 85);

    currentY += 100; // Adjust for the test information height

    // Add the footer image
    const footerImg = new Image();
    footerImg.src = footerImage;

    footerImg.onload = () => {
      const footerAspectRatio = footerImg.height / footerImg.width;
      const footerWidth = pageWidth;
      const footerHeight = footerWidth * footerAspectRatio;
      const footerY = pageHeight - footerHeight; // Position the footer near the bottom of the page

      // Add footer image to the PDF
      doc.addImage(
        footerImg,
        "JPEG",
        0,
        footerY,
        footerWidth,
        footerHeight,
        undefined,
        "SLOW"
      );

      // Save the PDF
      doc.save(`${patient.PName}_medical_record.pdf`);
    };
  };
};

export default exportPatientRecordToPDF;
