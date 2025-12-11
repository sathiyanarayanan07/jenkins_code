import React, {
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// Context & components
import { CourseContext } from "/src/App";
import Header from "/src/Layout/Header.jsx";
import Quizzes from "/src/Components/CourseComponents/Quizzes.jsx";
import SidebarNavigation from "./ContentComponents/SideBar.jsx";

import AICodingAssignment from "./ContentComponents/AICodingAssignment.jsx";

// AI imports (PATH IMPORTANT)
import {
  AIQuizGenerator,
  AICodingChallengeGenerator,
} from "/src/Pages/CoursePages/ContentComponents/AIEngine.jsx";

// UI icons
import { Menu, Award, Sparkles, Cpu, BookOpen } from "lucide-react";

/* ------------------------------------------------------------------ */
/* SIMPLE VIDEO PLAYER                                                 */
/* ------------------------------------------------------------------ */
const VideoPlayer = ({ videoUrl, videoRef, onProgressUpdate }) => {
  if (!videoUrl) return null;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg mb-4">
      <video
        key={videoUrl}
        src={videoUrl}
        controls
        controlsList="nodownload"
        disablePictureInPicture
        ref={videoRef}
        onTimeUpdate={onProgressUpdate}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* COURSE PROGRESS BAR                                                */
/* ------------------------------------------------------------------ */
const CourseProgress = ({ progress }) => (
  <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
    <h3 className="text-lg font-bold text-orange-600 mb-2">
      Your Study Progress: {progress}%
    </h3>
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
      <div
        className="bg-orange-500 h-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* NOTES VIEW                                                         */
/* ------------------------------------------------------------------ */
const NotesView = ({ id, selectedChapterId }) => {
  const [chapterNotes, setChapterNotes] = useState("");

  useEffect(() => {
    if (selectedChapterId) {
      const savedNotes =
        localStorage.getItem(`notes-${id}-chapter-${selectedChapterId}`) ||
        "";
      setChapterNotes(savedNotes);
    }
  }, [selectedChapterId, id]);

  const handleNoteChange = (e) => {
    const newNote = e.target.value;
    setChapterNotes(newNote);
    localStorage.setItem(
      `notes-${id}-chapter-${selectedChapterId}`,
      newNote
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
      <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-4 sm:mb-6 flex items-center gap-2">
        <BookOpen size={20} className="sm:w-6 sm:h-6" />
        Course Notes
      </h2>

      <div className="mb-3 sm:mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes for current chapter
        </label>
        <textarea
          value={chapterNotes}
          onChange={handleNoteChange}
          placeholder="Write your notes here..."
          className="w-full h-48 sm:h-64 p-3 sm:p-4 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm sm:text-base"
        />
      </div>

      <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
        <span>Auto-saved locally</span>
        <span>{chapterNotes.length} characters</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* AI QUIZ DISPLAY (LOCAL, NOT IN AIEngine)                           */
/* ------------------------------------------------------------------ */

const AIQuizDisplay = ({ questions, onQuizComplete, onNextChapter }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
        <p className="text-gray-500 text-sm">No AI questions to display.</p>
      </div>
    );
  }

  const question = questions[currentIndex];

  const handleAnswer = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === question.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const passed = score + (selectedAnswer === question.correctAnswer ? 1 : 0) >=
        Math.ceil(questions.length * 0.7);
      setCompleted(true);
      onQuizComplete?.(passed);
    }
  };

  if (completed) {
    const finalPassed = score >= Math.ceil(questions.length * 0.7);

    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-tr from-orange-500 to-amber-400 text-white text-3xl">
          {finalPassed ? "🎉" : "💡"}
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {finalPassed ? "Great job!" : "Quiz Completed"}
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          You answered {score} out of {questions.length} questions correctly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setScore(0);
              setCompleted(false);
            }}
            className="px-4 py-2 rounded-lg border border-orange-500 text-orange-600 hover:bg-orange-50 text-sm"
          >
            Retry AI Quiz
          </button>
          {finalPassed && (
            <button
              onClick={onNextChapter}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-sm"
            >
              Go to Next Chapter
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
          <Sparkles size={18} /> AI Quiz
        </h3>
        <span className="text-xs sm:text-sm text-gray-500">
          Question {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <p className="text-gray-800 font-medium mb-4 text-sm sm:text-base">
        {question.question}
      </p>

      <div className="space-y-2 sm:space-y-3 mb-4">
        {question.options.map((opt, idx) => {
          const isCorrect = idx === question.correctAnswer;
          const isSelected = idx === selectedAnswer;

          let classes =
            "w-full text-left text-sm sm:text-base p-3 rounded-lg border transition-all";
          if (!showExplanation) {
            classes +=
              " bg-gray-50 border-gray-300 hover:bg-gray-100 cursor-pointer";
          } else if (isSelected && isCorrect) {
            classes += " bg-green-100 border-green-500 text-green-800";
          } else if (isSelected && !isCorrect) {
            classes += " bg-red-100 border-red-500 text-red-800";
          } else if (!isSelected && isCorrect) {
            classes += " bg-green-50 border-green-300 text-green-700";
          } else {
            classes += " bg-gray-50 border-gray-200 text-gray-700";
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={showExplanation}
              onClick={() => handleAnswer(idx)}
              className={classes}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-400 text-xs">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 break-words">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-800">
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}

      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
        <span>Score: {score}</span>
        <button
          type="button"
          disabled={!showExplanation}
          onClick={handleNext}
          className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-xs sm:text-sm"
        >
          {currentIndex === questions.length - 1
            ? "Finish"
            : "Next Question"}
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* QUIZZES VIEW (AI + MANUAL)                                        */
/* ------------------------------------------------------------------ */

const QuizzesView = ({
  Content,
  selectedChapterId,
  Uemail,
  certificateName,
  assignment,
  addCoursePoints,
}) => {
  const [aiGeneratedQuiz, setAiGeneratedQuiz] = useState([]);

  const selectedChapter = Content?.chapters.find(
    (ch) => ch.id === selectedChapterId
  );
  const manualQuizzes = selectedChapter?.quizzes || [];

  const handleAiQuizGenerated = (quizData) => {
    setAiGeneratedQuiz(quizData);
  };

  const handleAIQuizComplete = (passed) => {
    if (passed) {
      addCoursePoints?.(100);
      console.log("AI Quiz passed — points awarded");
    } else {
      console.log("AI Quiz completed but not passed");
    }
  };

  const handleAINextChapter = () => {
    console.log("TODO: Navigate to next chapter after AI quiz pass");
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
      <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-4 sm:mb-6 flex items-center gap-2">
        <Award size={20} className="sm:w-6 sm:h-6" />
        Course Quizzes
      </h2>

      {/* AI Quiz Generator */}
      <AIQuizGenerator
        chapterDescription={selectedChapter?.description}
        videoDescription={selectedChapter?.videos?.[0]?.description}
        onQuizGenerated={handleAiQuizGenerated}
        chapterId={selectedChapterId}
      />

      {/* Quiz Display Section */}
      <div className="mt-4 sm:mt-6 space-y-4">
        {aiGeneratedQuiz.length > 0 ? (
          <AIQuizDisplay
            questions={aiGeneratedQuiz}
            onQuizComplete={handleAIQuizComplete}
            onNextChapter={handleAINextChapter}
          />
        ) : manualQuizzes.length > 0 ? (
          <Quizzes
            chapterId={selectedChapterId}
            quizData={manualQuizzes}
            onQuizComplete={(passed) => {
              if (passed) {
                addCoursePoints?.(100);
                console.log("Manual quiz completed successfully!");
              }
            }}
            onNextChapter={(nextChapterId) => {
              console.log("Next chapter:", nextChapterId);
            }}
            userEmail={Uemail}
            courseName={certificateName}
            assi={assignment}
          />
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Sparkles
              size={36}
              className="mx-auto text-orange-400 mb-3 sm:mb-4 sm:w-12 sm:h-12"
            />
            <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">
              No quiz available for this chapter.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              Click &ldquo;Generate Quiz&rdquo; above to create AI-powered
              questions based on this chapter&apos;s content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* CHALLENGES VIEW (AI CODING)                                       */
/* ------------------------------------------------------------------ */

const ChallengesView = () => {
  const [challengeGenerated, setChallengeGenerated] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);

  const handleChallengeGenerated = (generated) => {
    setChallengeGenerated(generated);
  };

  const handleChallengeComplete = (score) => {
    setChallengeScore(score);
    console.log("Challenge completed with score:", score);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-3 sm:mb-4 flex items-center gap-2">
          <Cpu size={20} className="sm:w-6 sm:h-6" />
          AI Coding Challenges
        </h2>

        <AICodingChallengeGenerator
          onChallengeGenerated={handleChallengeGenerated}
        />

        <div className="mt-4 sm:mt-6">
          {challengeGenerated ? (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-sm text-gray-700">
              {/* Hook in your full coding challenge UI here */}
              <p>
                Coding challenge generated! (Render your coding workspace
                here.)
              </p>
            </div>
          ) : (
            <div className="text-center py-2 text-sm text-gray-500" />
          )}
        </div>

        {challengeScore > 0 && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-700 text-center text-sm sm:text-base">
              🎉 Great job! You scored {challengeScore}% on the coding
              challenge!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* MAIN COURSE CONTENT COMPONENT                                      */
/* ------------------------------------------------------------------ */

function CourseContent() {
  const { id } = useParams();
  const { Course: CourseList } = useContext(CourseContext);
  const Uemail = localStorage.getItem("userEmail");
  const assignment = localStorage.getItem("assi");

  const Content = CourseList.find((course) => course.id === Number(id));

  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [currentContentType, setCurrentContentType] = useState("video"); // video | document | text | quiz | assignment | notes
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [certificateName, setCertificateName] = useState("");
  const [loading, setLoading] = useState(true);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [unlockedChapters, setUnlockedChapters] = useState([0]);
  const [coursePoints, setCoursePoints] = useState(0);
  const [pointsToAnimateTo, setPointsToAnimateTo] = useState(0); // reserved for future animated UI
  const [showLockModal, setShowLockModal] = useState(false);
  const [showVideoProgressModal, setShowVideoProgressModal] =
    useState(false);
  const [videoWatchedPercentage, setVideoWatchedPercentage] =
    useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("video");

  const videoRef = useRef(null);
  const videoKey = `course-${id}-videoCompleted`;
  const quizKey = `course-${id}-quizCompleted`;
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Reset video % when chapter changes
  useEffect(() => setVideoWatchedPercentage(0), [selectedChapterId]);

  // Load stored points
  useEffect(() => {
    const savedPoints = parseInt(
      localStorage.getItem("CoursePoints") || "0",
      10
    );
    setCoursePoints(savedPoints);
    setPointsToAnimateTo(savedPoints);
  }, []);

  // Init course / progress
  useEffect(() => {
    if (!Uemail || !CourseList?.length || !Content) {
      setLoading(false);
      return;
    }
    setLoading(true);

    setCertificateName(Content.name);

    const formatted = Content.chapters.map((chapter, index) => ({
      title: chapter.title,
      id: chapter.id,
      index,
      duration: "1 hour 20 min", // TODO: real duration from API
    }));
    setCourseData(formatted);

    // Default chapter
    const firstChapter = Content.chapters[0];
    if (firstChapter) {
      setSelectedChapterId(firstChapter.id);
      if (firstChapter.videos?.length) setCurrentContentType("video");
      else if (firstChapter.materials?.length)
        setCurrentContentType("document");
      else if (firstChapter.textcontents?.length)
        setCurrentContentType("text");
      else setCurrentContentType("quiz");
      setCurrentPage("video");
    }

    async function fetchProgress() {
      try {
        const res = await axios.get(`${baseUrl}/api/chapterstatusview/`, {
          params: { email: Uemail, course: Content.name },
        });

        const chapters = res.data?.chapters || [];
        const completed = chapters
          .filter((ch) => ch.status === true)
          .map((ch) => ch.chapter_title);

        const unlocked = completed.map((_, idx) => idx);
        if (completed.length < Content.chapters.length) {
          unlocked.push(completed.length);
        }

        setCompletedChapters(completed);
        setUnlockedChapters(unlocked.length ? unlocked : [0]);

        const initialPoints = completed.length * 100;
        localStorage.setItem("CoursePoints", initialPoints);
        setCoursePoints(initialPoints);
        setPointsToAnimateTo(initialPoints);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setUnlockedChapters([0]);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [id, CourseList, Content, Uemail, baseUrl]);

  // Update selected video when chapter changes
  useEffect(() => {
    if (!Content || !selectedChapterId) return;

    const chapter = Content.chapters.find(
      (ch) => ch.id === selectedChapterId
    );
    if (!chapter) return;

    const video = chapter?.videos?.[0]?.video;
    const videoUrl = video ? video.replace(/^http:/, "https:") : null;

    setSelectedVideoUrl(videoUrl);
  }, [selectedChapterId, Content]);

  // Save unlocked/completed
  useEffect(() => {
    localStorage.setItem(
      `course-${id}-unlocked`,
      JSON.stringify(unlockedChapters)
    );
    localStorage.setItem(
      `course-${id}-completed`,
      JSON.stringify(completedChapters)
    );
  }, [id, unlockedChapters, completedChapters]);

  // Restore watched/quiz
  useEffect(() => {
    if (!Content) return;

    const savedVideo = JSON.parse(localStorage.getItem(videoKey) || "[]");
    const savedQuiz = JSON.parse(localStorage.getItem(quizKey) || "[]");
    const combined = [...new Set([...savedVideo, ...savedQuiz])];

    const savedUnlocked = combined
      .map((title) =>
        Content.chapters.findIndex((ch) => ch.title === title)
      )
      .filter((idx) => idx >= 0);

    if (combined.length < Content.chapters.length) {
      savedUnlocked.push(combined.length);
    }

    setCompletedChapters(combined);
    setUnlockedChapters(savedUnlocked.length ? savedUnlocked : [0]);
  }, [id, Content, videoKey, quizKey]);

  // Mark video as completed at 90%
  useEffect(() => {
    if (videoWatchedPercentage >= 90 && selectedChapterId && Content) {
      const chapter = Content.chapters.find(
        (c) => c.id === selectedChapterId
      );
      if (chapter) {
        const watched = JSON.parse(localStorage.getItem(videoKey) || "[]");
        if (!watched.includes(chapter.title)) {
          const updated = [...watched, chapter.title];
          localStorage.setItem(videoKey, JSON.stringify(updated));
        }
      }
    }
  }, [videoWatchedPercentage, selectedChapterId, Content, videoKey]);

  // If chapter already watched, show 100%
  useEffect(() => {
    if (!Content || !selectedChapterId) return;
    const watched = JSON.parse(localStorage.getItem(videoKey) || "[]");
    const chapter = Content.chapters.find(
      (ch) => ch.id === selectedChapterId
    );
    if (chapter && watched.includes(chapter.title)) {
      setVideoWatchedPercentage(100);
    } else {
      setVideoWatchedPercentage(0);
    }
  }, [selectedChapterId, Content, videoKey]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      if (!duration) return;
      const percentage = (currentTime / duration) * 100;
      setVideoWatchedPercentage(percentage);
    }
  };

  const addCoursePoints = (pointsToAdd = 100) => {
    const existing = parseInt(
      localStorage.getItem("CoursePoints") || "0",
      10
    );
    const updated = existing + pointsToAdd;
    localStorage.setItem("CoursePoints", updated);
    setCoursePoints(updated);
    setPointsToAnimateTo(updated);
    return updated;
  };

  const selectedChapter = Content?.chapters.find(
    (ch) => ch.id === selectedChapterId
  );

  const progressPercent = courseData.length
    ? Math.round(
      (completedChapters.length / courseData.length) * 100
    )
    : 0;

  const handleModalOkay = () => {
    const lastUnlockedIndex =
      unlockedChapters[unlockedChapters.length - 1];
    const lastUnlockedChapter = Content.chapters[lastUnlockedIndex];
    if (lastUnlockedChapter) {
      setSelectedChapterId(lastUnlockedChapter.id);
      setCurrentContentType("quiz");
      setCurrentPage("quiz");
    }
    setShowLockModal(false);
  };

  const canAccessQuiz = (chapterId) => {
    if (!Content) return false;
    const chapter = Content.chapters.find((c) => c.id === chapterId);
    if (!chapter) return false;
    if (!chapter.videos?.length) return true;

    const watched = JSON.parse(localStorage.getItem(videoKey) || "[]");
    return watched.includes(chapter.title);
  };

  const handleSidebarSelect = (chapterId, type) => {
    if (type === "quiz" && !canAccessQuiz(chapterId)) {
      setShowVideoProgressModal(true);
      return;
    }

    setSelectedChapterId(chapterId);
    setCurrentContentType(type);
    setCurrentPage(type);

    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  if (loading || !Content)
    return (
      <div className="p-6 sm:p-10 text-center text-lg sm:text-xl text-orange-500 font-mono">
        Loading...
      </div>
    );

  /* -------------------------------------------------------------- */
  /* Render main content based on currentContentType                */
  /* -------------------------------------------------------------- */

  const renderMainContent = () => {
    if (!selectedChapter) return null;

    switch (currentContentType) {
      case "quiz":
        return (
          <QuizzesView
            Content={Content}
            selectedChapterId={selectedChapterId}
            Uemail={Uemail}
            certificateName={certificateName}
            assignment={assignment}
            addCoursePoints={addCoursePoints}
          />
        );

      case "assignment":
        return (
          <AICodingAssignment
            chapterId={selectedChapterId}
            videoDescription={selectedChapter?.videos?.[0]?.description}
            onComplete={(passed) => {
              if (passed) {
                addCoursePoints(200);
                console.log("Assignment Completed!");
              }
            }}
          />
        );


      case "text":
        return (
          <div className="mt-3 sm:mt-4 bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-orange-600 mb-2">
              Text Content
            </h3>
            {selectedChapter.textcontents?.length ? (
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                {selectedChapter.textcontents.map((t) => (
                  <p key={t.id}>{t.textcontent}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No text content available.
              </p>
            )}
          </div>
        );

      case "document":
        return (
          <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-orange-600 mb-4">
              Documents
            </h3>

            {selectedChapter.materials?.length > 0 ? (
              selectedChapter.materials.map((doc) => (
                <div key={doc.id} className="mb-6">
                  {/* Title */}
                  <p className="font-medium text-gray-800 mb-2">
                    {doc.material_name}
                  </p>

                  {/* Inline PDF Viewer */}
                  <div className="w-full h-[600px] border rounded-lg overflow-hidden shadow">
                    <iframe
                      src={`${doc.material}#toolbar=1&navpanes=0&scrollbar=1`}
                      className="w-full h-full"
                      title={doc.material_name}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No documents available.</p>
            )}
          </div>
        );


      case "notes":
        return (
          <div className="mt-3 sm:mt-4">
            <NotesView id={id} selectedChapterId={selectedChapterId} />
          </div>
        );

      case "video":
      default:
        return (
          <>
            {/* Title + Progress */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 break-words">
                {selectedChapter.title}
              </h1>
              {/* <div className="w-full lg:max-w-xs xl:max-w-md">
                <CourseProgress progress={progressPercent} />
              </div> */}
            </div>

            <VideoPlayer
              videoUrl={selectedVideoUrl}
              videoRef={videoRef}
              onProgressUpdate={handleVideoTimeUpdate}
            />
          </>
        );
    }
  };

  const pageLabelMap = {
    video: "Video",
    document: "Documents",
    text: "Text",
    quiz: "Quiz",
    assignment: "Assignment",
    notes: "Notes",
  };

  return (
    <div className="font-mono bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Page body */}
      <div className="flex flex-1 pt-[60px]">
        {/* Sidebar */}
        <SidebarNavigation
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          Content={Content}
          selectedChapterId={selectedChapterId}
          currentContentType={currentContentType}
          onSelect={handleSidebarSelect}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col transition-all duration-300 min-h-screen">
          {/* Mobile header for sidebar toggle */}
          <header className="lg:hidden bg-white border-b border-gray-200 p-3 sm:p-4 sticky top-[60px] z-40">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={20} className="sm:w-6 sm:h-6" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-orange-600">
                LMS
              </h1>
              <div className="w-8 sm:w-10" />
            </div>
          </header>

          {/* Modals */}
          {showLockModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-sm w-full text-center">
                <h2 className="text-lg sm:text-xl font-semibold text-orange-600 mb-2">
                  Hold on!
                </h2>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  Please complete the previous quiz to unlock this chapter.
                </p>
                <button
                  onClick={handleModalOkay}
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm sm:text-base"
                >
                  Okay
                </button>
              </div>
            </div>
          )}

          {showVideoProgressModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-sm w-full text-center">
                <h2 className="text-lg sm:text-xl font-semibold text-orange-600 mb-2">
                  Almost there!
                </h2>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  Please watch at least 90% of the video before taking the
                  quiz.
                </p>
                <button
                  onClick={() => setShowVideoProgressModal(false)}
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm sm:text-base"
                >
                  Okay
                </button>
              </div>
            </div>
          )}

          {/* Page content */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
            <div className="max-w-7xl mx-auto w-full">
              {/* Breadcrumbs */}
              <nav className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500 flex items-center flex-wrap">
                <Link
                  to="/course"
                  className="hover:text-orange-500 transition-colors"
                >
                  Courses
                </Link>
                <span className="mx-1 sm:mx-2">&gt;</span>
                <Link
                  to={`/course/${Content.id}`}
                  className="hover:text-orange-500 transition-colors truncate"
                >
                  {Content.name}
                </Link>
                <span className="mx-1 sm:mx-2">&gt;</span>
                <span className="text-gray-800 font-semibold truncate">
                  {pageLabelMap[currentPage] || "Content"}
                </span>
              </nav>

              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseContent;
