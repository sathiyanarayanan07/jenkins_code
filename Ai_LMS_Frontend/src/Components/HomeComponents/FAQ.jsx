import { useState } from "react";
import { ChevronRight, X, Plus } from "lucide-react";
import clsx from "clsx";

const categories = [
  "Getting Started",
  "Support & Troubleshooting",
  "Courses & Content",
  "Instructor Tools",
  "Account & Settings",
];

const faqData = {
  "Getting Started": [
    {
      question: "What is an LMS and how does it help me?",
      answer:
        "An LMS (Learning Management System) is a platform that allows you to access courses, track progress, complete quizzes, and earn certificates — all in one place.",
    },
    {
      question: "How do I enroll in a course?",
      answer:
        "You can enroll by browsing the course catalog and clicking the 'Enroll' button. Some courses may require approval or payment.",
    },
    {
      question: "Can I access courses on mobile devices?",
      answer:
        "Yes, our LMS is mobile-responsive and can be accessed on smartphones, tablets, and desktops using a modern browser.",
    },
    {
      question: "Are certificates provided after course completion?",
      answer:
        "Yes, most courses offer a downloadable certificate once all modules and assessments are successfully completed.",
    },
    {
      question: "Is there a time limit for completing a course?",
      answer:
        "Some courses have deadlines, while others are self-paced. Please check the course details page for specific timelines.",
    },
  ],

  "Support & Troubleshooting": [
    {
      question: "How can I contact the support team?",
      answer:
        "You can reach out via the 'Contact Us' page, email us at support@example.com, or use the in-app chat for live assistance.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "Click on 'Forgot Password' on the login screen and follow the instructions to reset it via email or OTP verification.",
    },
    {
      question: "My quiz or course is not loading, what should I do?",
      answer:
        "Clear your browser cache and refresh the page. If the issue persists, contact support with details and screenshots.",
    },
    {
      question: "Can the support team help me with technical errors?",
      answer:
        "Yes, our support team can assist with platform bugs, account issues, and accessibility concerns.",
    },
    {
      question: "What are the support hours?",
      answer:
        "Our support team is available from 9 AM to 7 PM IST, Monday to Saturday. Urgent tickets are prioritized.",
    },
  ],

  "Courses & Content": [
    {
      question: "Can I download course content for offline access?",
      answer:
        "Some materials like PDFs can be downloaded, but videos and interactive content are only available online to protect course integrity.",
    },
    {
      question: "Are there any community forums or discussions?",
      answer:
        "Yes, each course may include a discussion board or comment section for student interaction and questions.",
    },
    {
      question: "Can I request a course that is not available?",
      answer:
        "Yes, you can submit a course request through the feedback form. We consider suggestions for future course development.",
    },
    {
      question: "How do I report inappropriate content?",
      answer:
        "Click the 'Report' button on the content or message the admin with course name and timestamp.",
    },
    {
      question: "What browsers are supported?",
      answer:
        "Our LMS supports Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.",
    },
  ],

  "Instructor Tools": [
    {
      question: "What is the instructor's role in the LMS?",
      answer:
        "Instructors manage course content, publish quizzes, grade assignments, and monitor student progress.",
    },
    {
      question: "Can instructors see student analytics?",
      answer:
        "Yes, instructors can view real-time analytics on quiz scores, time spent, and overall engagement.",
    },
    {
      question: "How do I assign a course to students?",
      answer:
        "From the instructor dashboard, use the 'Assign Course' button and select students from the list or by email.",
    },
    {
      question: "Is live class integration supported?",
      answer:
        "Yes, we support integration with Zoom, Google Meet, and MS Teams for live sessions within the LMS.",
    },
    {
      question: "How are assignments submitted?",
      answer:
        "Students can upload documents or text responses directly within the course interface under the 'Assignments' section.",
    },
  ],

  "Account & Settings": [
    {
      question: "Is my progress saved automatically?",
      answer:
        "Yes, your course progress, quiz attempts, and activities are auto-saved in real time to prevent data loss.",
    },
    {
      question: "Can I reattempt quizzes?",
      answer:
        "It depends on the quiz settings. Some allow unlimited attempts while others may restrict reattempts to once or twice.",
    },
    {
      question: "How do I change my profile or email?",
      answer:
        "Go to the 'Profile Settings' in the dashboard and click 'Edit' to update your personal details.",
    },
    {
      question: "Are my payment details secure?",
      answer:
        "Yes, we use trusted payment gateways with industry-grade encryption to secure all transactions.",
    },
    {
      question: "Can I track my learning goals?",
      answer:
        "Yes, the dashboard shows completed courses, active enrollments, certificates earned, and overall progress charts.",
    },
  ],
};

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("Getting Started");
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gradient-to-br from-[#fdeff2] via-[#f1f9ff] to-[#f0f4ff] py-16 px-6 rounded-2xl shadow-md font-mono mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-left md:text-center text-orange-400 mb-3">
        Frequently Asked Questions
      </h2>
      <p className="text-left md:text-center text-sm text-gray-600 max-w-2xl mx-auto mb-10">
        Our platform is built to help you work smarter, not harder. It adapts to
        your needs and supports your goals. Make the most of every feature.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-5xl mx-auto">
        {/* Left Category List */}
        {/* <div className="flex flex-col gap-4 md:w-1/3">
          {categories.map((category) => (
            <button
              key={category}
              className={clsx(
                "rounded-lg px-4 py-3 text-left font-semibold border hover:bg-white transition",
                activeCategory === category
                  ? "bg-white border-gray-200 shadow text-gray-800"
                  : "bg-white/70 border-transparent text-gray-500"
              )}
              onClick={() => {
                setActiveCategory(category);
                setOpenIndex(null);
              }}
            >
              <div className="flex justify-between items-center">
                <span>{category}</span>
                <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div> */}

        {/* Category Dropdown for Mobile */}
        <div className="mb-4 md:hidden overflow-hidden">
          <select
            className="w-full p-3 rounded-lg border text-sm text-gray-700"
            value={activeCategory}
            onChange={(e) => {
              setActiveCategory(e.target.value);
              setOpenIndex(null);
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sidebar Category List for Desktop */}
        <div className="hidden md:flex flex-col gap-4 md:w-1/3">
          {categories.map((category) => (
            <button
              key={category}
              className={clsx(
                "rounded-lg px-4 py-3 text-left font-semibold border hover:bg-white transition",
                activeCategory === category
                  ? "bg-white border-gray-200 shadow text-gray-800"
                  : "bg-white/70 border-transparent text-gray-500"
              )}
              onClick={() => {
                setActiveCategory(category);
                setOpenIndex(null);
              }}
            >
              <div className="flex justify-between items-center">
                <span>{category}</span>
                <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>

        {/* Right FAQ List */}
        <div className="md:w-2/3 space-y-4">
          {faqData[activeCategory]?.length > 0 ? (
            faqData[activeCategory].map((faq, index) => (
              <div
                key={index}
                className={clsx(
                  "rounded-xl border border-gray-200 bg-white shadow transition-all duration-300",
                  openIndex === index ? "bg-white" : ""
                )}
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center p-3 text-left text-gray-800 text-sm font-medium"
                >
                  <span>{faq.question}</span>
                  {openIndex === index ? <X size={20} /> : <Plus size={20} />}
                </button>

                <div
                  className={clsx(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    openIndex === index ? "max-h-40 p-4 pt-0" : "max-h-0 p-0"
                  )}
                >
                  <p className="text-xs text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No questions in this category.</p>
          )}
        </div>
      </div>
    </section>
  );
}
