
import Hero from "/src/Components/HomeComponents/Hero.jsx";
import About from "/src/Components/HomeComponents/About.jsx";
import CourseSection from "/src/Components/HomeComponents/CourseSection.jsx";
import Learning from "/src/Components/HomeComponents/Learning.jsx";
import Category from "/src/Components/HomeComponents/Category.jsx";
import CourseList from '/src/Components/HomeComponents/CourseList.jsx';
import HomeBanner from "/src/Components/HomeComponents/HomeBanner.jsx";
import Contact from "/src/Components/HomeComponents/Contact.jsx";
import Student from "/src/Components/HomeComponents/Student.jsx";
import FaqSection from "/src/Components/HomeComponents/FAQ.jsx";

export default function Home() {
  return (
    <>
      <Hero />

      <About />

      <CourseSection />

      <Learning />

      <Category />

      <CourseList />

      <div className="hidden sm:block">
        <HomeBanner />
      </div>

      <Contact />

      <Student />

      <FaqSection />
    </>
  );
}
