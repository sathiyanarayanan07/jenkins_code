// import axios from "axios";
// import { useEffect, useState } from "react";

// function Documents({ onSuccess }) {
//   const [document, setDocument] = useState("");
//   const [materials, setMaterials] = useState(false);
//   const [uploadvideo, setUploadVideo] = useState(false);
//   const [content, setContent] = useState(false);
//   const [text, setText] = useState("");
//   const [value, setValue] = useState("");
//   const [course, setCourse] = useState([]);
//   const [chapterName, setChapterName] = useState("");
//   const [video, setVideo] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const username = "admin";
//   const password = "admin@123";
//   const token = btoa(`${username}:${password}`);

//   useEffect(() => {
//     axios
//       .get(import.meta.env.VITE_Course_name, {
//         headers: { Authorization: `Basic ${token}` },
//       })
//       .then((res) => setCourse(res.data));
//   }, []);

//   const handleUpload = async (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setIsUploading(true);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", type === "video" ? "Scopik" : "Scopik-documents");
//     formData.append("cloud_name", "dm8wceqw2");

//     const endpoint =
//       type === "video"
//         ? "https://api.cloudinary.com/v1_1/dm8wceqw2/video/upload"
//         : "https://api.cloudinary.com/v1_1/dm8wceqw2/auto/upload";

//     try {
//       const res = await fetch(endpoint, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       type === "video" ? setVideo(data.url) : setDocument(data.url);
//     } catch (err) {
//       console.error("Cloudinary upload failed", err);
//       showModal("Upload failed. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       if (materials && document) {
//         await axios.post(import.meta.env.VITE_Document, {
//           document,
//           document_name: text,
//           chapter_name: chapterName,
//         });
//       } else if (uploadvideo && video) {
//         await axios.post(import.meta.env.VITE_VIDEO, {
//           video,
//           video_name: text,
//           chapter_name: chapterName,
//         });
//       } else if (content && value) {
//         await axios.post(import.meta.env.VITE_TEXT, {
//           text_content: value,
//           chapter_name: chapterName,
//         });
//       }

//       showModal("✅ Resources added successfully!");
//     } catch (err) {
//       console.error("Upload failed:", err);
//       showModal("❌ Upload failed. Please try again.");
//     }
//   };

