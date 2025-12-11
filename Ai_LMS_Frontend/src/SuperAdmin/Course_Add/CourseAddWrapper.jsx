// import { useState, useEffect } from "react";
// import AddCourse from "./Addcourse";
// import AddChapter from "./AddChapter";
// import Documents from "./Documents";
// import AddQuiz from "./AddQuiz";

// function AddCourseWizard({ onClose, isFormComplete }) {
//     const steps = ["Add New Course", "Add Chapter", "Add Contents", "Add Quiz"];

//     const [step, setStep] = useState(1);
//     const [currentStepCompleted, setCurrentStepCompleted] = useState(false);
//     const [courseSubmitted, setCourseSubmitted] = useState(false);
//     const [submitCourseFn, setSubmitCourseFn] = useState(null);

//     const nextStep = () => {
//         if (step < steps.length) {
//             setStep(step + 1);
//             setCurrentStepCompleted(false);
//         }
//     };

//     const prevStep = () => {
//         if (step > 1) {
//             setStep(step - 1);
//             setCurrentStepCompleted(true);
//         }
//     };

//     const renderStep = () => {
//         switch (step) {
//             case 1:
//                 return (
//                     <AddCourse
//                         onSuccess={() => {
//                             setCourseSubmitted(true);
//                             setCurrentStepCompleted(true);
//                         }}
//                         onRegisterSubmitHandler={(fn) => setSubmitCourseFn(() => fn)}
//                     />
//                 );

//             case 2:
//                 return <AddChapter onSuccess={() => setCurrentStepCompleted(true)} />;
//             case 3:
//                 return <Documents onSuccess={() => setCurrentStepCompleted(true)} />;
//             case 4:
//                 return (
//                     <AddQuiz
//                         onSuccess={onClose}
//                         goToChapterStep={() => setStep(2)}
//                     />
//                 );
//             default:
//                 return null;
//         }
//     };

//     // ESC close
//     useEffect(() => {
//         const escHandler = (e) => {
//             if (e.key === "Escape") onClose();
//         };
//         window.addEventListener("keydown", escHandler);
//         return () => window.removeEventListener("keydown", escHandler);
//     }, [onClose]);

//     // Click outside closes modal
//     const handleOutsideClick = (e) => {
//         if (e.target === e.currentTarget) onClose();
//     };

//     return (
//         <div
//             onClick={handleOutsideClick}
//             className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 animate-fadeIn"
//         >
//             <div className="bg-white w-full max-w-7xl h-[90vh] rounded-2xl shadow-xl relative flex flex-col border border-orange-200 animate-scaleIn">

//                 {/* Header */}
//                 <div className="p-4 flex items-center justify-between border-b border-orange-200 bg-orange-50/40 rounded-t-2xl">

//                     {/* LEFT → Topic Name */}
//                     <div className="text-lg font-semibold text-orange-700">
//                         {steps[step - 1]}
//                     </div>

//                     {/* CENTER → Step Counter */}
//                     <div className="absolute left-1/2 -translate-x-1/2 text-orange-700 font-bold text-lg">
//                         Step {step} of {steps.length}
//                     </div>

//                     {/* RIGHT → Back & Next Buttons */}
//                     {/* <div className="flex gap-3">
//                         <button
//                             onClick={prevStep}
//                             disabled={step === 1}
//                             className={`px-5 py-2 rounded-md font-medium transition ${step === 1
//                                     ? "bg-orange-200 text-orange-400 cursor-not-allowed"
//                                     : "bg-orange-100 hover:bg-orange-200 text-orange-800"
//                                 }`}
//                         >
//                             Back
//                         </button>

//                         {step < steps.length && (
//                             <button
//                                 onClick={nextStep}
//                                 disabled={!currentStepCompleted}
//                                 className={`px-5 py-2 rounded-md font-medium transition ${currentStepCompleted
//                                         ? "bg-orange-600 text-white hover:bg-orange-700"
//                                         : "bg-orange-200 text-orange-400 cursor-not-allowed"
//                                     }`}
//                             >
//                                 Next
//                             </button>
//                         )}
//                     </div> */}
//                     <div className="flex gap-3">

