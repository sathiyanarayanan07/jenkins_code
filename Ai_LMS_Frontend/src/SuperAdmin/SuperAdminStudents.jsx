import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { FaUserCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function SuperAdminStudents() {
  // search + UI
  const [search, setSearch] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  // students data
  const [student, setStudent] = useState([]);

  // upload states
  const [uploadType, setUploadType] = useState(null);
  const [bulkUsers, setBulkUsers] = useState([]);
  const [sub, setSub] = useState(false);

  // single user form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [registerNo, setRegisterNo] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [academic, setAcademic] = useState("");
  const [user_type] = useState("student");

  // UI tabs & filters
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // bulk selection
  const [selectedStudentEmails, setSelectedStudentEmails] = useState([]);

  // modals + notifications
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState(null);

  // detailed student modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  // progress
  const [studentProgress, setStudentProgress] = useState(null);
  const [progressData, setProgressData] = useState({});

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // small style helper retained
  const inputStyle = "p-2 border border-orange-300 rounded outline-none bg-white focus:ring-2 focus:ring-orange-500";

  /* ----------------------- Initial data fetch ----------------------- */
  useEffect(() => {
    fetchStudents();
  }, []);

  // When the selected student changes, fetch chapter progress for each enrolled course
  useEffect(() => {
    if (!selectedStudent) return;
    if (Array.isArray(selectedStudent.courses) && selectedStudent.courses.length) {
      setStudentProgress(selectedStudent);
      selectedStudent.courses.forEach((course) => {
        fetchChapterProgress(course.course_name, selectedStudent.email);
      });
    } else {
      setStudentProgress(selectedStudent);
      setProgressData({});
    }
  }, [selectedStudent]);

  const fetchStudents = () => {
    axios
      .get(`${baseUrl}/api/studentdetails/`)
      .then((res) => {
        setStudent(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Error fetching students:", err));
  };

  /* ----------------------- Progress fetch ----------------------- */
  const fetchChapterProgress = (courseName, email) => {
    axios
      .get(`${baseUrl}/api/chapterstatusview`, {
        params: { email, course: courseName },
      })
      .then((res) => {
        const completed = res.data?.chapters?.length || 0;
        const total = res.data?.total || 0;
        setProgressData((prev) => ({ ...prev, [courseName]: { completed, total } }));
      })
      .catch((err) => {
        console.error(`Error fetching progress for ${courseName}:`, err);
      });
  };

  /* ----------------------- Filtering & tabs ----------------------- */
  const filteredStudents = student.filter((s) => {
    const nameMatch = (s.name || "").toLowerCase().includes(search.toLowerCase());
    const year = s.academicYear ?? s.academic_year ?? s.academicYear;
    const yearMatch = filterYear ? String(year) === filterYear : true;

    if (activeTab === "all") return nameMatch && yearMatch;

    if (activeTab === "university" && selectedUniversity) {
      return (
        nameMatch &&
        yearMatch &&
        s.university &&
        s.university.toLowerCase() === selectedUniversity.toLowerCase()
      );
    }

    if (activeTab === "common students") {
      return (
        nameMatch &&
        yearMatch &&
        s.university &&
        s.university.toLowerCase().includes("scopik")
      );
    }

    return false;
  });

  /* ----------------------- Bulk Excel parsing ----------------------- */
  const bulkFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = function (evt) {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Header false mapping: original code used header: "A" which returns keyed by column letters
      const detail = XLSX.utils.sheet_to_json(worksheet, { header: "A" });

      const studentDetails = detail
        .filter(
          (item) =>
            item.B && item.C && item.D && item.E && item.F && item.G && item.H && typeof item.A === "number"
        )
        .map((item) => ({
          name: item.C,
          email: item.D,
          phone: String(item.G || ""),
          registerno: item.B,
          university: item.E,
          academicYear: item.F,
          department: item.H,
          user_type: "student",
        }));

      setBulkUsers(studentDetails);
      setSub(true);
    };

    reader.readAsArrayBuffer(file);
  };

  const submitBulkUsers = async () => {
    if (!bulkUsers.length) {
      openModal("No data to upload.", <AlertTriangle className="text-yellow-500" size={40} />);
      return;
    }
    try {
      await axios.post(`${baseUrl}/api/bulkupload/`, { users: bulkUsers });
      openModal("Bulk registration successful!", <CheckCircle className="text-green-500" size={40} />);
      fetchStudents();
      setBulkUsers([]);
      setSub(false);
    } catch (error) {
      console.error("Bulk upload error:", error);
      openModal("Error in bulk upload.", <XCircle className="text-red-500" size={40} />);
    }
  };

  /* ----------------------- Single user registration ----------------------- */
  const singleUpload = async () => {
    if (!name || !email || !registerNo || !universityName || !academic || !phone) {
      openModal("Please fill all fields.", <AlertTriangle className="text-yellow-500" size={40} />);
      return;
    }

    try {
      await axios.post(`${baseUrl}/api/register/`, {
        name,
        email,
        user_type,
        registerno: registerNo,
        university: universityName,
        academicYear: academic,
        phone,
      });
      openModal("Student registered successfully!", <CheckCircle className="text-green-500" size={40} />);
      fetchStudents();
      resetSingleForm();
    } catch (err) {
      console.error("Single upload error:", err);
      openModal("Failed to register student.", <XCircle className="text-red-500" size={40} />);
    }
  };

  /* ----------------------- Utility modal & reset ----------------------- */
  const openModal = (message, icon) => {
    setModalMessage(message);
    setModalIcon(icon);
    setShowModal(true);
  };

  const resetSingleForm = () => {
    setName("");
    setPhone("");
    setAcademic("");
    setEmail("");
    setRegisterNo("");
    setUniversityName("");
  };

  /* ----------------------- Export CSV ----------------------- */
  const handleExportCSV = () => {
    const studentsToExport =
      selectedStudentEmails.length > 0
        ? filteredStudents.filter((stu) => selectedStudentEmails.includes(stu.email))
        : filteredStudents;

    if (!studentsToExport.length) {
      openModal("No students selected or available to export.", <AlertTriangle className="text-yellow-500" size={40} />);
      return;
    }

    const dataToExport = studentsToExport.map((stu) => ({
      Name: stu.name,
      Email: stu.email,
      Phone: stu.phone_number || stu.phone || "",
      RegisterNo: stu.registerno || stu.registerno,
      University: stu.university,
      AcademicYear: stu.academicYear || stu.academic_year,
      Department: stu.department,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Students");
    XLSX.writeFile(workbook, "selected_students_export.csv", { bookType: "csv" });
  };

  /* ----------------------- Delete selected students ----------------------- */
  const handleSelectedDelete = async () => {
    if (selectedStudentEmails.length === 0) {
      openModal("No students selected to delete.", <AlertTriangle className="text-yellow-500" size={40} />);
      return;
    }

    try {
      const response = await axios.delete(`${baseUrl}/api/studentdelete/`, {
        data: {
          select_all: false,
          selected_name: selectedStudentEmails,
        },
      });

      openModal(response.data?.message || "Selected students deleted successfully.", <CheckCircle className="text-green-500" size={40} />);

      const updatedStudentList = student.filter((stu) => !selectedStudentEmails.includes(stu.email));
      setStudent(updatedStudentList);
      setSelectedStudentEmails([]);
    } catch (err) {
      console.error("Error deleting students:", err?.response?.data || err.message);
      openModal("Failed to delete selected students.", <XCircle className="text-red-500" size={40} />);
    }
  };

  /* ----------------------- Checkbox selection for each student ----------------------- */
  const handleStudentCheckbox = (email) => {
    setSelectedStudentEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  /* ----------------------- renderStudents (keeps your original behavior) ----------------------- */
  const renderStudents = () => {
    if (!Array.isArray(filteredStudents) || filteredStudents.length === 0) {
      return <p className="text-orange-700 text-center mt-6">No students found.</p>;
    }

    return (
      <>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={filteredStudents.length > 0 && selectedStudentEmails.length === filteredStudents.length}
              onChange={(e) => {
                if (e.target.checked) setSelectedStudentEmails(filteredStudents.map((s) => s.email));
                else setSelectedStudentEmails([]);
              }}
              className="h-5 w-5 text-orange-600"
            />
            <label className="text-sm text-orange-700">Select All</label>
            {selectedStudentEmails.length > 0 && (
              <div className="text-sm text-orange-700 ml-4">{selectedStudentEmails.length} student(s) selected</div>
            )}
          </div>

          {selectedStudentEmails.length > 0 && (
            <div className="flex gap-2">
              <button onClick={handleExportCSV} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
                Export CSV
              </button>
              <button onClick={handleSelectedDelete} className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">
                Delete Selected
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {filteredStudents.map((stu, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-b py-2 px-2 bg-orange-50 rounded hover:bg-orange-100 transition"
            >
              <input
                type="checkbox"
                checked={selectedStudentEmails.includes(stu.email)}
                onChange={() => handleStudentCheckbox(stu.email)}
                onClick={(e) => e.stopPropagation()}
                className="h-5 w-5 text-orange-600"
              />

              <div
                className="flex-1 flex flex-col cursor-pointer"
                onClick={() => {
                  setSelectedStudent(stu);
                  setStudentModalOpen(true);
                }}
              >
                <span className="text-base font-medium text-orange-800">
                  {index + 1}. {stu.name}
                </span>
                <span className="text-sm text-orange-700">{stu.email}</span>
                <span className="text-sm text-orange-600">
                  Academic Year: {stu.academicYear ?? stu.academic_year ?? "Not Assigned"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  /* ----------------------- UI ----------------------- */
  return (
    <div className="w-full rounded-xl min-h-[calc(100%-30px)] bg-orange-50 px-4 py-8">
      {/* header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold text-orange-800">STUDENT DETAILS</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setShowUploadOptions((s) => !s);
              setUploadType(null);
            }}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            {showUploadOptions ? "Hide Add Student" : "Add Student"}
          </button>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded border border-orange-300 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* upload options */}
      {showUploadOptions && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-orange-200">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUploadType("single")}
              className={`flex-1 py-2 rounded ${uploadType === "single" ? "bg-orange-600 text-white" : "bg-white border border-orange-200 text-orange-800"}`}
            >
              Single Upload
            </button>
            <button
              onClick={() => setUploadType("bulk")}
              className={`flex-1 py-2 rounded ${uploadType === "bulk" ? "bg-orange-600 text-white" : "bg-white border border-orange-200 text-orange-800"}`}
            >
              Bulk Upload
            </button>
          </div>

          {uploadType === "single" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name" className={inputStyle} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email ID" className={inputStyle} />
              <input type="text" value={academic} onChange={(e) => setAcademic(e.target.value)} placeholder="Academic Year" className={inputStyle} />
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className={inputStyle} />
              <input type="text" value={registerNo} onChange={(e) => setRegisterNo(e.target.value)} placeholder="Register Number" className={inputStyle} />
              <input type="text" value={universityName} onChange={(e) => setUniversityName(e.target.value)} placeholder="University Name" className={inputStyle} />
              <div className="col-span-full">
                <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700" onClick={singleUpload}>Register</button>
              </div>
            </div>
          )}

          {uploadType === "bulk" && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-orange-800">
                Upload Excel with: SrNo, RegisterNo (B), Name (C), Email (D), University (E), AcademicYear (F), Department (H), optional Phone (G)
              </p>
              <input type="file" onChange={bulkFile} className="border border-dashed border-orange-300 p-3 rounded cursor-pointer bg-white" />
              <div className="flex gap-2">
                <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" onClick={submitBulkUsers}>{sub ? "Submit" : "Upload"}</button>
                <div className="flex-1 text-sm text-orange-700 self-center">
                  {bulkUsers.length > 0 ? `${bulkUsers.length} rows ready` : "No file loaded"}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* main list box */}
      <div className="bg-white rounded-lg shadow p-6 border border-orange-200">

        <div className="h-full overflow-y-auto">{renderStudents()}</div>
      </div>

      {/* small notification modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center border border-orange-200">
            <div className="flex justify-center">{modalIcon}</div>
            <p className="mt-3 mb-4 text-orange-800 text-lg">{modalMessage}</p>
            <button onClick={() => setShowModal(false)} className="w-full py-2 rounded bg-orange-600 text-white hover:bg-orange-700 transition">OK</button>
          </div>
        </div>
      )}

      {/* detailed student modal */}
      {studentModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start z-50 pt-8 overflow-y-auto">
          <div className="relative bg-white p-6 w-full max-w-6xl rounded-lg shadow-lg max-h-[90vh] overflow-y-auto border border-orange-200">
            <button onClick={() => setStudentModalOpen(false)} className="absolute top-4 right-6 text-orange-700 hover:text-red-600 text-4xl" title="Close">&times;</button>

            <div className="flex items-center gap-4 mb-6">
              {selectedStudent.profile_image ? (
                <img src={selectedStudent.profile_image} alt="Profile" className="w-20 h-20 rounded-full object-cover border" />
              ) : (
                <FaUserCircle className="w-20 h-20 text-orange-300" />
              )}
              <div>
                <h2 className="text-2xl font-semibold text-orange-800">{selectedStudent.name || "Null"}</h2>
                <p className="text-sm text-orange-700">{selectedStudent.email || "Null"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-orange-800 font-semibold">Phone</label>
                <p className="text-orange-700">{selectedStudent.phone_number || "Null"}</p>
              </div>

              <div>
                <label className="text-orange-800 font-semibold">Register No</label>
                <p className="text-orange-700">{selectedStudent.registerno || "Null"}</p>
              </div>

              <div>
                <label className="text-orange-800 font-semibold">University</label>
                <p className="text-orange-700">{selectedStudent.university || "Null"}</p>
              </div>

              <div>
                <label className="text-orange-800 font-semibold">Department</label>
                <p className="text-orange-700">{selectedStudent.department || "Null"}</p>
              </div>

              <div>
                <label className="text-orange-800 font-semibold">Academic Year</label>
                <p className="text-orange-700">{selectedStudent.academic_year || selectedStudent.academicYear || "Null"}</p>
              </div>
            </div>

            <hr className="my-4 border-orange-100" />

            <h3 className="text-xl font-semibold text-orange-800 mb-3">Enrolled Courses</h3>

            {Array.isArray(selectedStudent.courses) && selectedStudent.courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {selectedStudent.courses.map((course, idx) => {
                  const p = progressData[course.course_name] || { completed: 0, total: 0 };
                  return (
                    <div key={idx} className="border rounded p-4 bg-orange-50 flex items-start gap-4 shadow-sm">
                      <img src={course.course_image} alt={course.course_name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium text-orange-800">{course.course_name}</p>
                        <p className="text-sm text-orange-700">Completed: {course.complated ? "Yes" : "No"}</p>
                        <p className="text-sm text-orange-600 mt-1">Progress: {p.completed} / {p.total}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-orange-700 mb-4">No courses enrolled.</p>
            )}

            <hr className="my-4 border-orange-100" />

            <h3 className="text-xl font-semibold text-orange-800 mb-3">Payments</h3>

            {Array.isArray(selectedStudent.payments) && selectedStudent.payments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedStudent.payments.map((pay, idx) => (
                  <div key={idx} className="border rounded p-4 bg-white shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-orange-800 font-medium">{pay.course_name}</span>
                      {pay.status ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                          <FaCheckCircle className="text-green-600" /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                          <FaTimesCircle className="text-red-600" /> Failed
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-orange-700">Amount: {Number(pay.amount || 0).toLocaleString()}</p>
                    <p className="text-sm text-orange-700">Date: {pay.date ? new Date(pay.date).toLocaleDateString() : "N/A"}</p>
                    <p className="text-sm text-orange-700">Phone: {pay.phone_number || "N/A"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-orange-700">No payment records found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminStudents;
