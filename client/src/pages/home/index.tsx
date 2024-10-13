import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ArrowRightFromLine, Search, Trash2 } from "lucide-react";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { FaBed } from "react-icons/fa6";
import CreateRecord from "./components/CreateRecord";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";
import useData from "./data";
import EditRecord from "./components/EditRecord";
import React from "react";
import UploadRecord from "./components/UploadRecord";
import { useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";
import ExportRecords from "./components/ExportRecords";
import exportPatientRecordToPDF from "@/lib/exportPatientRecordToPDF";

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    state,
    setSearch,
    setStartDate,
    setEndDate,
    setSortTime,
    fetchAllRecords,
    handleDeleteRecord,
    handleNextPage,
    handlePrevPage,
  } = useData();
  const {
    patientRecords,
    search,
    startDate,
    endDate,
    sortTime,
    recordInfo,
    page,
    maxPage,
  } = state;

  return (
    <div>
      <Header />
      <div className="container py-5">
        {/* Cards of dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-7 mt-14">
          <div className="flex items-center gap-3 border bg-white border-gray-300 rounded-md shadow-md p-5">
            <div className="bg-pink-600 rounded-md p-3">
              <GiReceiveMoney size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                ₹{recordInfo?.totalEarnings}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Total Earning
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 border bg-white border-gray-300 rounded-md shadow-md p-5">
            <div className="bg-red-600 rounded-md p-3">
              <GiPayMoney size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                ₹{recordInfo?.totalDue}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Total Amount Due
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 border bg-white border-gray-300 rounded-md shadow-md p-5">
            <div className="bg-yellow-500 rounded-md p-3">
              <FaBed size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                {recordInfo?.totalPatients}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Total Patients
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 border bg-white border-gray-300 rounded-md shadow-md p-5">
            <div className="bg-green-600 rounded-md p-3">
              <GiReceiveMoney size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                ₹{recordInfo?.monthlyEarnings}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Earning This Month
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 border bg-white border-gray-300 rounded-md shadow-md p-5">
            <div className="bg-blue-600 rounded-md p-3">
              <GiPayMoney size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                ₹{recordInfo?.monthlyDue}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Amount Due This Month
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 border bg-white border-gray-300 rounded-md shadow-md p-5">
            <div className="bg-violet-600 rounded-md p-3">
              <FaBed size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontWeight: "500" }}
                className="text-base sm:text-lg"
              >
                {recordInfo?.monthlyPatients}
              </span>
              <span className="text-sm sm:text-base text-muted-foreground">
                Patients This Month
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 md:w-[390px] border border-gray-300 hover:ring-1 hover:ring-gray-100 px-3 rounded-md">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by patient name, mobile number, barcode, doctor name, lab name"
                className="w-full py-[9px] border-none outline-none text-sm"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
              />
            </div>
            <div className="flex items-center gap-3 mr-4">
              <input
                type="date"
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStartDate(e.target.value)
                }
                className="border border-gray-300 px-2 py-2 rounded-md text-sm"
              />
              <span className="text-sm">To</span>
              <input
                type="date"
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEndDate(e.target.value)
                }
                className="border border-gray-300 px-2 py-2 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CreateRecord fetchAllRecords={fetchAllRecords} />
            <UploadRecord fetchAllRecords={fetchAllRecords} />
            <ExportRecords patients={patientRecords} />
            <Select
              value={sortTime}
              onValueChange={(value) => setSortTime(value)}
            >
              <SelectTrigger className="outline-none w-[130px]">
                <SelectValue placeholder="Sort by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3-months">Last 3 months</SelectItem>
                <SelectItem value="6-months">Last 6 months</SelectItem>
                <SelectItem value="1-year">Last 1 year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAllRecords} variant="outline">
              Apply
            </Button>
          </div>
        </div>
        <div className="space-y-2 bg-white">
          <Table className="border border-gray-300/80">
            <TableHeader className="bg-primary-foreground ">
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Doctor Name</TableHead>
                <TableHead>Lab Name</TableHead>
                <TableHead>Lab No.</TableHead>

                <TableHead>Patient Visit Date</TableHead>
                <TableHead>Collected By</TableHead>
                <TableHead>Export</TableHead>
                {user && user.role === "admin" ? (
                  <TableHead>Action</TableHead>
                ) : (
                  ""
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientRecords?.map((patient) => {
                return patient.tests.map((test) => {
                  const DATE = moment(test?.DATE).format("DD-MM-YYYY");
                  return (
                    <TableRow key={test?._id}>
                      <TableCell className="font-medium">
                        {patient?.PName}
                      </TableCell>
                      <TableCell
                        className="font-medium"
                        style={{ color: "#00004d" }}
                      >
                        {patient?.mobileNumber}
                      </TableCell>
                      <TableCell>{patient?.age}</TableCell>
                      <TableCell>{patient?.gender}</TableCell>
                      <TableCell
                        className="font-medium"
                        style={{ color: "#0BDA51" }}
                      >
                        <a
                          style={{
                            backgroundColor: "#EBFFE5",
                            padding: "3px 8px 3px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          ₹ {test?.amountPaid}
                        </a>
                      </TableCell>
                      <TableCell
                        className="font-medium"
                        style={{ color: "#FF0000" }}
                      >
                        <a
                          style={{
                            backgroundColor: "#fee3e2",
                            padding: "3px 8px 3px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          ₹ {test?.amountDue}
                        </a>
                      </TableCell>
                      <TableCell>{test?.ItemName.join(", ")}</TableCell>
                      <TableCell className="font-medium">
                        {patient?.doctorname}
                      </TableCell>
                      <TableCell>{test?.PanelName}</TableCell>
                      <TableCell
                        className="font-medium"
                        style={{ color: "#900c3F" }}
                      >
                        <a
                          style={{
                            backgroundColor: "#fce4ed",
                            padding: "3px 8px 3px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {test?.LabNo}
                        </a>
                      </TableCell>
                      <TableCell>{DATE}</TableCell>
                      <TableCell
                        className="font-medium"
                        style={{ color: "#FF8243" }}
                      >
                        <a>{test?.collectedBy}</a>
                      </TableCell>
                      <TableCell>
                        <Button
                          size={"icon"}
                          variant={"outline"}
                          onClick={() =>
                            exportPatientRecordToPDF(patient, test)
                          }
                        >
                          <ArrowRightFromLine size={18} />
                        </Button>
                      </TableCell>
                      {user && user.role === "admin" ? (
                        <TableCell className="flex items-center gap-3">
                          <EditRecord
                            patientRecord={patient}
                            fetchAllRecords={fetchAllRecords}
                          />
                          <button
                            onClick={() => handleDeleteRecord(test?._id)}
                            className="text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </TableCell>
                      ) : (
                        ""
                      )}
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          </Table>

          {/* Pagination buttons */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {patientRecords?.length} of {recordInfo?.totalRecords}{" "}
              results at page {recordInfo?.currentPage}
            </span>
            <div className="flex items-center gap-4">
              <Button
                disabled={page === 1}
                onClick={handlePrevPage}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                disabled={page === maxPage}
                onClick={handleNextPage}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <h1>
              Designed and Developed with ❤️ by{" "}
              <span>
                <a
                  className="font-medium"
                  style={{ color: "#00004d", textDecoration: "underline" }}
                  href="https://wavemedia.co.in/"
                >
                  {" "}
                  Wave Media
                </a>{" "}
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
