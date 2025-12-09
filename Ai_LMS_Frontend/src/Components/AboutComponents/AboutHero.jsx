import image from "/src/assets/Union.png";
import { motion } from "framer-motion";

function AboutHero() {
  return (
    <div className="w-full h-screen max-w-7xl mx-auto px-6 py-16 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
      {/* Left Content */}
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl scale-150 transition-all transform translate-x-40 -mt-32 font-semibold text-gray-900 leading-tight">
          Our Story the Journey <br />
          That’s Shapped <span className="text-orange-500">Our Success</span>
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto md:mx-0 transition-all transform translate-y-16 translate-x-4">
          SHIFT is an agency studio that brings an innovative approach to the
          world of UI/UX design. We are committed to infusing the future into
          every project we undertake.
        </p>
        <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-lg font-medium transition-all transform translate-y-16 translate-x-4 w-fit mx-auto md:mx-0">
          Get Started with your Learning
        </button>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 w-full flex justify-center relative">
        <div className="relative w-fit">
          {/* Rounded Image */}
          <img
            src={image}
            alt="Success Journey"
            className="w-[300px] md:w-full scale-110 transition-all transform -translate-x-10 rounded-[0px_40px_0px_40px] object-cover"
          />

          {/* Review Box Overlay */}
          <div className="absolute -bottom-6 right-2 bg-white shadow-xl rounded-2xl p-4 w-[250px] md:w-[260px]">
            <h2 className="text-xl font-bold text-black">4.9/5</h2>
            <p className="text-sm text-gray-500">
              <span className="text-orange-500 text-base">★</span>{" "}
              <span className="font-medium text-gray-700">18,921</span>{" "}
              <span className="text-xs">(reviews)</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Discover Our TrustScore & Customer Reviews
            </p>
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-orange-500 text-lg">★</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutHero;

