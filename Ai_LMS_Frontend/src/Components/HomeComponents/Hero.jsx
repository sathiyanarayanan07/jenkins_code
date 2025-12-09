import heroImg from '/src/assets/heroillustration.png';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const Hero = () => {
  return (
    <motion.div
      className="relative lg:min-h-screen px-6 py-16 lg:px-10 flex flex-col-reverse md:flex-row items-center justify-end gap-10 font-mono"
      style={{ backgroundColor: '#FFF4E5' }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Left Content */}
      <motion.div className="w-full md:w-1/2" variants={fadeUp}>
        <motion.h1
          className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl xl:max-w-lg 2xl:max-w-xl font-bold text-black md:mt-5 mb-4"
          variants={fadeUp}
        >
          The Best Platform To <span className="text-orange-400">Learn</span> In
          Your Specials <span className="text-orange-400">Course.</span>
        </motion.h1>

        <motion.p
          className="text-base md:text-sm lg:text-md lg:max-w-sm xl:max-w-md leading-relaxed mb-8 text-gray-700"
          variants={fadeUp}
        >
          Learn anytime, anywhere with expert-led courses designed to boost your
          skills and knowledge. Gain real-world experience through interactive
          lessons and start achieving your career goals today.
        </motion.p>

        {/* Buttons */}
        <motion.div className="flex flex-wrap gap-4" variants={fadeUp}>
          <button className="bg-white text-xs font-semibold py-3 px-3 lg:px-6 rounded-full shadow-md hover:bg-gray-100 transition flex items-center">
            <span className="mr-2">👨‍🏫</span> 100+ Expert Mentors
          </button>
          <button className="bg-white text-xs font-semibold py-3 px-4 lg:px-6 rounded-full shadow-md hover:bg-gray-100 transition flex items-center">
            <span className="mr-2">👥</span> 3k+ Active Learners
          </button>
        </motion.div>
      </motion.div>

      {/* Right Side Image */}
      <motion.div
        className="w-full md:w-1/2"
        variants={imageVariants}
      >
        <img
          src={heroImg}
          alt="Student Learning"
          className="w-full h-auto object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

export default Hero;
