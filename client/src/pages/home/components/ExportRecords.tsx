import { Button } from "@/components/ui/button";
import exportPatientRecordsToPDF from "@/lib/exportPatientRecordsToPDF";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { PatientRecord } from "../data";

const ExportRecords = ({ patients }: { patients: PatientRecord[] }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleExportToExcel = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/patientRecords/export", {
        responseType: "blob",
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "PatientRecords.xlsx"); // File name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Records exported successfully.");
      } else {
        toast.error("Failed to export records. Please try again.");
      }
    } catch (error: any) {
      console.error("Error exporting records:", error);
      if (error.response && error.response.status === 404) {
        toast.error("No records found for the user.");
      } else {
        toast.error("An error occurred while exporting records.");
      }
    } finally {
      setLoading(false);
      setDropdownOpen(false);
    }
  };

  return (
    <div>
      <Button
        onClick={() => setDropdownOpen((prev) => !prev)}
        disabled={loading}
        className="space-x-2 bg-blue-950"
      >
        <span className="text-sm tracking-wider">Export</span>
      </Button>
      {isDropdownOpen && (
        <div className="absolute bg-white border p-2 shadow-lg rounded-md mt-2 z-40 space-y-2">
          <Button
            variant={"secondary"}
            onClick={() => {
              handleExportToExcel();
            }}
            className="block text-left w-full"
          >
            Export to Excel
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              exportPatientRecordsToPDF(patients);
              setDropdownOpen(false);
            }}
            className="block text-left w-full"
          >
            Export to PDF
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExportRecords;
