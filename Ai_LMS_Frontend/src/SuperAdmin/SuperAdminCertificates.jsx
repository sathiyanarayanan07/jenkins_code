// import { useState, useEffect } from "react";
// import axios from "axios";

// function SuperAdminCertificates() {
//   const [file, setFile] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [isDefault, setIsDefault] = useState(false);
//   const [templates, setTemplates] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const [editModal, setEditModal] = useState(false);
//   const [editingTemplate, setEditingTemplate] = useState(null);
//   const [editCourse, setEditCourse] = useState("");
//   const [editFile, setEditFile] = useState(null);
//   const [editDefault, setEditDefault] = useState(false);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [templateToDelete, setTemplateToDelete] = useState(null);

//   const token = btoa(`admin:admin@123`);

//   useEffect(() => {
//     fetchCourses();
//     fetchTemplates();
//   }, []);

//   const fetchCourses = () => {
//     axios
//       .get(import.meta.env.VITE_Course_name, {
//         headers: { Authorization: `Basic ${token}` },
//       })
//       .then((res) => setCourses(res.data))
//       .catch((err) => console.error("Error fetching courses:", err));
//   };

//   const fetchTemplates = () => {
//     axios
//       .get(import.meta.env.VITE_View_Certificate_Template, {
//         headers: { Authorization: `Basic ${token}` },
//       })
//       .then((res) => setTemplates(res.data))
//       .catch((err) => console.error("Error fetching templates:", err));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!file || !selectedCourse) {
//       setModalMessage("Please select a course and upload a template image.");
//       setShowModal(true);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("course", selectedCourse);
//     formData.append("default", isDefault);

//     axios
//       .post(import.meta.env.VITE_Create_Certificate_Template, formData, {
//         headers: { Authorization: `Basic ${token}` },
//       })
//       .then(() => {
//         setModalMessage("Template uploaded successfully ✅");
//         setShowModal(true);
//         fetchTemplates();
//         resetForm();
//       })
//       .catch(() => {
//         setModalMessage("Failed to upload template ❌");
//         setShowModal(true);
//       });
//   };

//   const resetForm = () => {
//     setFile(null);
//     setSelectedCourse("");
//     setIsDefault(false);
//   };

//   const handleEditSubmit = () => {
//     if (!editCourse || !editingTemplate?.id) return;

//     const formData = new FormData();
//     formData.append("default", editDefault ? "true" : "false");
//     if (editFile) {
//       formData.append("file", editFile);
//     }

//     axios
//       .put(
//         `https://lmsdemo.thirdvizion.com/api/certificatetemplateupdate/?course=${encodeURIComponent(
//           editCourse
//         )}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Basic ${token}`,
//           },
//         }
//       )
//       .then(() => {
//         setModalMessage("Template updated successfully ✅");
//         setShowModal(true);
//         fetchTemplates();
//         setEditModal(false);
//         setEditingTemplate(null);
//       })
//       .catch(() => {
//         setModalMessage("Failed to update template ❌");
//         setShowModal(true);
//       });
//   };

//   const handleDeleteTemplate = () => {
//     if (!templateToDelete?.course) return;

//     axios
//       .delete(
//         `https://lmsdemo.thirdvizion.com/api/certificatetemplatedelete/?course=${encodeURIComponent(
//           templateToDelete.course
//         )}`,
//         {
//           headers: {
//             Authorization: `Basic ${token}`,
//           },
//         }
//       )
//       .then(() => {
//         setModalMessage("Template deleted successfully ✅");
//         setShowModal(true);
//         setShowDeleteModal(false);
//         fetchTemplates();
//       })
//       .catch(() => {
//         setModalMessage("Failed to delete template ❌");
//         setShowModal(true);
//         setShowDeleteModal(false);
//       });
//   };

//   return (
//     <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md max-w-screen-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
//         Certificate Templates
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-4 mb-8">
//         <div>
//           <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
//             Select Course
//           </label>
//           <select
//             value={selectedCourse}
//             onChange={(e) => setSelectedCourse(e.target.value)}
//             className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//           >
//             <option value="">Select a course</option>
//             {courses.map((c) => (
//               <option key={c.id} value={c.name}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
//             Upload Template Image
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//           />
//         </div>

//         <div className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             checked={isDefault}
//             onChange={(e) => setIsDefault(e.target.checked)}
//             className="accent-blue-600"
//           />
//           <label className="text-gray-800 dark:text-gray-200">
//             Set as Default Template
//           </label>
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Upload Template
//         </button>
//       </form>

