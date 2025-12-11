import { useEffect, useState } from "react";
import axios from "axios";


function SuperAdminDashboard({ setActive }) {
  const [course, setCourse] = useState();
  const [students, setStudents] = useState();
  const [college, setCollege] = useState();

  useEffect(() => {
    axios.get(import.meta.env.VITE_COUNT).then((json) => {
      setCollege(json.data.total_university);
      setStudents(json.data.total_student);
      setCourse(json.data.total_course);
    });
  }, []);

  return (
    <>
      {/* Header Section */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-cover rounded-xl gap-4 p-6"
      >
        {/* Welcome Box */}
        <div className="w-full col-span-1 md:col-span-3 bg-orange-100/80 backdrop-blur-md rounded-xl shadow-md p-8 flex flex-col justify-center border border-orange-200">
          <h1 className="text-2xl font-semibold text-orange-800">Welcome</h1>
          <h2 className="text-4xl font-bold text-orange-700 mt-2">LMS Admin</h2>
        </div>

        {/* Action Buttons */}
        <ThemedCard>
          <ActionButton text="+ Create Course" color="#F97316" onClick={() => setActive("courses")} />
        </ThemedCard>

        <ThemedCard>
          <ActionButton text="+ Add Faculty" color="#F97316" onClick={() => setActive("faculty")} />
        </ThemedCard>

        <ThemedCard>
          <ActionButton text="+ Add Student" color="#F97316" onClick={() => setActive("students")} />
        </ThemedCard>

        <ThemedCard>
          <ActionButton text="+ Add Certificate" color="#F97316" onClick={() => setActive("certificate")} />
        </ThemedCard>

        <ThemedCard>
          <ActionButton text="+ Add Blog" color="#F97316" onClick={() => setActive("blog")} />
        </ThemedCard>

      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-6">
        <StatCard count={course} label="Courses" />
        <StatCard count={students} label="Students" />
        <StatCard count={college} label="Colleges" />
      </div>

    </>
  );
}

/* ----------------------------- UI COMPONENTS ----------------------------- */

function ThemedCard({ children }) {
  return (
    <div className="flex justify-center items-center bg-orange-100/70 backdrop-blur-lg rounded-xl shadow-md border border-orange-200">
      {children}
    </div>
  );
}

function ActionButton({ text, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-full px-5 py-2 rounded-md text-white font-medium shadow-md hover:brightness-90 transition"
      style={{ backgroundColor: color }}
    >
      {text}
    </button>
  );
}

function StatCard({ count, label }) {
  return (
    <div className="bg-orange-100 rounded-xl shadow-md border border-orange-200 p-6 text-center">
      <p className="text-4xl font-bold text-orange-700">{count}</p>
      <h3 className="text-xl font-medium text-orange-700">{label}</h3>
    </div>
  );
}

export default SuperAdminDashboard;
