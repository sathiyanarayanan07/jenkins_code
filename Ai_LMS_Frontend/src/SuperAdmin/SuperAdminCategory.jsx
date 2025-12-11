import axios from "axios";
import { useEffect, useRef, useState } from "react";

function SuperAdminCategory() {
  const [categories, setCategories] = useState([]);
  const [catImg, setCatImg] = useState("");
  const [desc, setDesc] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editCatName, setEditCatName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const baseUrl = import.meta.env.VITE_BASE_URL;

  /* -------------------------------- Data Fetching ------------------------------- */
  useEffect(() => {
    axios.get(`${baseUrl}/api/coursecategory/`).then((response) => {
      setCategories(response.data);
    });
  }, [baseUrl]);

  /* -------------------------------- Image Upload ------------------------------- */
  const handleCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Scopik");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dm8wceqw2/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setCatImg(data.url);
      setSaveEnabled(true);
    } catch {
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  /* ------------------------------ Save & Update ------------------------------- */
  const handleSaveCategory = () => {
    if (!desc.trim()) {
      setErrorMsg("Category name is required.");
      return;
    }

    if (!catImg) {
      setErrorMsg("Please upload a category image.");
      return;
    }

    setErrorMsg(""); // clear errors when valid

    const payload = { category_name: desc, images: catImg };

    editing ? updateCategory(payload) : createCategory(payload);
  };

  const createCategory = (payload) => {
    axios
      .post(`${baseUrl}/api/createcategory/`, payload)
      .then(() => {
        setCategories((prev) => [...prev, { name: desc, image: catImg }]);
        resetForm();
      })
      .catch(() => alert("Failed to add category"));
  };

  const updateCategory = (payload) => {
    axios
      .put(`${baseUrl}/api/updatecategory/${editCatName}`, payload)
      .then(() => {
        setCategories((prev) =>
          prev.map((item) =>
            item.name === editCatName ? { ...item, name: desc, image: catImg } : item
          )
        );
        resetForm();
      })
      .catch(() => alert("Update failed"));
  };

  /* ---------------------------------- Delete ---------------------------------- */
  const confirmDelete = () => {
    axios
      .delete(`${baseUrl}/api/deletecategory/${categoryToDelete}`)
      .then(() => {
        setCategories((prev) => prev.filter((item) => item.name !== categoryToDelete));
        setShowDeleteModal(false);
      })
      .catch(() => alert("Delete failed"));
  };

  /* --------------------------------- Editing --------------------------------- */
  const handleEdit = (name) => {
    const cat = categories.find((c) => c.name === name);
    if (!cat) return;

    setEditing(true);
    setEditCatName(name);
    setDesc(cat.name);
    setCatImg(cat.image);
    setSaveEnabled(true);
    setShowForm(true);
  };

  /* --------------------------------- Reset Form ------------------------------- */
  const resetForm = () => {
    setDesc("");
    setCatImg("");
    setSaveEnabled(false);
    setShowForm(false);
    setEditing(false);
    setEditCatName("");
  };

  /* -------------------------------- Filtering -------------------------------- */
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ----------------------------------------------------------------------------
   * Components
   * --------------------------------------------------------------------------*/

  const HeaderSection = () => (
    <div className="flex justify-between items-center py-5 px-2">
      <h1 className="text-xl font-bold text-orange-800">Categories</h1>

      <div className="flex flex-col md:flex-row gap-3">
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded-md shadow hover:bg-orange-700 transition"
        >
          Add Category
        </button>

        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-orange-300 w-60 px-3 py-2 rounded-md focus:outline-orange-500"
        />
      </div>
    </div>
  );

  const CategoryCard = ({ item }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-all p-4 gap-4">
      <div className="w-full sm:w-40 h-20">
        <img src={item.image} className="w-full h-full object-cover rounded border" />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-xl font-semibold text-orange-800">{item.name}</h2>
        <p className="text-orange-700 text-sm opacity-75">
          Category used to group similar courses & learning content.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleEdit(item.name)}
          className="bg-orange-600 text-white px-5 py-2 rounded-lg shadow hover:bg-orange-700 transition"
        >
          Edit
        </button>

        <button
          onClick={() => {
            setCategoryToDelete(item.name);
            setShowDeleteModal(true);
          }}
          className="bg-red-600 text-white px-5 py-2 rounded-lg shadow hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );

  const CategoryListSection = () => {
    if (categories.length === 0)
      return (
        <div className="text-center py-10 text-orange-700 font-medium">
          No categories available. Please add a category.
        </div>
      );

    if (filteredCategories.length === 0)
      return (
        <div className="text-center py-10 bg-orange-100 border border-orange-200 rounded-lg text-orange-700 font-medium">
          No categories found for your search.
        </div>
      );

    return filteredCategories.map((item, i) => <CategoryCard key={i} item={item} />);
  };

  return (
    <div className="mx-auto px-4 pb-10 rounded-lg bg-orange-50 shadow-inner min-h-[calc(100%-30px)]">
      <HeaderSection />
      <div className="space-y-4">
        <CategoryListSection />
      </div>

      {showForm && (
        <CategoryModal
          uploading={uploading}
          catImg={catImg}
          desc={desc}
          saveEnabled={saveEnabled}
          editing={editing}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          onClose={resetForm}
          onDescChange={setDesc}
          onImageUpload={handleCategoryImage}
          onSave={handleSaveCategory}
        />

      )}

      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

/* --------------------------- Reusable Modals --------------------------- */

function CategoryModal({
  uploading,
  catImg,
  desc,
  saveEnabled,
  editing,
  errorMsg,
  setErrorMsg,
  onClose,
  onDescChange,
  onImageUpload,
  onSave
}) {
  const modalRef = useRef();

  useEffect(() => {
    function handleOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4">
      <div
        ref={modalRef}
        className="bg-white max-w-2xl w-full p-6 rounded-lg shadow-xl border border-orange-200 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-orange-700 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-orange-700 mb-6">
          {editing ? "Edit Category" : "Add Category"}
        </h2>

        <div className="space-y-4">

          <div>
            <label className="font-medium text-orange-800">Category Name</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => {
                onDescChange(e.target.value);
                setErrorMsg(""); // clear error on typing
              }}
              className="border mt-2 p-2 w-full rounded-md focus:outline-orange-500"
            />

            {/* Error message */}
            {errorMsg && (
              <p className="text-red-600 text-sm mt-1">{errorMsg}</p>
            )}
          </div>


          <div>
            <label className="font-medium text-orange-800">Upload Image</label>
            <label className="cursor-pointer border-2 border-dashed border-orange-300 rounded-md p-3 mt-2 w-full text-center block bg-orange-50 hover:border-orange-500 transition">
              <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />

              {uploading ? (
                <p className="text-orange-700">Uploading...</p>
              ) : catImg ? (
                <img src={catImg} className="h-28 mx-auto rounded object-cover" />
              ) : (
                <span className="text-orange-400">Click to upload image</span>
              )}
            </label>
          </div>

          {saveEnabled && (
            <button
              onClick={onSave}
              className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition mx-auto block"
            >
              {editing ? "Update Category" : "Save Category"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ onClose, onConfirm }) {
  const modalRef = useRef();

  useEffect(() => {
    function handleOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4">
      <div
        ref={modalRef}
        className="bg-white max-w-sm w-full p-6 rounded-lg shadow-xl border border-orange-200"
      >
        <h2 className="text-xl font-bold text-orange-700 mb-4">Confirm Delete</h2>
        <p className="text-orange-800 mb-6">Are you sure you want to delete this category?</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>

          <button
            onClick={onClose}
            className="bg-orange-200 text-orange-800 px-4 py-2 rounded-md hover:bg-orange-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminCategory;
