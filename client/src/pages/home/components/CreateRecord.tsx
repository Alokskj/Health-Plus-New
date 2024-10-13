import { Plus } from "lucide-react";
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
import { useForm, useFieldArray } from "react-hook-form";
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
import React from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface IProps {
  fetchAllRecords: () => void;
}

const testSchema = z.object({
  LabNo: z.string().min(1, { message: "Lab  number must be specified." }),
  PanelName: z.string().min(3, { message: "Lab name must be at least 3 characters." }),
  PanelId: z.string().min(1, { message: "Panel ID must be specified." }),
  ClientCode: z.string().min(1, { message: "Client code must be specified." }),
  ItemName: z.array(z.string().min(1, { message: "Test type must be specified." })),
  amountPaid: z.preprocess(val => Number(val), z.number().nonnegative({ message: "Amount paid must be a valid non-negative number." })),
  amountDue: z.preprocess(val => Number(val), z.number().nonnegative({ message: "Amount due must be a valid non-negative number." })),
  DATE: z.string().refine(date => !isNaN(Date.parse(date)), { message: "Date must be a valid date." }),
  collectedBy: z.string().min(1, { message: "Collected by must be specified." }),
});

const formSchema = z.object({
  PName: z.string().min(3, { message: "Patient name must be at least 3 characters." }),
  doctorname: z.string().min(3, { message: "Doctor name must be at least 3 characters." }),
  username: z.string().min(1, { message: "Username must be specified." }),
  mobileNumber: z.string().min(10, { message: "Mobile Number must be specified." }),
  age: z.string().min(1, { message: "Age must be specified." }),
  gender: z.string().min(1, { message: "Gender must be specified." }),

  tests: z.array(testSchema),
});

type FormSchemaType = z.infer<typeof formSchema>;

const CreateRecord: React.FC<IProps> = ({ fetchAllRecords }) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      PName: "",
      doctorname: "",
      username: "",
      mobileNumber:"" ,
      age:"",
      gender:"",
      
      tests: [{ LabNo: "", PanelName: "", PanelId: "", ClientCode: "", ItemName: [""], amountPaid: 0, amountDue: 0, DATE: "", collectedBy: "",}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tests",
  });

  async function onSubmit(values: FormSchemaType) {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/patientRecords/create", values);

      if (data && data?.success) {
        await fetchAllRecords();
        toast.success(data?.message);
        setIsModalOpen(false);
      }
    } catch (error: any) {
      if (error && error?.response) {
        toast.error(error?.response?.data?.message);
      }
      console.log("Error : ", error?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
      <DialogTrigger onClick={() => setIsModalOpen(true)} asChild>
        <Button className="space-x-2">
          <Plus size={18} />
          <span className="text-sm tracking-wider">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-6xl h-full sm:max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        <DialogHeader>
          <DialogTitle className="text-start">Create New Record</DialogTitle>
          <DialogDescription className="text-start">
            Fill out the form below to create a new patient record.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full h-full flex flex-col justify-between">
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
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Mobile Number</FormLabel>
                        <FormControl>
                          <Input type="string" step="0.01" placeholder="Enter your number" {...field} />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Age</FormLabel>
                        <FormControl>
                          <Input type="string" step="0.01" placeholder="Enter patient age" {...field} />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Gender</FormLabel>
                        <FormControl>
                          <Input type="string" step="0.01" placeholder="Choose Gender" {...field} />
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
                
                  <FormField
                    control={form.control}
                    name={`tests.${index}.LabNo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Lab Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123456" {...field} />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tests.${index}.PanelName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Panel Name</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC Lab" {...field} />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tests.${index}.PanelId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Panel ID</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tests.${index}.ClientCode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Client Code</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC123" {...field} />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tests.${index}.ItemName.0`}
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
                    name={`tests.${index}.amountPaid`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Amount Paid</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="250.00" {...field} />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tests.${index}.amountDue`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Amount Due</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="50.00" {...field} />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tests.${index}.DATE`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Date</FormLabel>
                        <FormControl>
                          <Input type="date" placeholder="2023-01-01" {...field} />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tests.${index}.collectedBy`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Collected By</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="button" variant="destructive" className="mt-4" onClick={() => remove(index)}>Remove Test</Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ LabNo: "", PanelName: "", PanelId: "", ClientCode: "", ItemName: [""], amountPaid: 0, amountDue: 0, DATE: "", collectedBy: "" ,})}>
              Add Test
            </Button>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecord;
