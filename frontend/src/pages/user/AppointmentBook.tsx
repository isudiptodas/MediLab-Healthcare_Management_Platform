import axios from "axios";
import { useEffect, useState } from "react"
import UserNavbar from "../../components/UserNavbar";
import { useLocation } from "react-router-dom";
import { userMenuStore } from "../../zustand/userMenuStore";
import { speciality } from "../../data/speciality";
import { toast } from "sonner";
import { IoSearch } from "react-icons/io5";
import { FaPerson } from "react-icons/fa6";
import { FaHandHoldingMedical } from "react-icons/fa";
import { PiPersonSimpleFill } from "react-icons/pi";
import { LuStethoscope } from "react-icons/lu";

type Doctor = {
  _id: string,
  name: string;
  email: string;
  hospital?: string;
  speciality: string;
  gender?: string;
  verified?: boolean;
  image?: string,
  created: Date;
};

function AppointmentBook() {

  const [allDoctors, setAllDoctors] = useState<Doctor[] | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[] | null | undefined>(null);
  const location = useLocation();
  const { isOpen } = userMenuStore();
  const [genderVisible, setGenderVisible] = useState(false);
  const [specVisible, setSpecVisible] = useState(false);
  const [input, setInput] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState<string | null>(null);
  const [popupData, setPopupData] = useState<Doctor | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const [availableSlots, setAvailableSlots] = useState<string[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');

  const maxDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  })();

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
    if (isOpen) {
      document.body.style.overflowY = 'hidden';
    }
    else {
      document.body.style.overflowY = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/all-doctors`, {
          withCredentials: true
        });

        setAllDoctors(res.data.found);

        if (res.data.found) {
          const filtered = res.data.found?.filter((doc: Doctor) => {
            return doc.verified === true;
          });

          setFilteredDoctors(filtered);
        }
      } catch (err: any) {
        console.log(err);
      }
    }

    fetchAllDoctors();
  }, []);

  const checkSlots = async () => {
    if (!appointmentDate) {
      toast.error("Select a date");
      return;
    }

    const msg = toast.loading("Checking available slots...");

    try {
      const res = await axios.post(`http://localhost:5000/api/user/check-slot`, {
        date: appointmentDate, doctorName: popupData?.name
      }, { withCredentials: true });

      setAvailableSlots(res.data.slots);

    } catch (err: any) {
      console.log(err);
    }
    finally {
      toast.dismiss(msg);
    }
  }

  const bookAppointment = async () => {
    if (!appointmentDate) {
      toast.error("Select a date");
      return;
    }

    const msg = toast.loading("Booking...");

    try {
      const res = await axios.post(`http://localhost:5000/api/user/book-appointment`, {
        date: appointmentDate, doctorName: popupData?.name, doctorEmail: popupData?.email, timeSlot: selectedSlot
      }, { withCredentials: true });

     if(res.status === 200){
      setPopupVisible(false);
      toast.success("Appointment Booked");
     }

      console.log(res);
    } catch (err: any) {
      console.log(err);
    }
    finally {
      toast.dismiss(msg);
    }
  }

  return (
    <>
      <div className={`w-full flex flex-col justify-start items-center relative overflow-hidden min-h-screen`}>
        <UserNavbar pathname={location.pathname} />

        <div className={`w-full mt-24 flex flex-col justify-start items-center`}>
          <h1 className={`w-full text-center text-2xl text-black font-Telegraf font-semibold`}>Book an appointment</h1>
        </div>

        {/* doctor search option */}
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

        {/* doctor list */}
        <div className={`w-full h-auto px-5 pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-4`}>
          {filteredDoctors?.map((doc, index) => {
            return <div key={index} className={`w-full px-3 py-2 rounded-lg bg-gray-200 p-1 flex flex-col justify-start items-center`}>
              <h1 className={`w-full text-black text-start font-semibold font-Telegraf text-xl`}>{doc.name}</h1>
              <p className={`w-full ${doc.speciality ? "block" : "hidden"} text-black text-start font-semibold font-Telegraf text-sm opacity-75 italic`}>{doc.speciality}</p>
              <p className={`w-full ${doc.gender ? "block" : "hidden"} text-black text-start font-semibold font-Telegraf text-sm opacity-75 italic`}>{doc.gender}</p>
              <p onClick={() => { setPopupData(doc); setPopupVisible(true); }} className={`w-full bg-blue-500 text-white text-center rounded-lg active:opacity-75 duration-150 ease-in-out active:scale-95 cursor-pointer py-3 mt-2`}>Book Appointment</p>
            </div>
          })}
        </div>

        {/* booking popup */}
        <div onClick={() => { setPopupVisible(false); setPopupData(null) }} className={`w-full h-screen fixed top-0 z-30 flex justify-center items-center bg-black/50 ${popupVisible ? "block" : "hidden"}`}>
          <div onClick={(e) => e.stopPropagation()} className={`w-[95%] md:w-[60%] lg:w-[40%] h-auto flex flex-col justify-start items-center rounded-lg bg-white py-2 px-3 overflow-y-auto hide-scrollbar`}>
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yfGVufDB8fDB8fHww" className={`h-full ${popupData?.image ? "block" : "hidden"} md:h-60 w-full object-cover rounded-lg`} />
            <h1 className={`w-full text-black text-start font-semibold font-Telegraf mt-2 text-xl`}>{popupData?.name || 'unknown'}</h1>
            <p className={`w-full ${popupData?.speciality ? "block" : ""} text-black text-start font-Telegraf flex justify-start items-center gap-1 text-sm opacity-75 italic`}><LuStethoscope /> {popupData?.speciality || 'unknown'}</p>
            <p className={`w-full ${popupData?.gender ? "block" : ""} text-black text-start font-Telegraf flex justify-start items-center gap-1 text-sm opacity-75 italic`}><PiPersonSimpleFill /> {popupData?.gender || 'unknown'}</p>
            <p className={`w-full text-black text-start font-Telegraf text-sm opacity-75 italic mt-2`}>Select a date :</p>

            <input onChange={(e) => setAppointmentDate(e.target.value)} type="date" min={today} max={maxDate} className={`w-full my-2 px-4 font-Telegraf bg-gray-100 rounded-md py-2`} />
            <p onClick={checkSlots} className={`w-full ${availableSlots ? "hidden" : "block"} mt-2 py-2 rounded-md bg-orange-300 text-center font-Telegraf text-sm font-semibold active:scale-95 active:opacity-75 duration-150 ease-in-out cursor-pointer`}>Check Available Slots</p>

            <div className={`w-full my-2 grid grid-cols-2 md:grid-cols-4 justify-items-center gap-3`}>
              {availableSlots && availableSlots.map((item, index) => {
                return <p onClick={() => setSelectedSlot(item)} key={index} className={`w-full text-[12px] lg:text-[10px] text-center font-Telegraf px-3 py-2 rounded-md ${selectedSlot === item ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out cursor-pointer`}>{item}</p>
              })}
            </div>
            <p onClick={bookAppointment} className={`w-full ${selectedSlot ? "block" : "hidden"} mt-2 py-2 rounded-md bg-orange-300 text-center font-Telegraf text-sm font-semibold active:scale-95 active:opacity-75 duration-150 ease-in-out cursor-pointer`}>Book Appointment</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AppointmentBook