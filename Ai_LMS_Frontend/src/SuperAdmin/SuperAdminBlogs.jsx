// import axios from "axios";
// import { useState } from "react";

// function SuperAdminBlogs() {
//   const [add, setAdd] = useState(false);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [category, setCategory] = useState("");
//   const [imageUrls, setImageUrls] = useState([]);
//   const [popupMessage, setPopupMessage] = useState("");
//   const [blogs, setBlogs] = useState([]);

//   const fetchBlogs = () => {
//     axios.get(import.meta.env.VITE_BLOG_VIEW).then((res) => {
//       setBlogs(res.data);
//     });
//   };

//   const handleSubmit = () => {
//     if (!title || !category || imageUrls.length === 0) {
//       setPopupMessage("Please fill in all fields and upload at least one image.");
//       return;
//     }

//     axios
//       .post(import.meta.env.VITE_BLOG_UPLOAD, {
//         title,
//         content,
//         category,
//         image_urls: imageUrls,
//       })
//       .then(() => {
//         setPopupMessage("Blog added successfully!");
//         setTitle("");
//         setContent("");
//         setCategory("");
//         setImageUrls([]);
//         setAdd(false);
//         fetchBlogs();
//       })
//       .catch((err) => {
//         console.log("There is an error", err);
//         setPopupMessage("Blog upload failed. Please try again.");
//       });
//   };

//   const handleImageChange = async (e) => {
//     const files = Array.from(e.target.files);
//     const uploadedUrls = [];

//     for (let file of files) {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", "Scopik");

//       try {
//         const response = await fetch(
//           "https://api.cloudinary.com/v1_1/dm8wceqw2/image/upload",
//           {
//             method: "POST",
//             body: formData,
//           }
//         );

//         const data = await response.json();
//         if (data.secure_url) {
//           uploadedUrls.push(data.secure_url);
//         } else {
//           setPopupMessage("One or more image uploads failed.");
//         }
//       } catch (err) {
//         console.error("Image upload error:", err);
//         setPopupMessage("Image upload failed.");
//       }
//     }

//     setImageUrls((prev) => [...prev, ...uploadedUrls]);
//   };

//   const handleDelete = (name) => {
//     axios
//       .delete(`${import.meta.env.VITE_BLOG_DELETE}${name}`)
//       .then(() => {
//         fetchBlogs();
//         setPopupMessage("Blog deleted successfully");
//       })
//       .catch(() => {
//         setPopupMessage("Failed to delete blog");
//       });
//   };

//   const removeImage = (urlToRemove) => {
//     setImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
//   };

//   return (
//     <div className="relative max-w-7xl mx-auto p-6 space-y-10 bg-white rounded-xl shadow">
//       {/* ✅ Popup Modal */}
//       {popupMessage && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               {popupMessage}
//             </h2>
//             <button
//               onClick={() => setPopupMessage("")}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ✅ Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-800">Blogs</h1>
//         <button
//           onClick={() => setAdd(true)}
//           className="bg-green-600 hover:bg-green-700 px-5 py-2 text-white rounded-lg font-medium shadow"
//         >
//           + Add Blog
//         </button>
//       </div>

//       {/* ✅ Blog Form */}
//       {add && (
//         <div className="bg-gray-100 p-6 rounded-lg shadow space-y-6">
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 font-medium mb-1">
//                 Blog Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter blog title"
//                 className="border border-gray-300 rounded-lg p-3 text-gray-800"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 font-medium mb-1">
//                 Category <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter blog category"
//                 className="border border-gray-300 rounded-lg p-3 text-gray-800"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               />
//             </div>

//             <div className="flex flex-col md:col-span-2">
//               <label className="text-sm text-gray-600 font-medium mb-1">
//                 Blog Content <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 rows={5}
//                 placeholder="Write blog content..."
//                 className="border border-gray-300 rounded-lg p-3 text-gray-800"
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//               ></textarea>
//             </div>

//             <div className="flex flex-col md:col-span-2">
//               <label className="text-sm text-gray-600 font-medium mb-1">
//                 Upload Images <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImageChange}
//                 className="cursor-pointer border-2 border-dashed border-gray-400 p-4 rounded-lg"
//               />

//               {/* Show uploaded images */}
//               {imageUrls.length > 0 && (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//                   {imageUrls.map((img, i) => (
//                     <div key={i} className="relative">
//                       <img
//                         src={img}
//                         alt={`Uploaded ${i}`}
//                         className="w-full h-[150px] object-cover rounded-lg border"
//                       />
//                       <button
//                         onClick={() => removeImage(img)}
//                         className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs"
//                       >
//                         X
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               onClick={handleSubmit}
//               className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white rounded-lg font-semibold"
//             >
//               Save Blog
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ✅ Blog Display Section */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Blog Content</h2>

