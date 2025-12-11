import Header from "/src/Layout/Header.jsx";
import {
  LayoutDashboard,
  ListFilter,
  BookOpenCheck,
  // Building2,
  Users2,
  User,
  Award,
  Newspaper,
  // ScrollText,
  HelpCircle
} from "lucide-react";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { useState, useMemo } from "react";

import SuperAdminDashboard from "./SuperAdminDashboard";
import SuperAdminCategory from "./SuperAdminCategory";
import SuperAdminCourses from "./SuperAdminCourses";
// import AddUniversity from "./AddUniversity";
import SuperAdminFaculty from "./SuperAdminFaculty";
import SuperAdminStudents from "./SuperAdminStudents";
import SuperAdminCertificates from "./SuperAdminCertificates";
// import SemesterList from "./SemesterList";
import SuperAdminBlogs from "./SuperAdminBlogs";
import SuperAdminContact from "./SuperAdminContact";

function SuperAdminLayout() {
  const [active, setActive] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Memoized component renderer
  const CurrentComponent = useMemo(() => {
    switch (active) {
      case "dashboard":
        return <SuperAdminDashboard setActive={setActive} />;
      case "category":
        return <SuperAdminCategory />;
      case "courses":
        return <SuperAdminCourses onSuccess={() => setActive("dashboard")} />;
      // case "build":
      //   return <AddUniversity />;
      case "students":
        return <SuperAdminStudents />;
      case "faculty":
        return <SuperAdminFaculty />;
      case "certificate":
        return <SuperAdminCertificates />;
      case "blog":
        return <SuperAdminBlogs />;
      // case "syllabus":
      //   return <SemesterList />;
      case "contact":
        return <SuperAdminContact />;
      default:
        return <SuperAdminDashboard />;
    }
  }, [active]);

  const sidebarItems = [
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "category", icon: <ListFilter size={20} />, label: "Category" },
    { id: "courses", icon: <BookOpenCheck size={20} />, label: "Courses" },
    // { id: "build", icon: <Building2 size={20} />, label: "University" },
    { id: "students", icon: <Users2 size={20} />, label: "Students" },
    { id: "faculty", icon: <User size={20} />, label: "Faculty" },
    { id: "certificate", icon: <Award size={20} />, label: "Certificates" },
    { id: "blog", icon: <Newspaper size={20} />, label: "Blogs" },
    // { id: "syllabus", icon: <ScrollText size={20} />, label: "Syllabus" },
    { id: "contact", icon: <HelpCircle size={20} />, label: "Assistance" }
  ];

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 w-full z-20 shadow-md">
        <Header />
      </div>

      {/* Layout */}
      <div className="flex w-full bg-gradient-to-r from-orange-200 to-orange-100 pt-[80px] min-h-screen relative">

        {/* Sidebar */}
        <div
          className={`fixed top-[60px] left-0 h-[calc(100vh-60px)] transition-all duration-300 bg-white shadow-xl border-r border-orange-200 z-10 ${sidebarExpanded ? "w-64" : "w-[70px]"
            }`}
        >
          <div className="flex flex-col items-start h-full p-3 overflow-y-auto">

            {/* Toggle Button */}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="self-end mb-4 p-1 text-orange-700 hover:text-orange-500 transition-colors"
            >
              {sidebarExpanded ? (
                <HiChevronDoubleLeft size={20} />
              ) : (
                <HiChevronDoubleRight size={20} />
              )}
            </button>

            {/* Sidebar Menu */}
            {sidebarItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-3 p-2 my-1 rounded-md cursor-pointer w-full transition-all duration-200
                  ${active === item.id
                    ? "bg-orange-100 border-l-4 border-orange-700"
                    : "hover:bg-orange-50"
                  }`}
              >
                <div
                  className={`${active === item.id ? "text-orange-700" : "text-gray-700"
                    }`}
                >
                  {item.icon}
                </div>

                {sidebarExpanded && (
                  <span
                    className={`text-sm ${active === item.id ? "text-orange-700 font-medium" : "text-gray-700"
                      }`}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main
          className="transition-all duration-300 w-full pt-6 pr-6 pl-6 overflow-auto"
          style={{
            marginLeft: sidebarExpanded ? "256px" : "70px",
            height: "calc(100vh - 80px)"
          }}
        >
          {CurrentComponent}
        </main>
      </div>
    </>
  );
}

export default SuperAdminLayout;
