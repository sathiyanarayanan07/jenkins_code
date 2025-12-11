import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaGooglePlusG,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Newsletter */}
        <div>
          <h2 className="text-black text-xl font-semibold mb-2">Subscribe to our Newsletter</h2>
          <p className="text-gray-400 mb-4 text-sm">
            Stay updated with our latest news and offers
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md border text-black w-full sm:w-auto"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">
              Subscribe
            </button>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-6 mb-6">
            <a href="#" className="bg-white text-black p-2 rounded-full">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="bg-white text-black p-2 rounded-full">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="bg-white text-black p-2 rounded-full">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="bg-white text-black p-2 rounded-full">
              <FaGooglePlusG size={20} />
            </a>
            <a href="#" className="bg-white text-black p-2 rounded-full">
              <FaYoutube size={20} />
            </a>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 justify-center">
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>About</Link>
            <Link to={"/course"}>Course</Link>
            <Link to={"/contact"}>Contact Us</Link>
            <Link to={"/blog"}>Blog</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        Copyright ©2025; Developed by{" "}
        <a href="https://thirdvizion.com/" className="text-white font-semibold">Thirdvizion</a>
      </div>
    </footer>
  );
}
