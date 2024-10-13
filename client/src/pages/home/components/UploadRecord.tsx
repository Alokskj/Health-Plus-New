import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Upload } from "lucide-react";

interface IProps {
  fetchAllRecords: () => void;
}

const UploadRecord: React.FC<IProps> = ({ fetchAllRecords }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const onSubmit = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const { data } = await axios.post("/api/patientRecords/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data);
      
      if (data && data.success) {
        await fetchAllRecords();
        toast.success(data.message);
        setIsModalOpen(false);
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.log("Error : ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
      <DialogTrigger onClick={() => setIsModalOpen(true)} asChild>
        <Button className="space-x-2 bg-blue-950">
          <Upload size={18} />
          <span className="text-sm tracking-wider">Bulk Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-xl h-full sm:max-h-[40vh] overflow-y-auto flex flex-col justify-between">
        <DialogHeader>
          <DialogTitle className="text-start">Upload Bulk Record</DialogTitle>
          <DialogDescription className="text-start">
            Choose an Excel file containing patient records and upload here.
            <br />
             Download sample excel file : <a style={{ color: "blue" }} href="/sample.xlsx" download="sample.xlsx">
  Click Here
</a>
          </DialogDescription>
        </DialogHeader>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <Button onClick={onSubmit} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UploadRecord;
