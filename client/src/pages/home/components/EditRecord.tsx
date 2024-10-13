import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useMemo } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import moment from "moment";

interface TestRecord {
  _id: string;
  LabNo: number;
  PanelName: string;
  PanelId: number;
  ClientCode: string;
  ItemName: string[];
  amountPaid: number;
  amountDue: number;
  DATE: Date;
  collectedBy: string;
}

interface PatientRecord {
  _id: string;
  userId: string;
  PName: string;
  doctorname: string;
  username: string;
  mobileNumber?: string;
  gender?: "Male" | "Female" | "Other";
  age?: number;
  tests: TestRecord[];
}

interface IProps {
  patientRecord: PatientRecord;
  fetchAllRecords: () => void;
}

const formSchema = z.object({
  PName: z.string().min(3, {
    message: "Patient name must be at least 3 characters.",
  }),
  doctorname: z.string().min(3, {
    message: "Doctor name must be at least 3 characters.",
  }),
  PanelName: z.string().min(3, {
    message: "Lab name must be at least 3 characters.",
  }),
  ItemName: z.array(z.string()).min(1, {
    message: "Test type must be specified.",
  }),
  LabNo: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().positive({
      message: "Lab Number must be a valid positive number.",
    })
  ),
  DATE: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Date of visit must be a valid date.",
  }),
});

const EditRecord: React.FC<IProps> = ({ patientRecord, fetchAllRecords }) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const defaultValues = useMemo(
    () => ({
      PName: patientRecord.PName || "",
      doctorname: patientRecord.doctorname || "",
      PanelName: patientRecord.tests[0]?.PanelName || "",
      ItemName: patientRecord.tests[0]?.ItemName || [],
      LabNo: patientRecord.tests[0]?.LabNo || 0,
      DATE: patientRecord.tests[0]?.DATE ? moment(patientRecord.tests[0]?.DATE).format("YYYY-MM-DD") : "",
    }),
    [patientRecord]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/patientRecords/edit/${patientRecord._id}`,
        values
      );
      if (data && data.success) {
        await fetchAllRecords();
        toast.success(data.message);
        setIsModalOpen(false);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred");
      }
      console.log("Error: ", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => setIsModalOpen(!isModalOpen)}
    >
      <DialogTrigger onClick={() => setIsModalOpen(true)} asChild>
        <button className="text-blue-600">
          <Pencil size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-6xl h-full sm:max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        <DialogHeader>
          <DialogTitle className="text-start">Update Record</DialogTitle>
          <DialogDescription className="text-start">
            Fill out the form below to update the patient record.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full h-full flex flex-col justify-between"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
              <FormField
                control={form.control}
                name="PName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doctorname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Doctor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Smith" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="PanelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Lab Name</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC Lab" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ItemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Test Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Blood" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="LabNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Lab Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" type="number" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="DATE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Date of Visit</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex flex-row justify-end gap-3 py-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {loading ? "Please wait.." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecord;
