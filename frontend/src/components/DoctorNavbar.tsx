import { CiMenuBurger } from "react-icons/ci";
import { MdOutlineClose } from "react-icons/md";
import { doctorMenuStore } from "../zustand/doctorMenuStore";
import { Link } from "react-router-dom";

function DoctorNavbar({ pathname }: { pathname: string }) {

    const { isOpen, toggleMenu } = doctorMenuStore();

    return (
        <>
            {/* navbar */}
            <div className={`w-full z-30 fixed flex justify-center items-center lg:justify-between lg:px-5 py-4 lg:py-2 border-b-2 border-b-orange-400 backdrop-blur-2xl bg-white/20`}>
                <Link to='/' className={`w-full lg:w-[10%] text-black text-lg text-center font-Lora`}>MediLab</Link>
                <span onClick={toggleMenu} className={`w-auto lg:hidden rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-white text-lg absolute right-5 p-2`}><CiMenuBurger /></span>

                <div className={`w-auto hidden lg:flex justify-center items-center gap-3`}>
                    <p className={`w-auto border-b-2 px-5 py-2 rounded-md ${pathname === '/doctor/home' ? "border-b-orange-400 text-orange-400 font-semibold" : "border-b-transparent text-black"} hover:bg-gray-100 duration-200 ease-in-out cursor-pointer`}>Home</p>
                    <p className={`w-auto border-b-2 px-5 py-2 rounded-md ${pathname === '/doctor/profile' ? "border-b-orange-400 text-orange-400 font-semibold" : "border-b-transparent text-black"} hover:bg-gray-100 duration-200 ease-in-out cursor-pointer`}>Profile</p>
                    <p className={`w-auto border-b-2 px-5 py-2 rounded-md ${pathname === '/doctor/settings' ? "border-b-orange-400 text-orange-400 font-semibold" : "border-b-transparent text-black"} hover:bg-gray-100 duration-200 ease-in-out cursor-pointer`}>Settings</p>
                </div>
            </div>

            {/* menu sidebar */}
            <div className={`w-[80%] md:w-[50%] ${isOpen ? "translate-x-0" : "translate-x-full"} duration-300 ease-in-out rounded-l-3xl top-0 right-0 fixed flex flex-col justify-start items-center shadow-2xl h-screen bg-white z-30`}>

                <span onClick={toggleMenu} className={`w-auto rounded-full text-black text-xl absolute right-5 p-2 top-2`}><MdOutlineClose /></span>

                <Link to='/' className={`w-full text-black text-lg py-3 text-center font-Lora`}>MediLab</Link>
                <div className={`w-[90%] mb-8 h-0.5 bg-linear-to-r from-white via-orange-400 to-white`}></div>

                <p className={`w-full text-start font-Telegraf text-2xl px-4 py-2 ${pathname === '/doctor/home' ? "text-orange-400 font-semibold" : "text-black font-normal"}`}>Home</p>
                <p className={`w-full text-start font-Telegraf text-2xl px-4 py-2 ${pathname === '/doctor/profile' ? "text-orange-400 font-semibold" : "text-black font-normal"}`}>Profile</p>
                <p className={`w-full text-start font-Telegraf text-2xl px-4 py-2 ${pathname === '/doctor/settings' ? "text-orange-400 font-semibold" : "text-black font-normal"}`}>Settings</p>
            </div>
        </>
    )
}

export default DoctorNavbar
