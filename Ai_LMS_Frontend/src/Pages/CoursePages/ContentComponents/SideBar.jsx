// import { useMemo, useState, useEffect } from "react";
// import {
//     Video,
//     Award,
//     BookOpen,
//     X,
//     Cpu,
//     ChevronDown,
//     ChevronUp,
//     Folder,
//     FileText,
// } from "lucide-react";

// // Single chapter dropdown
// const ModuleDropdown = ({
//     module,
//     isOpen,
//     onToggle,
//     selectedChapterId,
//     currentContentType,
//     onSelect, // (chapterId, type) => void
// }) => {
//     const contentItems = [];

//     if (module.videos?.length > 0) {
//         contentItems.push({
//             name: "Videos",
//             icon: Video,
//             type: "video",
//             count: module.videos.length,
//         });
//     }

//     if (module.materials?.length > 0) {
//         contentItems.push({
//             name: "Documents",
//             icon: FileText,
//             type: "document",
//             count: module.materials.length,
//         });
//     }

//     if (module.textcontents?.length > 0) {
//         contentItems.push({
//             name: "Text Content",
//             icon: BookOpen,
//             type: "text",
//             count: module.textcontents.length,
//         });
//     }

//     // Always show these
//     contentItems.push(
//         { name: "Quiz", icon: Award, type: "quiz" },
//         { name: "Assignment", icon: Cpu, type: "assignment" }
//     );

//     // smooth scroll into view when open
//     useEffect(() => {
//         if (isOpen) {
//             const el = document.getElementById(`module-${module.id}`);
//             if (el) {
//                 el.scrollIntoView({ behavior: "smooth", block: "start" });
//             }
//         }
//     }, [isOpen, module.id]);

//     const handleItemClick = (item) => {
//         onSelect(module.id, item.type);
//     };

//     return (
//         <div id={`module-${module.id}`} className="border-b border-gray-200">
//             {/* Chapter header */}
//             <button
//                 onClick={onToggle}
//                 className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
//             >
//                 <div className="flex items-center gap-2">
//                     <Folder size={16} className="text-orange-500" />
//                     <span className="font-semibold text-gray-800 text-sm truncate">
//                         {module.title}
//                     </span>
//                 </div>
//                 {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </button>

//             {/* Dropdown items */}
//             {isOpen && (
//                 <div className="bg-gray-50 border-t">
//                     {contentItems.map((item) => {
//                         const Icon = item.icon;
//                         const active =
//                             selectedChapterId === module.id &&
//                             currentContentType === item.type;

//                         return (
//                             <button
//                                 key={item.type}
//                                 onClick={() => handleItemClick(item)}
//                                 className={`w-full flex items-center gap-3 p-3 pl-8 text-left text-sm transition
//                   ${active
//                                         ? "bg-orange-100 text-orange-700"
//                                         : "hover:bg-gray-100 text-gray-700"
//                                     }
//                 `}
//                             >
//                                 <Icon size={16} />
//                                 <span>{item.name}</span>

//                                 {item.count != null && (
//                                     <span className="ml-auto bg-orange-100 text-orange-700 text-xs px-2 rounded-full">
//                                         {item.count}
//                                     </span>
//                                 )}
//                             </button>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };

// // Sidebar with all chapters as modules
// const SidebarNavigation = ({
//     isOpen,
//     onClose,
//     Content,
//     selectedChapterId,
//     currentContentType,
//     onSelect, // (chapterId, type) => void
// }) => {
//     const [openModules, setOpenModules] = useState({});

//     const chapters = useMemo(() => Content?.chapters || [], [Content]);

//     const toggleModule = (id) => {
//         setOpenModules((prev) => {
//             const next = {};
//             Object.keys(prev).forEach((key) => (next[key] = false));
//             next[id] = !prev[id];
//             return next;
//         });
//     };

//     return (
//         <>
//             {/* Mobile backdrop */}
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
//                     onClick={onClose}
//                 />
//             )}

//             {/* Sidebar */}
//             <div
//                 className={`
//           fixed lg:sticky lg:top-[60px] left-0 z-40
//           w-64 bg-white border-r border-gray-200
//           transform transition-transform duration-300
//           ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//           flex flex-col h-[calc(100vh-60px)] overflow-y-auto
//         `}
//             >
//                 {/* Header */}
//                 <div className="p-4 border-b flex justify-between items-center">
//                     <h2 className="text-lg font-bold text-orange-600">LearnHub</h2>
//                     <button onClick={onClose} className="lg:hidden">
//                         <X size={20} />
//                     </button>
//                 </div>

