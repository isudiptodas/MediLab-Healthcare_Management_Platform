import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { userMenuStore } from '../../zustand/userMenuStore';
import UserNavbar from '../../components/UserNavbar';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LuChevronsUpDown } from "react-icons/lu";

interface Appointment {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  doctorEmail: string;
  appointmentDate: Date;
  timeSlot: string;
  created?: Date;
}


function Home() {

  const location = useLocation();
  const { isOpen } = userMenuStore();
  const [allAppointments, setAllAppointments] = useState<null | Appointment[]>(null);
  const [appointmentOption, setAppointmentOption] = useState('upcoming');
  const [optionVisible, setOptionVisible] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState<null | Appointment[] | undefined>(null);
  const [presentAppointments, setPresentAppointments] = useState<null | Appointment[] | undefined>(null);
  const [pastAppointments, setPastAppointments] = useState<null | Appointment[] | undefined>(null);
  const [futureAppointments, setFutureAppointments] = useState<null | Appointment[] | undefined>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = 'hidden';
    }
    else {
      document.body.style.overflowY = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/get-all-appointments`, {
          withCredentials: true
        });

        setAllAppointments(res.data.found);

        const filtered = res.data.found.filter((item: Appointment) => {
          const appointmentDate = new Date(item.appointmentDate);
          appointmentDate.setHours(0, 0, 0, 0);

          return appointmentDate > today;
        });

        setFilteredAppointments(filtered);

      } catch (err: any) {
        console.log(err);
      }
    }

    fetchAllAppointments();
  }, []);

  useEffect(() => {
    if (appointmentOption === 'today') {
      const filtered = allAppointments?.filter((item: Appointment) => {
        const appointmentDate = new Date(item.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);

        return appointmentDate.getTime() === today.getTime();
      });

      setFilteredAppointments(filtered);
    }
    if (appointmentOption === 'past') {
      const filtered = allAppointments?.filter((item: Appointment) => {
        const appointmentDate = new Date(item.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);

        return appointmentDate < today;
      });

      setFilteredAppointments(filtered);
    }
    if (appointmentOption === 'upcoming') {
      const filtered = allAppointments?.filter((item: Appointment) => {
        const appointmentDate = new Date(item.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);

        return appointmentDate > today;
      });

      setFilteredAppointments(filtered);
    }
  }, [appointmentOption]);

  useEffect(() => {
    const filteredToday = allAppointments?.filter((item: Appointment) => {
      const appointmentDate = new Date(item.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);

      return appointmentDate.getTime() === today.getTime();
    });

    setPresentAppointments(filteredToday);

    const filteredPast = allAppointments?.filter((item: Appointment) => {
      const appointmentDate = new Date(item.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);

      return appointmentDate < today;
    });

    setPastAppointments(filteredPast);

    const filteredFuture = allAppointments?.filter((item: Appointment) => {
      const appointmentDate = new Date(item.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);

      return appointmentDate > today;
    });

    setFutureAppointments(filteredFuture);
  }, [allAppointments]);

  const formatDate = (dateInput: Date | string) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const penguinVisible = () => {
    if(appointmentOption === 'past' && pastAppointments?.length === 0) return true;
    if(appointmentOption === 'upcoming' && futureAppointments?.length === 0) return true;
    if(appointmentOption === 'today' && presentAppointments?.length === 0) return true;
    return false;
  }

  return (
    <>
      <div className={`w-full min-h-screen relative flex flex-col justify-start items-center overflow-y-auto hide-scrollbar`}>
        <UserNavbar pathname={location.pathname} />

        <h1 className={`w-full text-center mt-20 md:mt-24 text-black text-2xl font-Telegraf font-semibold`}>Manage Appointments</h1>
        <motion.div
          onClick={() => setOptionVisible(!optionVisible)}
          animate={{ height: optionVisible ? "135px" : "50px" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`w-[95%] md:hidden flex justify-between items-start py-3 px-3 border border-orange-500 rounded-md bg-white shadow-lg mt-5 overflow-hidden relative`}>
          <p className={`font-Telegraf text-lg text-orange-400 font-semibold capitalize`}>{appointmentOption}</p>
          <span><LuChevronsUpDown /></span>

          <div className={`absolute top-12 w-full flex flex-col justify-start items-center`}>
            <p onClick={() => { setAppointmentOption('past'); setOptionVisible(false) }} className={`w-full ${appointmentOption === 'past' ? "hidden" : "block"} py-1 text-start capitalize text-lg font-Telegraf`}>Past</p>
            <p onClick={() => { setAppointmentOption('upcoming'); setOptionVisible(false) }} className={`w-full ${appointmentOption === 'upcoming' ? "hidden" : "block"} py-1 text-start capitalize text-lg font-Telegraf`}>Upcoming</p>
            <p onClick={() => { setAppointmentOption('today'); setOptionVisible(false) }} className={`w-full ${appointmentOption === 'today' ? "hidden" : "block"} py-1 text-start capitalize text-lg font-Telegraf`}>Today</p>
          </div>
        </motion.div>

        {/* mobile view */}
        <div className={`w-full px-3 mt-7 md:hidden grid grid-cols-1 justify-items-center gap-4 relative`}>

          <div className={`w-full ${penguinVisible() ? "block" : "hidden"} h-full flex flex-col justify-center items-center`}>
            <div className={`w-full h-full z-20 absolute`}></div>
            <img src="/penguin.jpeg" className={`h-48 z-10 mix-blend-darken opacity-40`} />
            <p className={`font-Telegraf text-xl lg:text-2xl px-4 w-full text-center opacity-45`}>No records found</p>
          </div>

          {filteredAppointments && filteredAppointments.map((item, index) => {
            return <div key={index} className={`w-full bg-gray-200 flex flex-col justify-start items-center rounded-lg py-4 px-4`}>
              <h1 className={`w-full text-start font-Telegraf text-xl font-semibold`}>{item.doctorName}</h1>
              <h1 className={`w-full text-start font-Telegraf text-sm`}>{formatDate(item.appointmentDate)}</h1>
            </div>
          })}
        </div>

        {/* laptop view */}
        <div className={`w-full xl:w-[85%] px-5 mt-7 hidden md:flex justify-between items-start gap-3`}>

          {/* past */}
          <div className={`w-[30%] min-h-auto px-2 py-4 flex flex-col justify-start items-center bg-gray-100 rounded-xl relative overflow-hidden`}>
            <h1 className={`w-full text-center text-xl font-Telegraf`}>Past</h1>
            <div className={`w-[90%] mb-5 h-px bg-linear-to-r from-gray-100 via-black to-gray-100 my-2`} />

            <div className={`w-full ${pastAppointments && pastAppointments?.length > 0 ? "hidden" : "block"} h-full flex flex-col justify-center items-center`}>
              <div className={`w-full h-full bg-transparent z-20 absolute`}></div>
              <img src="/penguin.jpeg" className={`h-48 z-10 mix-blend-darken opacity-40`} />
              <p className={`font-Telegraf text-xl lg:text-2xl px-4 w-full text-center opacity-45`}>No records found</p>
            </div>

            {pastAppointments && pastAppointments.map((app, index) => {
              return <div key={index} className={`w-full rounded-lg bg-white px-3 py-2 flex flex-col justify-start items-center`}>
                <h1 className={`w-full text-start font-semibold font-Telegraf text-lg`}>{app.doctorName}</h1>
                <p className={`w-full text-start font-Telegraf text-sm`}>{formatDate(app.appointmentDate)}</p>
                <p className={`w-full text-start font-Telegraf text-sm`}>{app.timeSlot}</p>
              </div>
            })}
          </div>

          {/* today */}
          <div className={`w-[40%] min-h-auto px-2 py-4 flex flex-col justify-start items-center bg-gray-100 rounded-xl relative overflow-hidden`}>
            <h1 className={`w-full text-center text-xl font-Telegraf`}>Today</h1>
            <div className={`w-[90%] mb-5 h-px bg-linear-to-r from-gray-100 via-black to-gray-100 my-2`} />

            <div className={`w-full ${presentAppointments && presentAppointments?.length > 0 ? "hidden" : "block"} h-full flex flex-col justify-center items-center`}>
              <div className={`w-full h-full bg-transparent z-20 absolute`}></div>
              <img src="/penguin.jpeg" className={`h-48 z-10 mix-blend-darken opacity-40`} />
              <p className={`font-Telegraf text-xl lg:text-2xl px-4 w-full text-center opacity-45`}>No appointments for today</p>
            </div>

            {presentAppointments && presentAppointments.map((app, index) => {
              return <div key={index} className={`w-full rounded-lg bg-white px-3 py-2 flex flex-col justify-start items-center`}>
                <h1 className={`w-full text-start font-semibold font-Telegraf text-lg`}>{app.doctorName}</h1>
                <p className={`w-full text-start font-Telegraf text-sm`}>{formatDate(app.appointmentDate)}</p>
                <p className={`w-full text-start font-Telegraf text-sm`}>{app.timeSlot}</p>
              </div>
            })}
          </div>

          {/* upcoming */}
          <div className={`w-[30%] min-h-auto px-2 py-4 flex flex-col justify-start items-center bg-gray-100 rounded-xl relative overflow-hidden`}>
            <h1 className={`w-full text-center text-xl font-Telegraf`}>Upcoming</h1>
            <div className={`w-[90%] mb-5 h-px bg-linear-to-r from-gray-100 via-black to-gray-100 my-2`} />

            <div className={`w-full ${futureAppointments && futureAppointments?.length > 0 ? "hidden" : "block"} h-full flex flex-col justify-center items-center`}>
              <div className={`w-full h-full bg-transparent z-20 absolute`}></div>
              <img src="/penguin.jpeg" className={`h-48 z-10 mix-blend-darken opacity-40`} />
              <p className={`font-Telegraf text-xl lg:text-2xl px-4 w-full text-center opacity-45`}>No upcoming found</p>
            </div>

            {futureAppointments && futureAppointments.map((app, index) => {
              return <div key={index} className={`w-full rounded-lg bg-white px-3 py-2 flex flex-col justify-start items-center`}>
                <h1 className={`w-full text-start font-semibold font-Telegraf text-lg`}>{app.doctorName}</h1>
                <p className={`w-full text-start font-Telegraf text-sm`}>{formatDate(app.appointmentDate)}</p>
                <p className={`w-full text-start font-Telegraf text-sm`}>{app.timeSlot}</p>
              </div>
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home