//       <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
//         Existing Templates
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {templates.length > 0 ? (
//           templates.map((temp, index) => (
//             <div
//               key={index}
//               className="relative flex flex-col justify-between border rounded-lg p-4 shadow bg-white dark:bg-gray-700"
//             >
//               <div className="">
//                 <img
//                   src={temp.file}
//                   alt="Template"
//                   className="w-full h-52 object-fit rounded"
//                 />
//                 <p className="mt-2 text-gray-700 dark:text-gray-200 font-medium">
//                   Course Name : {temp.course || "N/A"}
//                 </p>
//                 {temp.is_default && (
//                   <p className="text-green-600 border bg-white rounded-lg px-3 py-0.5 absolute top-0 left-0 font-bold">
//                     Default
//                   </p>
//                 )}
//               </div>
//               <div className="flex gap-5">
//                 <button
//                   onClick={() => {
//                     setEditingTemplate(temp);
//                     setEditCourse(temp.course || "");
//                     setEditDefault(!!temp.is_default);
//                     setEditFile(null); // Reset file input
//                     setEditModal(true);
//                   }}
//                   className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => {
//                     setTemplateToDelete(temp);
//                     setShowDeleteModal(true);
//                   }}
//                   className="mt-2 w-full bg-red-600 text-white px-4 py-2 rounded transition hover:bg-red-700"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-700 dark:text-gray-300">
//             No templates found.
//           </p>
//         )}
//       </div>

//       {/* Upload/Success Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
//               Notification
//             </h3>
//             <p className="mb-4 text-gray-700 dark:text-gray-300">
//               {modalMessage}
//             </p>
//             <button
//               onClick={() => setShowModal(false)}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {showDeleteModal && templateToDelete && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
//               Confirm Deletion
//             </h3>
//             <p className="text-gray-700 dark:text-gray-300 mb-4">
//               Are you sure you want to delete the certificate template for "
//               <span className="font-semibold">{templateToDelete.course}</span>"?
//             </p>

//             <div className="flex gap-4 justify-end mt-4">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteTemplate}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editModal && editingTemplate && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
//               Edit Certificate Template
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
//                   Course
//                 </label>
//                 <select
//                   value={editCourse}
//                   onChange={(e) => setEditCourse(e.target.value)}
//                   className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 >
//                   {courses.map((c) => (
//                     <option key={c.id} value={c.name}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
//                   Upload New Image (Optional)
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setEditFile(e.target.files[0])}
//                   className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={editDefault}
//                   onChange={(e) => setEditDefault(e.target.checked)}
//                   className="accent-blue-600"
//                 />
//                 <label className="text-gray-800 dark:text-gray-200">
//                   Set as Default Template
//                 </label>
//               </div>

//               <div className="flex gap-4 justify-end mt-4">
//                 <button
//                   onClick={() => setEditModal(false)}
//                   className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleEditSubmit}
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SuperAdminCertificates;




import { useState, useEffect } from "react";
import axios from "axios";

function SuperAdminCertificates() {
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [templates, setTemplates] = useState([]);

  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Notification Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Edit Modal
  const [editModal, setEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editCourse, setEditCourse] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editDefault, setEditDefault] = useState(false);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  const token = btoa(`admin:admin@123`);

  useEffect(() => {
    fetchCourses();
    fetchTemplates();
  }, []);

  const fetchCourses = () => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCourses(res.data));
  };

  const fetchTemplates = () => {
    axios
      .get(import.meta.env.VITE_View_Certificate_Template, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setTemplates(res.data));
  };

  const handleAddTemplate = (e) => {
    e.preventDefault();

    if (!file || !selectedCourse) {
      setModalMessage("Please select a course and upload a template image.");
      setShowModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("course", selectedCourse);
    formData.append("default", isDefault);

    axios
      .post(import.meta.env.VITE_Create_Certificate_Template, formData, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then(() => {
        setModalMessage("Template uploaded successfully!");
        setShowModal(true);
        resetForm();
        fetchTemplates();
        setShowAddModal(false);
      })
      .catch(() => {
        setModalMessage("Upload failed!");
        setShowModal(true);
      });
  };

  const resetForm = () => {
    setFile(null);
    setSelectedCourse("");
    setIsDefault(false);
  };

  const handleEditSubmit = () => {
    if (!editCourse || !editingTemplate?.id) return;

    const formData = new FormData();
    formData.append("default", editDefault ? "true" : "false");
    if (editFile) formData.append("file", editFile);

    axios
      .put(
        `https://lmsdemo.thirdvizion.com/api/certificatetemplateupdate/?course=${encodeURIComponent(
          editCourse
        )}`,
        formData,
        { headers: { Authorization: `Basic ${token}` } }
      )
      .then(() => {
        setModalMessage("Template updated successfully!");
        setShowModal(true);
        fetchTemplates();
        setEditModal(false);
      })
      .catch(() => {
        setModalMessage("Update failed!");
        setShowModal(true);
      });
  };

  const handleDeleteTemplate = () => {
    if (!templateToDelete?.course) return;

    axios
      .delete(
        `https://lmsdemo.thirdvizion.com/api/certificatetemplatedelete/?course=${encodeURIComponent(
          templateToDelete.course
        )}`,
        { headers: { Authorization: `Basic ${token}` } }
      )
      .then(() => {
        setModalMessage("Template deleted successfully!");
        setShowModal(true);
        fetchTemplates();
        setShowDeleteModal(false);
      })
      .catch(() => {
        setModalMessage("Delete failed!");
        setShowModal(true);
        setShowDeleteModal(false);
      });
  };

  return (
    <div className="p-6 bg-orange-50 rounded-xl shadow-inner max-w-screen-xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-orange-800">Certificate Templates</h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 text-white px-5 py-2 rounded-lg shadow hover:bg-orange-700 transition"
        >
          + Add Template
        </button>
      </div>

      {/* ------------------ CERTIFICATE LIST - MEDIA STYLE ------------------ */}
      <div className="space-y-4">
        {templates.length > 0 ? (
          templates.map((temp, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center sm:items-center justify-between bg-white rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition p-4 gap-4"
            >
              {/* Left Image */}
              <div className="w-full sm:w-48 h-28 flex-shrink-0">
                <img
                  src={temp.file}
                  alt="Certificate Template"
                  className="w-full h-full object-cover rounded-lg border border-orange-100"
                />
              </div>

              {/* Center Details */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-semibold text-orange-800">
                  {temp.course}
                </h2>

                {temp.is_default && (
                  <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Default Template
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  onClick={() => {
                    setEditingTemplate(temp);
                    setEditCourse(temp.course || "");
                    setEditDefault(!!temp.is_default);
                    setEditFile(null);
                    setEditModal(true);
                  }}
                  className="px-4 py-2 border border-orange-600 text-orange-700 rounded-lg hover:bg-orange-100 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setTemplateToDelete(temp);
                    setShowDeleteModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-orange-700">No templates found.</p>
        )}
      </div>

      {/* -------------------- ADD TEMPLATE MODAL -------------------- */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h2 className="text-xl font-semibold text-orange-800 mb-4">
            Add Certificate Template
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleAddTemplate}>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border p-2 rounded bg-white border-orange-300 focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 rounded bg-white border-orange-300"
            />

            <label className="flex items-center gap-2 text-orange-800">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="accent-orange-600"
              />
              Set as Default Template
            </label>

            <button
              type="submit"
              className="bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Upload Template
            </button>
          </form>
        </Modal>
      )}

      {/* -------------------- EDIT TEMPLATE MODAL -------------------- */}
      {editModal && editingTemplate && (
        <Modal onClose={() => setEditModal(false)}>
          <h2 className="text-xl font-semibold text-orange-800 mb-4">
            Edit Certificate Template
          </h2>

          <div className="flex flex-col gap-4">

            <select
              value={editCourse}
              onChange={(e) => setEditCourse(e.target.value)}
              className="border p-2 rounded bg-white border-orange-300"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditFile(e.target.files[0])}
              className="border p-2 rounded bg-white border-orange-300"
            />

            <label className="flex items-center gap-2 text-orange-800">
              <input
                type="checkbox"
                checked={editDefault}
                onChange={(e) => setEditDefault(e.target.checked)}
                className="accent-orange-600"
              />
              Set as Default Template
            </label>

            <button
              onClick={handleEditSubmit}
              className="bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* -------------------- DELETE CONFIRM MODAL -------------------- */}
      {showDeleteModal && templateToDelete && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h2 className="text-xl font-semibold text-red-700">Confirm Delete</h2>
          <p className="mt-2 text-orange-800">
            Delete certificate template for{" "}
            <b>{templateToDelete.course}</b>?
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteTemplate}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* -------------------- NOTIFICATION MODAL -------------------- */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-semibold text-orange-800 mb-3">
            Notice
          </h2>
          <p className="text-orange-700 mb-4">{modalMessage}</p>
          <button
            onClick={() => setShowModal(false)}
            className="bg-orange-600 text-white py-2 rounded-lg w-full"
          >
            OK
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------ REUSABLE MODAL ------------------------ */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white border border-orange-200 rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-orange-700 hover:text-red-600 text-2xl font-bold"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}

export default SuperAdminCertificates;