//         <div className="grid md:grid-cols-3 gap-6 h-[400px] overflow-y-scroll pr-2">
//           {blogs.map((blog, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-lg shadow-md border p-4 flex flex-col justify-between"
//             >
//               <img
//                 src={blog.image_urls?.[0]}
//                 alt={blog.title}
//                 className="h-48 w-full object-cover rounded-md mb-4"
//               />
//               <h3 className="text-xl font-bold text-gray-800 mb-2">
//                 {blog.title}
//               </h3>
//               <button
//                 onClick={() => handleDelete(blog.title)}
//                 className="mt-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* ✅ Image Link List */}
//         <div className="mt-10">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">
//             Image Links
//           </h3>
//           <ul className="list-disc list-inside space-y-2 text-blue-700">
//             {blogs.flatMap((blog) =>
//               blog.image_urls?.map((url, i) => (
//                 <li key={`${blog.title}-${i}`}>
//                   <a
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="hover:underline"
//                   >
//                     {url}
//                   </a>
//                 </li>
//               ))
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SuperAdminBlogs;





import axios from "axios";
import { useState, useEffect } from "react";

function SuperAdminBlogs() {
  const [addModal, setAddModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [blogs, setBlogs] = useState([]);

  // Form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    axios.get(import.meta.env.VITE_BLOG_VIEW).then((res) => {
      setBlogs(res.data);
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploaded = [];

    for (let file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "Scopik");

      const upload = await fetch(
        "https://api.cloudinary.com/v1_1/dm8wceqw2/image/upload",
        { method: "POST", body: fd }
      );
      const data = await upload.json();
      if (data.secure_url) uploaded.push(data.secure_url);
    }

    setImageUrls((prev) => [...prev, ...uploaded]);
  };

  const removeImage = (img) => {
    setImageUrls((prev) => prev.filter((i) => i !== img));
  };

  const handleSubmit = () => {
    if (!title || !category || imageUrls.length === 0) {
      setPopupMessage("Please fill in all fields & upload at least one image.");
      return;
    }

    axios
      .post(import.meta.env.VITE_BLOG_UPLOAD, {
        title,
        category,
        content,
        image_urls: imageUrls,
      })
      .then(() => {
        setPopupMessage("Blog added successfully!");
        resetForm();
        setAddModal(false);
        fetchBlogs();
      })
      .catch(() => {
        setPopupMessage("Blog upload failed. Try again.");
      });
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setContent("");
    setImageUrls([]);
  };

  const handleDelete = (title) => {
    axios
      .delete(`${import.meta.env.VITE_BLOG_DELETE}${title}`)
      .then(() => {
        setPopupMessage("Blog deleted.");
        fetchBlogs();
      })
      .catch(() => setPopupMessage("Delete failed."));
  };

  return (
    <div className="p-6 bg-orange-50 rounded-xl shadow-inner max-w-screen-xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-800">Blogs</h1>

        <button
          onClick={() => setAddModal(true)}
          className="bg-orange-600 text-white px-5 py-2 rounded-lg shadow hover:bg-orange-700 transition"
        >
          + Add Blog
        </button>
      </div>

      {/* BLOG LIST — Option 3 Layout */}
      <div className="space-y-4">

        {blogs?.map((blog, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-orange-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
          >
            {/* LEFT — Image */}
            <div className="w-full sm:w-48 h-28 flex-shrink-0">
              <img
                src={blog.image_urls?.[0]}
                alt="blog"
                className="w-full h-full object-cover rounded-lg border border-orange-100"
              />
            </div>

            {/* MIDDLE — Blog Details */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-orange-800">
                {blog.title}
              </h2>
              <p className="text-orange-700 opacity-80 text-sm mt-1">
                {blog.category}
              </p>
            </div>

            {/* RIGHT — Actions */}
            <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={() => handleDelete(blog.title)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- ADD BLOG MODAL ---------------- */}
      {addModal && (
        <Modal onClose={() => setAddModal(false)}>
          <h2 className="text-xl font-semibold text-orange-800 mb-4">
            Add New Blog
          </h2>

          <div className="flex flex-col gap-4">

            <input
              type="text"
              value={title}
              placeholder="Blog Title"
              onChange={(e) => setTitle(e.target.value)}
              className="border border-orange-300 p-2 rounded-md focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="text"
              value={category}
              placeholder="Blog Category"
              onChange={(e) => setCategory(e.target.value)}
              className="border border-orange-300 p-2 rounded-md focus:ring-2 focus:ring-orange-500"
            />

            <textarea
              rows={4}
              value={content}
              placeholder="Blog Content..."
              onChange={(e) => setContent(e.target.value)}
              className="border border-orange-300 p-2 rounded-md focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="border-2 border-dashed border-orange-300 rounded-md p-4 cursor-pointer bg-orange-50 hover:border-orange-500"
            />

            {/* Uploaded images */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageUrls.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="w-full h-28 rounded object-cover border"
                    />
                    <button
                      onClick={() => removeImage(img)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="bg-orange-600 text-white py-2 rounded-lg shadow hover:bg-orange-700 transition"
            >
              Save Blog
            </button>
          </div>
        </Modal>
      )}

      {/* Global popup */}
      {popupMessage && (
        <Modal onClose={() => setPopupMessage("")}>
          <p className="text-orange-800 mb-4 text-lg text-center">{popupMessage}</p>
          <button
            onClick={() => setPopupMessage("")}
            className="bg-orange-600 text-white py-2 w-full rounded-lg hover:bg-orange-700 transition"
          >
            OK
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ----------------------- MODAL COMPONENT ----------------------- */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white border border-orange-200 p-6 rounded-xl shadow-xl w-full max-w-lg relative">
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

export default SuperAdminBlogs;
