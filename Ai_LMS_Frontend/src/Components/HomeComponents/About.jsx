import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const statsVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const containerStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function AboutSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerStagger}
      className="min-h-screen bg-gradient-to-br from-[#fffaf8] via-[#fcf2e7] to-[#f8fbff] flex items-center justify-center px-6 py-20 text-center font-mono"
    >
      <div className="w-full max-w-6xl">
        {/* Badge + Heading */}
        <motion.div variants={fadeUp} className="mb-16">
          <span className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-semibold px-5 py-1.5 rounded-full mb-6 shadow-md">
            About Us
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-relaxed text-gray-800">
            We are passionate about{" "}
            <span className="text-black font-extrabold">empowering learners</span>{" "}
            worldwide with high-quality, accessible & engaging education.
          </h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto"
          >
            Our mission is to offer a diverse range of courses tailored to help
            you grow in your career and passions — at your pace, on your terms.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerStagger}
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0 border-t border-b border-gray-200 py-10 text-gray-800"
        >
          {/* Stat 1 */}
          <motion.div
            variants={statsVariant}
            className="flex flex-col items-center"
          >
            <p className="text-4xl font-extrabold text-black">25+</p>
            <p className="text-sm mt-2 text-gray-600">
              Years of eLearning <br className="hidden sm:block" />
              Education Experience
            </p>
          </motion.div>

          <div className="hidden sm:flex justify-center">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ opacity: 1, height: "100%", transition: { duration: 0.6 } }}
              className="w-px bg-gray-300"
            />
          </div>

          {/* Stat 2 */}
          <motion.div
            variants={statsVariant}
            className="flex flex-col items-center"
          >
            <p className="text-4xl font-extrabold text-black">56k</p>
            <p className="text-sm mt-2 text-gray-600">
              Students Enrolled in <br className="hidden sm:block" />
              LMSZONE Courses
            </p>
          </motion.div>

          <div className="hidden sm:flex justify-center">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ opacity: 1, height: "100%", transition: { duration: 0.6 } }}
              className="w-px bg-gray-300"
            />
          </div>

          {/* Stat 3 */}
          <motion.div
            variants={statsVariant}
            className="flex flex-col items-center"
          >
            <p className="text-4xl font-extrabold text-black">170+</p>
            <p className="text-sm mt-2 text-gray-600">
              Experienced Teachers <br className="hidden sm:block" />
              Delivering Excellence
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