//                 {/* Modules */}
//                 <div className="flex-1 overflow-y-auto">
//                     {chapters.map((chapter) => (
//                         <ModuleDropdown
//                             key={chapter.id}
//                             module={chapter}
//                             isOpen={openModules[chapter.id] || false}
//                             onToggle={() => toggleModule(chapter.id)}
//                             selectedChapterId={selectedChapterId}
//                             currentContentType={currentContentType}
//                             onSelect={onSelect}
//                         />
//                     ))}
//                 </div>

//                 {/* Footer */}
//                 <div className="p-4 border-t text-center text-xs text-gray-500">
//                     LearnHub LMS v1.0
//                 </div>
//             </div>
//         </>
//     );
// };

// export default SidebarNavigation;











// /src/Pages/CoursePages/ContentComponents/SideBar.jsx
import { useMemo, useState, useEffect } from "react";
import {
  Video,
  Award,
  BookOpen,
  X,
  Cpu,
  ChevronDown,
  ChevronUp,
  Folder,
  FileText,
  StickyNote,
} from "lucide-react";

const ModuleDropdown = ({
  module,
  isOpen,
  onToggle,
  selectedChapterId,
  currentContentType,
  onSelect, // (chapterId, type) => void
}) => {
  const contentItems = [];

  if (module.videos?.length > 0) {
    contentItems.push({
      name: "Videos",
      icon: Video,
      type: "video",
      count: module.videos.length,
    });
  }

  if (module.materials?.length > 0) {
    contentItems.push({
      name: "Documents",
      icon: FileText,
      type: "document",
      count: module.materials.length,
    });
  }

  if (module.textcontents?.length > 0) {
    contentItems.push({
      name: "Text Content",
      icon: BookOpen,
      type: "text",
      count: module.textcontents.length,
    });
  }

  // Always available items
  contentItems.push(
    { name: "Quiz", icon: Award, type: "quiz" },
    // { name: "Assignment", icon: Cpu, type: "assignment" },
    { name: "Notes", icon: StickyNote, type: "notes" }
  );

  useEffect(() => {
    if (isOpen) {
      const el = document.getElementById(`module-${module.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [isOpen, module.id]);

  const handleItemClick = (item) => {
    onSelect(module.id, item.type);
  };

  return (
    <div id={`module-${module.id}`} className="border-b border-gray-200">
      {/* Chapter header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <Folder size={16} className="text-orange-500" />
          <span className="font-semibold text-gray-800 text-sm truncate">
            {module.title}
          </span>
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Dropdown items */}
      {isOpen && (
        <div className="bg-gray-50 border-t">
          {contentItems.map((item) => {
            const Icon = item.icon;
            const active =
              selectedChapterId === module.id &&
              currentContentType === item.type;

            return (
              <button
                key={item.type}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 p-3 pl-8 text-left text-sm transition
                  ${active
                    ? "bg-orange-100 text-orange-700"
                    : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <Icon size={16} />
                <span>{item.name}</span>
                {item.count != null && (
                  <span className="ml-auto bg-orange-100 text-orange-700 text-xs px-2 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SidebarNavigation = ({
  isOpen,
  onClose,
  Content,
  selectedChapterId,
  currentContentType,
  onSelect, // (chapterId, type) => void
}) => {
  const [openModules, setOpenModules] = useState({});

  const chapters = useMemo(() => Content?.chapters || [], [Content]);

  const toggleModule = (id) => {
    setOpenModules((prev) => {
      const next = {};
      Object.keys(prev).forEach((key) => (next[key] = false));
      next[id] = !prev[id];
      return next;
    });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky lg:top-[60px] left-0 z-40
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col h-[calc(100vh-60px)] overflow-y-auto
        `}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-orange-600">LearnHub</h2>
          <button onClick={onClose} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Chapters as modules */}
        <div className="flex-1 overflow-y-auto">
          {chapters.map((chapter) => (
            <ModuleDropdown
              key={chapter.id}
              module={chapter}
              isOpen={openModules[chapter.id] || false}
              onToggle={() => toggleModule(chapter.id)}
              selectedChapterId={selectedChapterId}
              currentContentType={currentContentType}
              onSelect={onSelect}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t text-center text-xs text-gray-500">
          LearnHub LMS v1.0
        </div>
      </div>
    </>
  );
};

export default SidebarNavigation;
