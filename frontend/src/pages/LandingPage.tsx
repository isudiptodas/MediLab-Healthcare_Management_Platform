import { IoSearch } from "react-icons/io5";
import { FaPerson } from "react-icons/fa6";
import { LuClock } from "react-icons/lu";
import { FaHandHoldingMedical } from "react-icons/fa";
import { MdOutlineLocalPharmacy } from "react-icons/md";
import Marquee from "react-fast-marquee";
import { IoIosMedical } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { MdOutlinePerson2 } from "react-icons/md";
import { motion } from 'framer-motion';
import { IoSparklesSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Activity, useEffect, useState } from "react";
import { speciality } from "../data/speciality";
import { toast } from "sonner";
import axios from "axios";

type Doctor = {
    _id?: string,
    name: string;
    email: string;
    hospital?: string;
    speciality: string;
    gender?: string;
    verified?: boolean;
    created: Date;
};


function LandingPage() {

    const [allDoctors, setAllDoctors] = useState<Doctor[] | null>(null);
    const [genderVisible, setGenderVisible] = useState(false);
    const [specVisible, setSpecVisible] = useState(false);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[] | null>(null);
    const [input, setInput] = useState<string | null>(null);
    const [option, setOption] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const searchDoctor = () => {
        if (!input) {
            toast.error("Enter doctor name");
            return;
        }

        if (allDoctors) {
            const found = allDoctors.filter((doc) => {
                return doc.name.toLowerCase().includes(input.toLowerCase());
            });

            setFilteredDoctors(found);
        }
    }

    useEffect(() => {
        if (allDoctors === null) {
            return;
        }

        if (option === 'male' || option === 'female') {
            const found = allDoctors.filter((doc) => {
                return doc?.gender?.toLowerCase() === option;
            });

            setFilteredDoctors(found);
        }
        else {
            const found = allDoctors.filter((doc) => {
                return doc.speciality.toLowerCase() === option?.toLowerCase();
            });

            setFilteredDoctors(found);
        }
    }, [option]);

    useEffect(() => {
        const fetchAllDoctors = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/all-doctors`);
                
                const filtered = res.data.found.filter((doc: Doctor) => {
                    return doc.verified;
                });
                
                setAllDoctors(filtered);
            } catch (err: any) {
                console.log(err);
            }
        }

        fetchAllDoctors();
    }, []);

    const sendMessage = async () => {
        if(!name || !message || !email){
            toast.error("All fields required");
            return;
        }

        const id = toast.loading("Sending ...");

        try {
            const res = await axios.post(`http://localhost:5000/api/query`, {
                name, email, message
            });

            if(res.status === 201){
                toast.dismiss(id);
                toast.success("Query submitted");
                setName('');
                setEmail('');
                setMessage('');
            }
        } catch (err: any) {
            if(err.response.data.message){
                toast.error(err.response.data.message);
            }
            else{
                toast.error("Something went wrong");
            }
        }
    }

    return (
        <>
            <div className={`w-full h-auto flex flex-col justify-start items-center relative overflow-hidden`}>

                {/* hero section */}
                <div className={`w-full relative h-[60vh] lg:h-screen flex flex-col items-center overflow-hidden rounded-b-4xl`}>
                    <img src="/hero-portrait.png" className={`h-full w-full lg:hidden object-top`} />
                    <img src="/hero-landscape.jpg" className={`h-full w-full hidden lg:block object-top`} />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, ease: 'easeInOut' }} className={`w-full text-black text-lg lg:text-sm text-center absolute top-5 font-Lora`}>MediLab</motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                        className={`w-[80%] md:w-[60%] lg:w-[40%] absolute top-14 lg:top-12 h-px bg-linear-to-r from-transparent via-black to-transparent`}></motion.div>

                    <div className={`w-full bg-linear-to-r from-black to-white bg-clip-text text-transparent absolute top-[43%] md:top-[40%] -translate-y-1/2 flex flex-col justify-center items-center `}>
                        <motion.h1 className={`text-4xl md:text-6xl xl:text-7xl font-Seasons`}>YOUR HEALTH</motion.h1>
                        <motion.h1 className={`text-4xl md:text-6xl xl:text-7xl font-Seasons`}>OUR PRIORITY</motion.h1>
                    </div>

                    <div className={`w-full absolute bottom-10 flex flex-col justify-center items-center md:flex-row gap-2 md:gap-5`}>
                        <Link to='/auth/login' className={`w-auto font-Telegraf text-[14px] flex justify-center items-center gap-2 px-4 py-2 text-black rounded-full bg-white/20 cursor-pointer`}>Enter profile <MdArrowOutward /></Link>
                        <Link to='/auth/register' className={`w-auto font-Telegraf text-[14px] flex justify-center items-center gap-2 px-4 py-1 text-white border-b border-b-white cursor-pointer`}>Create an account <MdOutlinePerson2 /></Link>
                    </div>
                </div>

                {/* main section */}
                <div className={`w-full h-auto flex flex-col justify-start items-center pt-10 mb-8`}>
                    <p className={`w-full font-Telegraf text-[12px] md:text-lg lg:text-[16px] text-center px-5 lg:px-10 text-black`}>Search from a wide range of experienced and qualified doctors across multiple speciality. Filter by name, speciality or gender
                        to find the perfect match for your healthcare needs.</p>

                    <div className={`w-[90%] md:w-[60%] lg:w-[40%] xl:w-[30%] bg-gray-200 h-auto mt-5 md:mt-10 pt-1 rounded-full flex justify-between items-center relative`}>
                        <input onChange={(e) => setInput(e.target.value)} type="text" className={`w-full outline-none rounded-full px-3 py-2 text-[12px] md:text-sm text-black font-Telegraf`} placeholder="Search by name" />
                        <span onClick={searchDoctor} className={`p-2 text-white absolute right-1 top-1 cursor-pointer active:opacity-75 duration-200 ease-in-out rounded-full bg-[#E0A470]`}><IoSearch /></span>
                    </div>
                    <div className={`w-[90%] md:w-[60%] lg:w-[40%] xl:w-[30%] mt-3 flex justify-between items-center gap-3 relative`}>

                        {/* gender option */}
                        <div className={`w-auto z-30 ${genderVisible ? "block" : "hidden"} absolute top-11 left-[8%] md:left-[10%] lg:left-[15%] xl:left-[10%] bg-black text-white rounded-lg flex flex-col justify-center items-center p-2`}>
                            <p onClick={() => { setOption('male'); setGenderVisible(false) }} className={`w-full text-start text-sm lg:text-[12px] font-Telegraf px-5 py-2 rounded-md hover:bg-zinc-700 duration-150 ease-in-out cursor-pointer`}>Male</p>
                            <p onClick={() => { setOption('female'); setGenderVisible(false) }} className={`w-full text-start text-sm lg:text-[12px] font-Telegraf px-5 py-2 rounded-md hover:bg-zinc-700 duration-150 ease-in-out cursor-pointer`}>Female</p>
                        </div>

                        {/* speciality option */}
                        <div className={`w-auto z-30 ${specVisible ? "block" : "hidden"} max-h-[40vh] overflow-y-auto hide-scrollbar absolute top-11 right-0 lg:right-3 xl:right-1 bg-black text-white rounded-lg flex flex-col justify-start items-center p-2`}>
                            {speciality.map((spec, index) => {
                                return <p key={index} onClick={() => { setOption(spec); setSpecVisible(false) }} className={`w-full text-start text-lg lg:text-[12px] font-Telegraf px-5 py-2 rounded-md hover:bg-zinc-700 duration-150 ease-in-out cursor-pointer`}>{spec}</p>
                            })}
                        </div>

                        <span onClick={() => { setGenderVisible(!genderVisible), setSpecVisible(false) }} className={`w-full cursor-pointer py-3 active:opacity-80 duration-200 ease-in-out flex justify-center items-center gap-2 text-white font-Telegraf bg-black rounded-full text-[12px]`}><FaPerson /> Gender</span>
                        <span onClick={() => { setSpecVisible(!specVisible), setGenderVisible(false) }} className={`w-full cursor-pointer py-3 active:opacity-80 duration-200 ease-in-out flex justify-center items-center gap-2 text-white font-Telegraf bg-black rounded-full text-[12px]`}><FaHandHoldingMedical /> Speciality</span>
                    </div>
                </div>

                {/* doctor section */}
                <Activity mode={filteredDoctors !== null ? "visible" : "hidden"}>
                    <div className={`w-full lg:w-[95%] h-auto grid grid-cols-1 md:grid-cols-3 justify-items-center md:justify-items-start gap-4 px-5`}>
                        {filteredDoctors?.map((doc, index) => {
                            return <div key={index} className={`w-full rounded-lg bg-gray-200 flex flex-col justify-start items-center py-4 px-3`}>
                                <h1 className={`w-full text-black text-start font-semibold font-Telegraf text-xl`}>{doc.name}</h1>
                                <p className={`w-full ${doc.speciality ? "block" : "hidden"} text-black text-start font-semibold font-Telegraf text-sm opacity-75 italic`}>{doc.speciality}</p>
                                <p className={`w-full ${doc.gender ? "block" : "hidden"} text-black text-start font-semibold font-Telegraf text-sm opacity-75 italic`}>{doc.gender}</p>
                                <p className={`w-full bg-blue-500 text-white text-center rounded-lg active:opacity-75 duration-150 ease-in-out active:scale-95 cursor-pointer py-3 mt-2`}>More Info</p>
                            </div>
                        })}
                    </div>
                </Activity>

                {/* what we offer */}
                <div className={`w-full flex flex-col justify-start items-center pt-5`}>
                    <h2 className={`w-full text-center font-Telegraf text-black text-3xl font-semibold`}>What we offer</h2>

                    <div className={`w-[90%] mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center gap-3`}>
                        <div className={`w-full cursor-default bg-[#E0A470] p-1 h-auto rounded-xl shadow-lg flex flex-col justify-start items-center relative`}>
                            <div className={`w-full rounded-xl bg-white/25 inset-shadow-xs inset-shadow-orange-500 flex justify-center items-center text-5xl p-5`}><LuClock /></div>
                            <p className={`w-full px-5 text-black text-center text-xl lg:text-lg py-2 font-semibold`}>24/7 Availability</p>
                        </div>
                        <div className={`w-full cursor-default bg-[#E0A470] p-1 h-auto rounded-xl shadow-lg flex flex-col justify-start items-center`}>
                            <div className={`w-full rounded-xl bg-white/25 inset-shadow-xs inset-shadow-orange-500 flex justify-center items-center text-5xl p-5`}><MdOutlineLocalPharmacy /></div>
                            <p className={`w-full px-5 text-black text-center text-xl lg:text-lg py-2 font-semibold`}>In-centre Pharmacy</p>
                        </div>
                        <div className={`w-full cursor-default bg-[#E0A470] p-1 h-auto rounded-xl shadow-lg flex flex-col justify-start items-center`}>
                            <div className={`w-full rounded-xl bg-white/25 inset-shadow-xs inset-shadow-orange-500 flex justify-center items-center text-5xl p-5`}><FaHandHoldingMedical /></div>
                            <p className={`w-full px-5 text-black text-center text-xl lg:text-lg py-2 font-semibold`}>Personal Support</p>
                        </div>
                        <div className={`w-full cursor-default bg-[#E0A470] p-1 h-auto rounded-xl shadow-lg flex flex-col justify-start items-center`}>
                            <div className={`w-full rounded-xl bg-white/25 inset-shadow-xs inset-shadow-orange-500 flex justify-center items-center text-5xl p-5`}><IoSparklesSharp /></div>
                            <p className={`w-full px-5 text-black text-center text-xl lg:text-lg py-2 font-semibold`}>AI Report Scanning</p>
                        </div>
                    </div>
                </div>

                {/* speciality marquee */}
                <div className={`w-full h-auto py-10 md:py-14 relative flex flex-col justify-center items-center gap-5`}>
                    <div className={`w-[30%] z-20 h-full absolute bg-linear-to-r from-white to-transparent left-0`}></div>
                    <Marquee direction="left">
                        {speciality.map((item, index) => {
                            return <div className={`w-auto flex justify-center items-center gap-3`}>
                                <p key={index} className={`w-auto text-4xl font-Telegraf text-black`}>{item}</p>
                                <span className={`text-xl lg:text-2xl mr-3 text-orange-500`}><IoIosMedical /></span>
                            </div>
                        })}
                    </Marquee>
                    <Marquee direction="right">
                        {speciality.map((item, index) => {
                            return <div className={`w-auto flex justify-center items-center gap-3`}>
                                <p key={index} className={`w-auto text-4xl font-Telegraf text-black`}>{item}</p>
                                <span className={`text-xl lg:text-2xl mr-3 text-orange-500`}><IoIosMedical /></span>
                            </div>
                        })}
                    </Marquee>
                    <div className={`w-[30%] z-20 h-full absolute bg-linear-to-l from-white to-transparent right-0`}></div>
                </div>

                <div className={`w-full`}><img src="/doctor-hand.png" className={`h-full w-full`} /></div>

                {/* footer */}
                <div className={`w-full pt-5 md:pt-14 pb-10 mt-20 flex flex-col md:flex-row justify-center items-center relative h-auto bg-zinc-950 rounded-t-2xl`}>
                    <p className={`w-full text-lg text-white lg:text-sm text-center absolute top-5 font-Lora`}>MediLab</p>
                    <div className={`w-[80%] md:w-[60%] lg:w-[40%] absolute top-14 lg:top-12 h-px bg-linear-to-r from-transparent via-white to-transparent`}></div>

                    <div className={`w-full md:w-[40%] flex justify-center items-start mt-14 md:mt-5 px-5 gap-10 xl:gap-16`}>
                        <div className={`w-auto flex flex-col justify-start items-start pt-5`}>
                            <p className={`text-white font-semibold text-lg xl:text-2xl mb-3`}>General</p>
                            <p className={`text-gray-200 text-[12px] lg:text-sm cursor-pointer`}>About</p>
                            <p className={`text-gray-200 text-[12px] lg:text-sm cursor-pointer`}>Services</p>
                            <p className={`text-gray-200 text-[12px] lg:text-sm cursor-pointer`}>Login</p>
                            <p className={`text-gray-200 text-[12px] lg:text-sm cursor-pointer`}>Register</p>
                        </div>
                        <div className={`w-auto flex flex-col justify-start items-start pt-5`}>
                            <p className={`text-white font-semibold text-lg xl:text-2xl mb-3`}>Legal</p>
                            <p className={`text-gray-200 text-[12px] lg:text-sm cursor-pointer`}>Privacy</p>
                            <p className={`text-gray-200 text-[12px] lg:text-sm cursor-pointer`}>Terms</p>
                            <p className={`text-gray-200 text-[12px] lg:text-sm cursor-pointer`}>License</p>
                            <p className={`text-gray-200 text-[12px] lg:text-sm cursor-pointer`}>Contact</p>
                        </div>
                    </div>

                    {/* message form */}
                    <div className={`w-full md:w-[50%] xl:w-[40%] mt-7 md:mt-10 px-5 flex flex-col justify-start items-center gap-2`}>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" className={`w-full px-3 py-2 rounded-full bg-zinc-800 outline-none font-Telegraf text-white text-[12px] lg:text-[14px]`} placeholder="Enter your name" />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={`w-full px-3 py-2 rounded-full bg-zinc-800 outline-none font-Telegraf text-white text-[12px] lg:text-[14px]`} placeholder="Enter your email" />
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className={`w-full h-32 px-3 py-1 rounded-xl bg-zinc-800 outline-none font-Telegraf text-white text-[12px] lg:text-[14px]`} placeholder="Enter your message" />
                        <p onClick={sendMessage} className={`w-full rounded-full text-center text-black py-2 cursor-pointer active:opacity-80 duration-150 ease-in-out font-bold text-[12px] lg:text-sm bg-linear-to-r from-[#ecbd97] to-[#974e03]`}>Send</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingPage