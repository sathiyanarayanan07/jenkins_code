import axios from "axios";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

function CourseList({ onSuccess, onRegisterSubmitHandler }) {
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

  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // const token = btoa(`admin:admin@123`);

  useEffect(() => {
    axios.get(`${baseUrl}/api/coursecategory/`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  const handleUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Scopik");

    if (key === "Image") setUploadingCardImage(true);
    if (key === "BG") setUploadingCourseImage(true);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dm8wceqw2/image/upload",
        { method: "POST", body: data }
      );

      const result = await res.json();

      if (key === "Image") setCardImage(result.url);
      if (key === "BG") setCourseImage(result.url);
    } catch {
      alert("Failed to upload image!");
    } finally {
      if (key === "Image") setUploadingCardImage(false);
      if (key === "BG") setUploadingCourseImage(false);
    }
  };

  const handleSubmit = () => {
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
      .post(`${baseUrl}/api/addcourse/`, payload)
      .then(() => {
        setSuccessMessage("Course created successfully!");
        setSuccessModal(true);
        resetForm();
        onSuccess && onSuccess();
      })
      .catch(() => alert("Failed to create course"));
  };

  useEffect(() => {
    if (onRegisterSubmitHandler) {
      onRegisterSubmitHandler(handleSubmit);
    }
  }, [onRegisterSubmitHandler]);


  const resetForm = () => {
    setCourseName("");
    setCourseDesc("");
    setCardImage("");
    setChapter("");
    setDuration("");
    setPrice("");
    setCourseImage("");
    setCategory([]);
  };

  const removeCategory = (cat) => {
    setCategory((prev) => prev.filter((c) => c !== cat));
  };

  const isFormComplete =
    courseName &&
    courseDesc &&
    cardImage &&
    chapter &&
    duration &&
    price &&
    courseImage &&
    category.length > 0 &&
    !uploadingCardImage &&
    !uploadingCourseImage;

  return (
    <div className="p-6 bg-white rounded-xl shadow mx-auto">

      {/* ----------------- Success Modal ------------------ */}
      {successModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center border border-orange-200">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-orange-800">Success</h2>
            <p className="mt-2 text-gray-700">{successMessage}</p>
            <button
              onClick={() => setSuccessModal(false)}
              className="mt-5 bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 w-full transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ----------------- 2 Column Layout ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ---------------- LEFT CONTENT ---------------- */}
        <div className="space-y-3">

          {/* Categories */}
          <div>
            <label className="block text-orange-800 font-semibold mb-1">
              Course Categories <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-2 mb-2">
              {category.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 bg-orange-200 text-orange-900 rounded-full text-sm flex items-center gap-1"
                >
                  {cat}
                  <button
                    onClick={() => removeCategory(cat)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <select
              className="border border-orange-300 rounded-md p-2 w-full focus:outline-orange-500"
              value=""
              onChange={(e) => {
                if (e.target.value && !category.includes(e.target.value)) {
                  setCategory((prev) => [...prev, e.target.value]);
                }
              }}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <InputField label="Course Name" value={courseName} onChange={setCourseName} />
          <InputField textarea label="Description" value={courseDesc} onChange={setCourseDesc} />

          {/* 3 small fields in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Chapters" value={chapter} onChange={setChapter} />
            <InputField label="Duration" value={duration} onChange={setDuration} />
            <InputField label="Price" value={price} onChange={setPrice} />
          </div>

        </div>

        {/* ---------------- RIGHT SIDE IMAGES ---------------- */}
        <div className="space-y-3">
          <ImageUpload
            title="Card Image"
            resolution="480x400"
            uploading={uploadingCardImage}
            imageUrl={cardImage}
            onUpload={(e) => handleUpload(e, "Image")}
          />

          <ImageUpload
            title="Background Image"
            resolution="1440x480"
            uploading={uploadingCourseImage}
            imageUrl={courseImage}
            onUpload={(e) => handleUpload(e, "BG")}
          />

        </div>

      </div>


      {/* Submit */}
      <button
        disabled={!isFormComplete}
        onClick={handleSubmit}
        className={`mt-8 w-full py-3 rounded-lg text-lg font-semibold transition ${isFormComplete
          ? "bg-orange-600 text-white hover:bg-orange-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        Submit Course
      </button>
    </div>
  );
}

/* ------------------------------------ */
/* Reusable Input Component */
/* ------------------------------------ */

function InputField({
  label,
  value,
  onChange,
  textarea = false,
  placeholder = "",
}) {
  return (
    <div>
      <label className="block text-orange-800 font-semibold mb-1">{label}</label>

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border border-orange-300 rounded-md p-2 w-full focus:outline-orange-500"
          rows={4}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border border-orange-300 rounded-md p-2 w-full focus:outline-orange-500"
        />
      )}
    </div>
  );
}

/* ------------------------------------ */
/* Image Upload Box */
/* ------------------------------------ */

function ImageUpload({ title, resolution, uploading, imageUrl, onUpload }) {
  return (
    <div>
      <label className="block text-orange-800 font-semibold mb-1">
        {title}{" "}
        <span className="text-sm text-gray-500">({resolution} px)</span>
      </label>

      <div className="border-2 border-dashed border-orange-300 rounded-lg h-44 w-full flex items-center justify-center cursor-pointer hover:border-orange-500 transition relative">
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
            <span className="text-orange-600 mt-2">Uploading...</span>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            className="h-full w-full object-cover rounded-lg"
            alt={title}
          />
        ) : (
          <p className="text-orange-400 text-center">
            Click to upload <br />
            <span className="text-sm text-orange-300">
              Recommended: {resolution}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default CourseList;
