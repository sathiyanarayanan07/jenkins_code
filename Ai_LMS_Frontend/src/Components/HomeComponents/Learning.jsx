import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Png from "/src/assets/OBJECTS.png";

const features = [
  {
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
    label: "Organize Syllabus",
    svg: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
  {
    bg: "bg-green-100",
    iconColor: "text-green-600",
    label: "Learn Anywhere",
    svg: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h7a2 2 0 002-2v-1a2 2 0 012-2h2.945M9 5l-2 2m0 0l-2-2m2 2V3m12 0v2m0 0l-2 2m2-2l-2-2M13 11l-4 4m6-4l-4 4"
      />
    ),
  },
  {
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
    label: "Easy Learning",
    svg: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
  {
    bg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    label: "Get Certificate",
    svg: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
];

// Animation presets
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const featureVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const imageVariant = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const About2 = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-mono"
    >
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="text-left md:text-center lg:text-left px-10">
          <motion.h1 variants={fadeUp} className="text-2xl sm:text-4xl lg:text-4xl 2xl:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Access to <span className="text-orange-500">Learning</span>
            <br />
            Anytime From <span className="text-orange-500">Anywhere</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-gray-600 text-sm md:text-lg lg:text-sm xl:text-lg mb-8 mx-auto lg:mx-0"
          >
            It is a long established fact that a reader will be distracted by the readable content.
            There are many variations of passages of Lorem Ipsum available.
          </motion.p>

          {/* Feature List */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10"
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={featureVariant}
                className="flex items-center justify-start md:mx-14 lg:mx-0 text-gray-800"
              >
                <div className={`${feature.bg} p-2 rounded-full mr-3`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${feature.iconColor}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {feature.svg}
                  </svg>
                </div>
                <span className="font-medium text-sm md:text-lg">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Button */}
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center px-8 py-3 border border-transparent text-xs font-medium rounded-full text-white bg-orange-500 hover:bg-orange-600 md:py-4 md:text-md xl:text-lg md:px-10 transition-colors duration-300 shadow-lg mx-auto lg:mx-0"
          >
            <Link to="/course">Get Started</Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          variants={imageVariant}
          className="relative flex justify-center lg:justify-end"
        >
          <img src={Png} alt="Learning illustration" className="max-w-full h-auto" />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default About2;
