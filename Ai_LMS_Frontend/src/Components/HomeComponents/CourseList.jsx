import { useContext } from "react";
import { CourseContext } from "/src/App";
import { FaStar } from "react-icons/fa";
import { PiGraphFill } from "react-icons/pi";
import { BsClock } from "react-icons/bs";
import { LuBookOpen } from "react-icons/lu";

export default function CourseList() {
  const { Course = [] } = useContext(CourseContext);

  // Fallback values (optional)
  const fallbackDuration = (i) =>
    ["15h 30m", "14h 10m", "10h 45m", "20h 00m"][i % 4];

  const fallbackPrice = (i) =>
    ["$104.00", "$48.00", "$67.00", "$89.00"][i % 4];

  const fallbackLessons = (i) =>
    [70, 40, 50, 60][i % 4];

  const fallbackLevel = (i) =>
    ["Beginner", "Intermediate", "Advanced", "Beginner"][i % 4];

  return (
    <section className="py-16 px-4 sm:px-10 md:px-20 bg-white text-black font-mono">
      {/* Header */}
      <div className="text-left mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-orange-500 font-semibold">Our Courses</p>
          <h2 className="text-2xl md:text-4xl font-bold">
            Explore Our Popular Course{" "}
            <span className="text-orange-500 inline-block relative">
              Offerings
              <span className="hidden absolute top-9 -right-3 transform -translate-x-1/2 text-black text-3xl font-semibold rotate-45">
                ↑
              </span>
            </span>
          </h2>
        </div>

        <div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full text-sm sm:text-base transition duration-300">
            View All Courses
          </button>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {Course.map((course, index) => (
          <div
            key={course.id}
            className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition duration-300 border-orange-500 flex flex-col justify-between"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-52 sm:h-60 object-cover rounded-3xl"
              />

              {/* Rating Badge */}
              <div className="absolute top-3 right-3 flex gap-2">
                <div className="bg-white py-1 px-3 rounded-full font-semibold text-sm flex items-center gap-1 text-orange-500 shadow-md">
                  <FaStar /> {course.ratings || 5.0}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col justify-between h-full">
              <h3 className="font-semibold text-lg mb-3">
                {course.name}
              </h3>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-4">
                <span className="flex items-center gap-1">
                  <PiGraphFill className="text-orange-500" />
                  {course.level || fallbackLevel(index)}
                </span>

                <span className="flex items-center gap-1">
                  <BsClock className="text-orange-500" />
                  {fallbackDuration(index)}
                </span>

                <span className="flex items-center gap-1">
                  <LuBookOpen className="text-orange-500" />
                  {course.lessons || fallbackLessons(index)} Lessons
                </span>
              </div>

              {/* Price + Button */}
              <div className="flex justify-between items-center mt-auto">
                <span className="font-bold text-lg">
                  {fallbackPrice(index)}
                </span>

                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm ml-4 w-full max-w-[140px]">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
