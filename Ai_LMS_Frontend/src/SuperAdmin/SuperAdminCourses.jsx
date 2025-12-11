import axios from "axios";
import { useEffect, useState } from "react";

import CourseAddWrapper from "./Course_Add/CourseAddWrapper";

function SuperAdminCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  // Edit Course
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [cardImage, setCardImage] = useState("");
  const [chapter, setChapter] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);

  const [uploadingCardImage, setUploadingCardImage] = useState(false);
  const [uploadingCourseImage, setUploadingCourseImage] = useState(false);

  // Add Course Wizard
  const [addCourse, setAddCourse] = useState(false);

  // Delete Modal
  const [courseToDelete, setCourseToDelete] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = btoa(`admin:admin@123`);

  useEffect(() => {
    fetchCourses();
    axios.get(`${baseUrl}/api/coursecategory/`).then((res) => setCategories(res.data));
  }, [baseUrl]);

  const fetchCourses = () => {
    axios
      .get(`${baseUrl}/api/course/`, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCourses(res.data));
  };

  const handleUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const FD = new FormData();
    FD.append("file", file);
    FD.append("upload_preset", "Scopik");

    if (key === "Image") setUploadingCardImage(true);
    if (key === "BG") setUploadingCourseImage(true);

    try {
      const upload = await fetch("https://api.cloudinary.com/v1_1/dm8wceqw2/image/upload", {
        method: "POST",
        body: FD,
      });

      const result = await upload.json();
      if (key === "Image") setCardImage(result.url);
      else setCourseImage(result.url);
    } finally {
      if (key === "Image") setUploadingCardImage(false);
      if (key === "BG") setUploadingCourseImage(false);
    }
  };

  const editCourse = (course) => {
    setEditingCourse(course);
    setCourseName(course.name);
    setCourseDesc(course.description);
    setCardImage(course.image);
    setChapter(course.total_chap);
    setDuration(course.duration);
    setPrice(course.price);
    setCourseImage(course.background_image);
    setCategory(course.categories || []);
  };

  const handleUpdate = () => {
    const payload = {
      name: courseName,
      description: courseDesc,
      image: cardImage,
      total_chap: chapter,
      duration,
      price,
      background_image: courseImage,
      categories: category,
    };

    axios
      .put(`${baseUrl}/api/updatecourse/${encodeURIComponent(editingCourse.name)}`, payload)
      .then(() => {
        fetchCourses();
        cancelEdit();
      })
      .catch(() => alert("Course update failed!"));
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    setCourseName("");
    setCourseDesc("");
    setCardImage("");
    setChapter("");
    setDuration("");
    setPrice("");
    setCourseImage("");
    setCategory([]);
  };

  const handleDelete = (course) => {
    axios
      .delete(`${baseUrl}/api/deletecourse/${encodeURIComponent(course.name)}`)
      .then(() => {
        setCourseToDelete(null);
        fetchCourses();
      })
      .catch(() => alert("Delete failed"));
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-orange-50 rounded-lg shadow-inner min-h-[calc(100%-30px)]">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-orange-800">Courses</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setAddCourse(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded shadow hover:bg-orange-700"
          >
            Add Course
          </button>

          <input
            type="text"
            placeholder="Search..."
            className="border border-orange-300 rounded-md p-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {addCourse && <CourseAddWrapper onClose={() => setAddCourse(false)} />}

      {/* ------------------------- Edit Modal ------------------------- */}
      {editingCourse && (
        <Modal onClose={cancelEdit}>
          <h2 className="text-xl font-bold text-orange-700 mb-4">
            Edit Course – {editingCourse.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-4">
              {/* Course Name */}
              <div>
                <label className="font-medium text-orange-700">Course Name</label>
                <input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="border p-2 rounded w-full mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-medium text-orange-700">Course Description</label>
                <textarea
                  rows={4}
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  className="border p-2 rounded w-full mt-1"
                />
              </div>

              {/* 3 fields in one row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-medium text-orange-700">Total Chapters</label>
                  <input
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="border p-2 rounded w-full mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-orange-700">Duration (Hrs)</label>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="border p-2 rounded w-full mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-orange-700">Price</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border p-2 rounded w-full mt-1"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="font-medium text-orange-700">Course Categories</label>
                <select
                  className="border p-2 rounded w-full mt-1"
                  value=""
                  onChange={(e) => {
                    if (!category.includes(e.target.value))
                      setCategory([...category, e.target.value]);
                  }}
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2 mt-2">
                  {category.map((cat) => (
                    <span key={cat} className="px-3 py-1 bg-orange-200 rounded-full text-orange-800 text-sm flex items-center">
                      {cat}
                      <button
                        onClick={() => setCategory(category.filter((c) => c !== cat))}
                        className="ml-2 text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Uploads */}
            <div className="space-y-6">
              {/* Card Image */}
              <div>
                <label className="font-medium text-orange-700">Card Image</label>
                <div className="border border-dashed p-2 rounded h-40 flex items-center justify-center bg-orange-50 mt-1 relative">
                  <input
                    type="file"
                    onChange={(e) => handleUpload(e, "Image")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  {uploadingCardImage ? (
                    <p>Uploading...</p>
                  ) : cardImage ? (
                    <img src={cardImage} className="w-full h-full object-cover rounded" />
                  ) : (
                    <p className="text-orange-500">Click to upload</p>
                  )}
                </div>
              </div>

              {/* Background Image */}
              <div>
                <label className="font-medium text-orange-700">Background Image</label>
                <div className="border border-dashed p-2 rounded h-40 flex items-center justify-center bg-orange-50 mt-1 relative">
                  <input
                    type="file"
                    onChange={(e) => handleUpload(e, "BG")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  {uploadingCourseImage ? (
                    <p>Uploading...</p>
                  ) : courseImage ? (
                    <img src={courseImage} className="w-full h-full object-cover rounded" />
                  ) : (
                    <p className="text-orange-500">Click to upload</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save + Cancel */}
          <div className="flex justify-end mt-6 gap-3">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={cancelEdit}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              onClick={handleUpdate}
            >
              Update Course
            </button>
          </div>
        </Modal>
      )}

      {/* ---------------------- Delete Modal ---------------------- */}
      {courseToDelete && (
        <div
          onClick={(e) => e.target === e.currentTarget && setCourseToDelete(null)}
          className="fixed inset-0 z-50 flex items-center justify-center 
               bg-black/50 backdrop-blur-sm animate-fadeIn"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 
                 animate-scaleIn relative text-center"
          >
            {/* Warning Icon */}
            <div className="w-16 h-16 mx-auto flex items-center justify-center 
                      rounded-full bg-red-100 text-red-600 mb-4">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Delete Course
            </h2>

            {/* Message */}
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <b>{courseToDelete.name}</b>?
              <br /> This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">

              <button
                onClick={() => setCourseToDelete(null)}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 
                     hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(courseToDelete)}
                className="px-5 py-2 rounded-lg bg-red-600 text-white 
                     hover:bg-red-700 transition font-medium shadow"
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      )}


      {/* ----------------------- Course List ----------------------- */}
      <div className="space-y-4 mt-6">
        {filteredCourses.map((c) => (
          <div
            key={c.id}
            className="flex flex-col sm:flex-row bg-white rounded-xl border p-4 gap-4 shadow"
          >
            {/* Image */}
            <img
              src={c.image}
              className="w-full sm:w-48 h-32 object-cover rounded border"
            />

            {/* Details */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-orange-800">{c.name}</h2>
              <p className="text-orange-700 mt-1 line-clamp-2">{c.description}</p>

              <div className="flex flex-wrap mt-3 gap-3 text-xs">
                <span className="px-3 py-1 bg-orange-100 rounded">Chapters: {c.total_chap}</span>
                <span className="px-3 py-1 bg-orange-100 rounded">Duration: {c.duration} Hrs</span>
                <span className="px-3 py-1 bg-orange-100 rounded">Price: ₹{c.price}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 justify-end">

              {/* View */}
              <button
                onClick={() => window.location.href = `/course/${c.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View
              </button>

              {/* Edit */}
              <button
                className="px-4 py-2 border border-orange-600 rounded hover:bg-orange-100"
                onClick={() => editCourse(c)}
              >
                Edit
              </button>

              {/* Delete */}
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => setCourseToDelete(c)}
              >
                Delete
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default SuperAdminCourses;

/* ---------------------------- MODAL ---------------------------- */

function Modal({ children, onClose }) {
  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ESC close
  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, []);

  return (
    <div
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div className="bg-white p-6 rounded-xl w-full max-w-6xl shadow-xl">
        {children}
      </div>
    </div>
  );
}
