import { useLocation } from "react-router-dom"
import UserNavbar from "../../components/UserNavbar"
import { userMenuStore } from "../../zustand/userMenuStore";
import { useEffect, useState } from "react";
import { IoIosMale } from "react-icons/io";
import { IoFemaleOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "sonner";

type Questions = {
    question: string,
    options: string[]
}

type singleQuestion = {
    question: string,
    answer: string
}

type finalOutput = {
    type: string,
    overall: string,
    health_suggestions: string[],
    final_outcome: string
}

function DiseaseDetection() {
    const location = useLocation();
    const { isOpen } = userMenuStore();
    const [gender, setGender] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Questions | null>(null);
    const [allAnswers, setAllAnswers] = useState<singleQuestion[] | null | []>(null);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [finalOutput, setFinalOutput] = useState<null | finalOutput>(null);
    const [generatingFinal, setGeneratingFinal] = useState(false);

    const demo = {
        question: 'Are you currently experiencing any health concerns or symptoms?',
        options: [
            'Yes, I have some symptoms.',
            'No, I feel fine.',
            'I have a general health question.',
            "I'd like to schedule a check-up."
        ]
    }

    const sampleFinalOutput: finalOutput = {
        type: "General Health Assessment",
        overall: "The user appears to be in generally good health with no severe symptoms reported.",
        health_suggestions: [
            "Maintain a balanced diet with adequate fruits and vegetables.",
            "Engage in at least 30 minutes of moderate physical activity daily.",
            "Stay hydrated and aim for 7–8 hours of sleep each night.",
            "Schedule regular health check-ups for preventative care."
        ],
        final_outcome: "No immediate medical intervention is required, but following healthy lifestyle practices is recommended."
    };


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflowY = 'hidden';
        }
        else {
            document.body.style.overflowY = 'auto';
        }
    }, [isOpen]);

    const start = async () => {

        if (!name || !gender || !age) {
            toast.error("All fields required");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`http://localhost:5000/api/user/start-detection`, {
                name, gender, age
            }, {
                withCredentials: true
            });

            if (res.status === 200) {
                setCurrentQuestion(res.data.question);
                console.log(res.data.question);
            }
        } catch (err: any) {
            if (err.response.data.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
        }
        finally {
            setLoading(false);
        }
    }

    const nextQuestion = async () => {

        if (!currentAnswer) {
            toast.error("Please select an answer");
            return;
        }

        setAllAnswers(prev => {
            const safeArray: singleQuestion[] = Array.isArray(prev) ? prev : [];

            return [
                ...safeArray,
                {
                    question: currentQuestion?.question ?? "",
                    answer: currentAnswer,
                }
            ];
        });

        const converted = JSON.stringify(allAnswers);

        const msg = toast.loading("Processing...");

        try {
            const res = await axios.post(`http://localhost:5000/api/user/next-question`, {
                name, age, gender, converted
            }, {
                withCredentials: true
            });

            if (res.status === 200) {
                console.log(res.data);

                if (res.data.question.type === 'final') {
                    setGeneratingFinal(true);
                    setTimeout(() => {
                        setFinalOutput(res.data.question);
                    }, 1500);
                }
                setCurrentQuestion(res.data.question);
            }
        } catch (err: any) {
            if (err.response.data.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
        }
        finally {
            toast.dismiss(msg);
            setGeneratingFinal(false);
        }
    }

    return (
        <>
            <div className={`w-full bg-linear-to-br from-white via-white to-orange-200 min-h-screen flex flex-col justify-start items-center relative overflow-hidden pb-10`}>
                <UserNavbar pathname={location.pathname} />

                <div className={`w-full px-5 h-auto flex flex-col justify-start items-center mt-24`}>

                    {/* user details */}
                    <div className={`w-[95%] md:w-[50%] ${currentQuestion === null ? "block" : "hidden"} lg:w-[40%] xl:w-[30%] rounded-xl bg-white shadow-2xl py-3 px-3 flex flex-col justify-start items-center gap-3 relative overflow-hidden`}>

                        <div className={`w-full ${loading ? "block" : "hidden"} h-full flex justify-center items-center absolute top-1/2 -translate-y-1/2`}>
                            <img src="/loading.gif" className="h-20" />
                        </div>

                        <input onChange={(e) => setName(e.target.value)} type="text" className={`${loading ? "hidden" : "block"} w-full bg-gray-100 px-3 py-2 rounded-lg font-Telegraf text-sm outline-none`} placeholder="Enter your name" />
                        <input onChange={(e) => setAge(e.target.value)} type="number" min={5} max={100} className={`${loading ? "hidden" : "block"} w-full bg-gray-100 px-3 py-2 rounded-lg font-Telegraf text-sm outline-none`} placeholder="Enter your age" />
                        <div className={`${loading ? "hidden" : "block"} w-full flex justify-center items-center gap-3`}>
                            <span onClick={() => setGender('male')} className={`w-full text-center ${gender === 'male' ? "bg-linear-to-b from-blue-800 via-blue-600 to-blue-400" : "bg-linear-to-b from-black via-zinc-800 to-zinc-700"} text-white text-sm font-Telegraf rounded-md py-2 flex justify-center items-center gap-2 cursor-pointer active:opacity-85 duration-200 ease-in-out`}>Male <IoIosMale /></span>
                            <span onClick={() => setGender('female')} className={`w-full text-center ${gender === 'female' ? "bg-linear-to-b from-blue-800 via-blue-600 to-blue-400" : "bg-linear-to-b from-black via-zinc-800 to-zinc-700"} text-white text-sm font-Telegraf rounded-md py-2 flex justify-center items-center gap-2 cursor-pointer active:opacity-85 duration-200 ease-in-out`}>Female <IoFemaleOutline /></span>
                        </div>
                        <p onClick={start} className={`${loading ? "hidden" : "block"} w-full text-center text-sm py-2 rounded-md bg-linear-to-t from-orange-700 to-orange-300 text-white font-Telegraf active:scale-95 active:opacity-80 duration-150 ease-in-out cursor-pointer`}>Start Detecting</p>
                    </div>

                    <p className={`w-full ${currentQuestion === null ? "block" : "hidden"} md:w-[60%] lg:w-[50%] px-4 text-center text-[12px] text-black opacity-75 font-Telegraf mt-10 italic`}>Disease detection model doesn't gurantees you for detecting your accurate disease. It was made for understanding possible disease symptoms and provide health suggestions. <br/> <br/> It can make mistakes mistakes so never completely rely on it's outcome. Do validate outcomes before taking any medical step.</p>

                    {/* quiz section */}
                    <div className={`w-full ${currentQuestion === null && finalOutput === null ? "hidden" : "block"} md:w-[50%] lg:w-[40%] rounded-xl bg-white mt-4 shadow-2xl flex flex-col justify-start items-center px-5 py-3`}>
                        <h1 className={`w-full text-start font-Telegraf text-sm lg:text-xl text-black font-semibold`}>{currentQuestion?.question}</h1>

                        <div className={`w-full mt-8 grid grid-cols-1 lg:grid-cols-2 justify-items-center gap-4`}>
                            {currentQuestion?.options.map((opt, index) => {
                                return <span onClick={() => setCurrentAnswer(opt)} key={index} className={`text-sm lg:text-[12px] w-full text-center ${currentAnswer === opt ? "bg-linear-to-b from-blue-800 via-blue-600 to-blue-400 text-white" : "bg-linear-to-b from-gray-50 via-gray-100 to-gray-200"} duration-150 ease-in-out active:opacity-80 cursor-pointer font-Telegraf text-black rounded-md py-2 px-3`}>{opt}</span>
                            })}
                        </div>
                        <p onClick={nextQuestion} className={`w-full mt-5 text-center py-2 bg-linear-to-b from-orange-300 via-orange-400 to-orange-700 rounded-md text-white font-Telegraf text-sm cursor-pointer active:opacity-85 duration-150 ease-in-out`}>Next</p>
                    </div>

                    {/* final loading */}
                    <div className={`w-full ${generatingFinal ? "block" : "hidden"} mt-20 flex flex-col justify-center items-center relative h-auto`}>
                        <img src="/loading.gif" className="h-20" />
                        <p className={`text-black font-Telegraf text-lg`}>Generating Final Response . . . </p>
                    </div>

                    {/* final outcome */}
                    <div className={`w-full ${finalOutput !== null ? "block" : "hidden"} md:w-[60%] h-auto flex flex-col justify-start items-center px-5 py-2`}>
                        <h1 className={`w-full text-center text-4xl bg-linear-to-br from-orange-300 via-orange-500 to-orange-800 bg-clip-text text-transparent font-bold font-Telegraf`}>Final Report</h1>
                        <div className={`w-full h-px bg-linear-to-r from-transparent via-orange-400 to-transparent mt-3 mb-8`} />

                        <p className={`w-full text-center text-lg font-semibold text-black`}>Overall : </p>
                        <p className={`w-full text-center text-sm text-black mb-5`}>{finalOutput?.overall}</p>

                        <p className={`w-full text-center text-lg font-semibold text-black`}>Suggestions : </p>
                        {finalOutput?.health_suggestions.map((item, index) => {
                            return <p key={index} className={`w-full py-2 px-3 bg-orange-100 my-2 rounded-md text-start text-sm text-black`}>{item}</p>
                        })}

                        <p className={`w-full mt-5 text-center text-lg font-semibold text-black`}>Final : </p>
                        <p className={`w-full text-center text-sm text-black`}>{finalOutput?.final_outcome}</p>
                    </div>

                </div>
            </div>
        </>
    )
}

export default DiseaseDetection