//                         {/* Back button */}
//                         {step > 1 ? (
//                             <button
//                                 onClick={prevStep}
//                                 disabled={step === 1}
//                                 className={`px-5 py-2 rounded-md font-medium transition ${step === 1
//                                     ? "bg-orange-200 text-orange-400 cursor-not-allowed"
//                                     : "bg-orange-100 hover:bg-orange-200 text-orange-800"
//                                     }`}
//                             >
//                                 Back
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={onClose}
//                                 disabled={step === 1}
//                                 className="px-5 py-1 rounded-md font-medium bg-gray-300 text-black"
//                             >
//                                 Close
//                             </button>
//                         )}

//                         {/* ⭐ STEP 1 SUBMIT BUTTON */}
//                         {/* STEP 1: SHOW SUBMIT BUTTON BEFORE SUBMISSION */}
//                         {step === 1 && !courseSubmitted && (
//                             <button
//                                 onClick={() => submitCourseFn && submitCourseFn()}
//                                 disabled={!isFormComplete}
//                                 className="px-5 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700"
//                             >
//                                 Submit
//                             </button>
//                         )}

//                         {/* AFTER SUBMIT → SHOW NEXT BUTTON */}
//                         {step === 1 && courseSubmitted && (
//                             <button
//                                 onClick={nextStep}
//                                 className="px-5 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700"
//                             >
//                                 Next
//                             </button>
//                         )}


//                         {/* ⭐ For Step 2,3 */}
//                         {step > 1 && step < 4 && (
//                             <button
//                                 onClick={nextStep}
//                                 disabled={!currentStepCompleted}
//                                 className={`px-5 py-2 rounded-md font-medium transition ${currentStepCompleted
//                                     ? "bg-orange-600 text-white hover:bg-orange-700"
//                                     : "bg-orange-200 text-orange-400 cursor-not-allowed"
//                                     }`}
//                             >
//                                 Next
//                             </button>
//                         )}

//                     </div>
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1 overflow-auto">
//                     {renderStep()}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AddCourseWizard;



import { useState, useEffect } from "react";
import AddCourse from "./Addcourse";
import AddChapter from "./AddChapter";
import Documents from "./Documents";
// import AddQuiz from "./AddQuiz";

function AddCourseWizard({ onClose, isFormComplete }) {
    const steps = ["Course", "Chapter", "Content"];

    const [step, setStep] = useState(1);
    const [currentStepCompleted, setCurrentStepCompleted] = useState(false);
    const [courseSubmitted, setCourseSubmitted] = useState(false);
    const [submitCourseFn, setSubmitCourseFn] = useState(null);



    const handleTabClick = (tabIndex) => {
        const targetStep = tabIndex + 1;
        setStep(targetStep);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <AddCourse
                        onSuccess={() => {
                            setCourseSubmitted(true);
                            setCurrentStepCompleted(true);
                        }}
                        onRegisterSubmitHandler={(fn) => setSubmitCourseFn(() => fn)}
                    />
                );
            case 2:
                return (
                    <AddChapter onSuccess={() => setCurrentStepCompleted(true)} />
                );
            case 3:
                return (
                    <Documents onSuccess={() => setCurrentStepCompleted(true)} />
                );
            // case 4:
            //     return (
            //         <AddQuiz
            //             onSuccess={onClose}
            //             goToChapterStep={() => setStep(2)}
            //         />
            //     );
            default:
                return null;
        }
    };

    // ESC close
    useEffect(() => {
        const escHandler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", escHandler);
        return () => window.removeEventListener("keydown", escHandler);
    }, [onClose]);

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            onClick={handleOutsideClick}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 animate-fadeIn"
        >
            <div className="bg-white w-full max-w-7xl h-[90vh] rounded-2xl shadow-xl relative flex flex-col border border-orange-200 animate-scaleIn">

                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-orange-200 bg-orange-50/40 rounded-t-2xl">

                    {/* Title */}
                    <div className="text-lg font-semibold text-orange-700">
                        Course Panel
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 bg-orange-100 rounded-full px-3 py-1">
                        {steps.map((label, index) => {
                            const tabStep = index + 1;
                            const isActive = tabStep === step;
                            return (
                                <button
                                    key={label}
                                    onClick={() => handleTabClick(index)}
                                    className={[
                                        "px-4 py-1 rounded-full text-sm font-medium transition",
                                        isActive
                                            ? "bg-orange-600 text-white shadow-sm"
                                            : "bg-transparent text-orange-700 hover:bg-orange-200",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="hover:scale-110 mx-4 text-2xl font-medium text-black"
                        >
                            X
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
}

export default AddCourseWizard;
