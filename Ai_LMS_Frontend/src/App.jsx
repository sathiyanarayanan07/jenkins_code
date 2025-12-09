import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import axios from "axios";

import MainLayout from "/src/Layout/MainLayout.jsx";
import ScrollToTop from "/src/Layout/ScrollToTop.js";

import Register from "/src/Pages/AuthPages/Register.jsx";
import SetPassword from "/src/Pages/AuthPages/SetPassword.jsx";
import Login from "/src/Pages/AuthPages/Login.jsx";
import SuperAdminLogin from "/src/Pages/AuthPages/SuperAdminLogin.jsx";


import Home from "/src/Pages/Home.jsx";
import About from "/src/Pages/About.jsx";
import Contact from "/src/Pages/Contact.jsx";

import Courses from "/src/Pages/CoursePages/Courses.jsx";
import InnerCourse from "/src/Pages/CoursePages/InnerCourse.jsx";
import CourseContent from "/src/Pages/CoursePages/CourseContent.jsx";
import Quizzes from "/src/Components/CourseComponents/Quizzes.jsx";
import CertificatePage from "/src/Pages/Certificate.jsx";

import BlogPage from "/src/Pages/Blog/BlogPage.jsx";
import BlogDetails from "/src/Pages/Blog/InnerBlog.jsx";

import SuperAdminLayout from "./SuperAdmin/SuperAdminLayout.jsx";
import StudentDashboard from "/src/Dashboard/Student/StudentDashboard.jsx";
import Teacherdashboard from "/src/Dashboard/Teacher/Teacherdashboard.jsx";

import SemesterDetail from "./Dashboard/Student/SemesterDetails";
import SemesterList from "./Dashboard/Student/SemesterList";

import Chatbot from "/src/NewHome/Chatbot.jsx"

// Contexts
const loginContext = createContext();
const CourseContext = createContext();
const ChallengeContext = createContext();

function App() {
  const [login, setLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [Course, setCourse] = useState([]);

  const [challengeName, setChallengeName] = useState(localStorage.getItem("challengeName") || "");
  const [challengeScore, setChallengeScore] = useState(() => {
    const storedScore = localStorage.getItem("challengeScore");
    return storedScore ? Number(storedScore) : 0;
  });

  const username = "admin";
  const password = "admin@123";
  const token = btoa(`${username}:${password}`);

  // Load course data
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCourse(res.data))
      .catch((error) => console.error("Course loading error:", error));
  }, [token]);

  // Load login state
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");

    if (storedToken) {
      setLogin(true);
      if (storedUserName) setUserName(storedUserName);
      if (storedUserEmail) setUserEmail(storedUserEmail);
    }
  }, []);

  // Persist challengeScore to localStorage
  useEffect(() => {
    localStorage.setItem("challengeScore", challengeScore);
  }, [challengeScore]);

  return (
    <loginContext.Provider value={{ login, setLogin, userName, setUserName, userEmail, setUserEmail }}>
      <ChallengeContext.Provider value={{ challengeName, setChallengeName, challengeScore, setChallengeScore }}>
        <CourseContext.Provider value={{ Course, setCourse }}>
          <BrowserRouter>
            <ScrollToTop />
            <Chatbot />
            <Routes>
              {/* Layout routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blogs/:id" element={<BlogDetails />} />

                <Route path="/course" element={<Courses />} />
                <Route path="/course/:id" element={<InnerCourse />} />

                <Route path="/quizzes/:id" element={<Quizzes />} />

                <Route path="/semesters" element={<SemesterList />} />
                <Route path="/semesters/:id" element={<SemesterDetail />} />
              </Route>

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/certificate" element={<CertificatePage />} /> */}
              <Route path="/set-password/:token/:email" element={<SetPassword />} />

              <Route path="/individual/:id" element={<CourseContent />} />

              {/* Super Admin & University Admin */}
              <Route path="/superadminlogin" element={<SuperAdminLogin />} />
              <Route path="/superadmin" element={login ? <SuperAdminLayout /> : <Navigate to="/superadminlogin" replace />} />

              {/* Dashboards */}
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/faculty" element={<Teacherdashboard />} />
            </Routes>
          </BrowserRouter>
        </CourseContext.Provider>
      </ChallengeContext.Provider>
    </loginContext.Provider>
  );
}

export default App;
export { loginContext, ChallengeContext, CourseContext };