//   const showModal = (message) => {
//     setModalMessage(message);
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     if (modalMessage.includes("successfully")) {
//       if (onSuccess) onSuccess(); // Unlock next step
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
//       {/* Success/Error Modal */}
//       {modalVisible && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center space-y-4">
//             <h2 className="text-2xl font-bold text-green-600">{modalMessage.includes("✅") ? "Success" : "Error"}</h2>
//             <p className="text-gray-700">{modalMessage}</p>
//             <button
//               onClick={closeModal}
//               className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}

//       <h1 className="text-3xl font-bold text-[#084D90] mb-4">Add Chapter Resources</h1>
//       <p className="text-gray-600 mb-6">Fill out the form below to upload your documents, videos, or text content.</p>

//       <div className="space-y-5">
//         {/* Chapter Dropdown */}
//         <div className="flex flex-col">
//           <label className="text-gray-800 font-medium mb-1">Select Chapter</label>
//           <select
//             value={chapterName}
//             onChange={(e) => setChapterName(e.target.value)}
//             className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">-- Choose a Chapter --</option>
//             {course.flatMap((courseItem) =>
//               courseItem.chapters?.map((ch) => (
//                 <option key={ch.id} value={ch.title}>
//                   {ch.title}
//                 </option>
//               ))
//             )}
//           </select>
//         </div>

//         {/* Content Name */}
//         <div className="flex flex-col">
//           <label className="text-gray-800 font-medium mb-1">Content Name</label>
//           <input
//             type="text"
//             placeholder="Enter content name"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Content Type */}
//         <div className="flex flex-col">
//           <label className="text-gray-800 font-medium mb-1">Content Type</label>
//           <div className="flex flex-wrap gap-5">
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={materials}
//                 onChange={(e) => setMaterials(e.target.checked)}
//               />
//               <span>Document</span>
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={uploadvideo}
//                 onChange={(e) => setUploadVideo(e.target.checked)}
//               />
//               <span>Video</span>
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={content}
//                 onChange={(e) => setContent(e.target.checked)}
//               />
//               <span>Text</span>
//             </label>
//           </div>
//         </div>

//         {/* Upload Document */}
//         {materials && (
//           <div className="flex flex-col">
//             <label className="text-gray-800 font-medium mb-1">Upload Document (PDF/DOCX/PPT)</label>
//             <input
//               type="file"
//               accept=".pdf,.docx,.ppt"
//               onChange={(e) => handleUpload(e, "document")}
//               className="p-3 border border-gray-300 rounded-lg"
//             />
//           </div>
//         )}

//         {/* Upload Video */}
//         {uploadvideo && (
//           <div className="flex flex-col">
//             <label className="text-gray-800 font-medium mb-1">Upload Video (MP4)</label>
//             <input
//               type="file"
//               accept="video/mp4"
//               onChange={(e) => handleUpload(e, "video")}
//               className="p-3 border border-gray-300 rounded-lg"
//             />
//           </div>
//         )}

//         {/* Text Content */}
//         {content && (
//           <div className="flex flex-col">
//             <label className="text-gray-800 font-medium mb-1">Text Content</label>
//             <textarea
//               placeholder="Enter your text content here..."
//               value={value}
//               onChange={(e) => setValue(e.target.value)}
//               rows={5}
//               className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         )}

//         {/* Uploading Loader */}
//         {isUploading && (
//           <div className="text-blue-600 font-medium">Uploading Please Wait...</div>
//         )}

//         {/* Save Button */}
//         {!isUploading && (
//           <div className="flex justify-end">
//             <button
//               onClick={handleSave}
//               className="px-6 py-3 bg-[#084D90] text-white rounded-lg hover:bg-blue-800 transition font-medium"
//             >
//               Save Resource
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Documents;



import axios from "axios";
import { useEffect, useState } from "react";

function Documents({ onSuccess }) {
  const [resourceType, setResourceType] = useState("video"); // DEFAULT VIDEO
  const [documentUrl, setDocumentUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [textValue, setTextValue] = useState("");
  const [contentName, setContentName] = useState(""); // VIDEO NAME / DOCUMENT NAME / TEXT NAME
  const [description, setDescription] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [courses, setCourses] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const username = "admin";
  const password = "admin@123";
  const token = btoa(`${username}:${password}`);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/course/`, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch(() => showModal("Error loading course data"));
  }, []);

  // UPLOAD FILE
  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      type === "video" ? "Scopik" : "Scopik-documents"
    );
    formData.append("cloud_name", "dm8wceqw2");

    const endpoint =
      type === "video"
        ? "https://api.cloudinary.com/v1_1/dm8wceqw2/video/upload"
        : "https://api.cloudinary.com/v1_1/dm8wceqw2/auto/upload";

    try {
      const res = await fetch(endpoint, { method: "POST", body: formData });
      const data = await res.json();

      if (type === "video") setVideoUrl(data.url);
      else setDocumentUrl(data.url);

      showModal("File uploaded successfully!");
    } catch (err) {
      showModal("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetFields = () => {
    setContentName("");
    setVideoUrl("");
    setDocumentUrl("");
    setTextValue("");
    setDescription("");
    setChapterName("");
  };


  // SAVE RESOURCE
  const handleSave = async () => {
    if (!chapterName) return showModal("Select a chapter.");
    if (!contentName) return showModal("Enter content name.");

    if (resourceType === "video" && !videoUrl)
      return showModal("Please upload a video first.");

    if (resourceType === "document" && !documentUrl)
      return showModal("Please upload a document first.");

    if (resourceType === "text" && !textValue)
      return showModal("Please enter text content.");

    try {
      if (resourceType === "video") {
        await axios.post(`${baseUrl}/api/createvideo/`, {
          video_name: contentName,
          video: videoUrl,
          chapter_name: chapterName,
          description,
        });
      }

      if (resourceType === "document") {
        await axios.post(`${baseUrl}/api/createdocument/`, {
          document_name: contentName,
          document: documentUrl,
          chapter_name: chapterName,
        });
      }

      if (resourceType === "text") {
        await axios.post(`${baseUrl}/api/createtext/`, {
          text_content: textValue,
          chapter_name: chapterName,
        });
      }

      showModal("Resources added successfully!");
      resetFields();
    } catch (err) {
      showModal("Upload failed. Please try again.");
    }
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    if (modalMessage.includes("success") && onSuccess) onSuccess();
  };

  return (
    <div className="mx-auto p-6 border border-orange-200 rounded-xl shadow space-y-6">

      {/* MODAL */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-lg w-[90%] max-w-md text-center space-y-4">
            <h2 className="text-2xl font-bold text-orange-700">
              {modalMessage.includes("success") ? "Success" : "Info"}
            </h2>
            <p className="text-gray-700">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-orange-700">Add Chapter Resources</h1>

      {/* CHAPTER */}
      <div>
        <label className="font-medium text-orange-700">Select Chapter</label>
        <select
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          className="p-3 border border-orange-300 rounded-lg w-full focus:ring-2 focus:ring-orange-400"
        >
          <option value="">-- Choose a Chapter --</option>
          {courses.flatMap((course) =>
            course.chapters?.map((ch) => (
              <option key={ch.id} value={ch.title}>
                {ch.title}
              </option>
            ))
          )}
        </select>
      </div>

      {/* ----------------------------- */}
      {/* 🔥 CONTENT TYPE (TOP SECTION) */}
      {/* ----------------------------- */}
      <div>
        <label className="font-medium text-orange-700">Content Type</label>
        <div className="flex gap-4 mt-2">
          {["video", "document", "text"].map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full hover:bg-orange-200 cursor-pointer transition"
            >
              <input
                type="radio"
                checked={resourceType === type}
                onChange={() => setResourceType(type)}
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ----------------------------- */}
      {/* 🔥 DO NOT SHOW ANYTHING BELOW UNTIL TYPE SELECTED */}
      {/* ----------------------------- */}

      {resourceType && (
        <>
          {/* CONTENT NAME */}
          <div>
            <label className="font-medium text-orange-700">
              {resourceType === "video" ? "Video Name" : "Content Name"}
            </label>
            <input
              type="text"
              value={contentName}
              onChange={(e) => setContentName(e.target.value)}
              className="p-3 border border-orange-300 rounded-lg w-full focus:ring-2 focus:ring-orange-400"
              placeholder="Enter name"
            />
          </div>

          {/* ----------------------------- */}
          {/* 🔥 VIDEO FIELDS */}
          {/* ----------------------------- */}
          {resourceType === "video" && (
            <>
              <div>
                <label className="font-medium text-orange-700">Upload Video</label>
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={(e) => handleUpload(e, "video")}
                  className="p-3 border border-orange-300 rounded-lg w-full"
                />
              </div>

              <div>
                <label className="font-medium text-orange-700">Video Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-3 border border-orange-300 rounded-lg w-full focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter a short description..."
                />
              </div>
            </>
          )}

          {/* ----------------------------- */}
          {/* 🔥 DOCUMENT FIELDS */}
          {/* ----------------------------- */}
          {resourceType === "document" && (
            <div>
              <label className="font-medium text-orange-700">Upload Document</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt"
                onChange={(e) => handleUpload(e, "document")}
                className="p-3 border border-orange-300 rounded-lg w-full"
              />
            </div>
          )}

          {/* ----------------------------- */}
          {/* 🔥 TEXT FIELDS */}
          {/* ----------------------------- */}
          {resourceType === "text" && (
            <div>
              <label className="font-medium text-orange-700">Text Content</label>
              <textarea
                rows={4}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                className="p-3 border border-orange-300 rounded-lg w-full focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          {/* LOADING */}
          {isUploading && (
            <p className="text-orange-700 font-medium">
              Uploading... Please wait
            </p>
          )}

          {/* SAVE BUTTON */}
          {!isUploading && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
              >
                Save Resource
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Documents;
