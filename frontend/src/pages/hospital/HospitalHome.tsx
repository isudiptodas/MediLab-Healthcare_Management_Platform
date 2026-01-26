import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LuPersonStanding } from "react-icons/lu";
import { FaGraduationCap } from "react-icons/fa";
import { FaRegHospital } from "react-icons/fa";
import { toast } from 'sonner';
import { MdVerifiedUser } from "react-icons/md";

type Doctor = {
  _id: string,
  name: string;
  email: string;
  hospital?: string;
  speciality: string;
  gender?: string;
  verified?: boolean;
  created: Date;
};

function HospitalHome() {

  const [allDoctors, setAllDoctors] = useState<Doctor[] | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[] | null | undefined>(null);
  const [option, setOption] = useState('pending');

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/all-doctors`, {
          withCredentials: true
        });

        console.log(res.data.found);
        setAllDoctors(res.data.found);

        if (res.data.found) {
          const filtered = res.data.found?.filter((doc: Doctor) => {
            return doc.verified === false;
          });

          setFilteredDoctors(filtered);
        }
      } catch (err: any) {
        console.log(err);
      }
    }

    fetchAllDoctors();
  }, [])

  useEffect(() => {
    if (option === 'pending') {
      const filtered = allDoctors?.filter((doc) => {
        return doc.verified === false;
      });

      setFilteredDoctors(filtered);
    }
    else {
      const filtered = allDoctors?.filter((doc) => {
        return doc.verified === true;
      });

      setFilteredDoctors(filtered);
    }
  }, [option]);

  const approveDoctor = async (id: string) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/hospital/approve`, {
        id
      }, { withCredentials: true });

      if(res.status === 200){
        toast.success("Doctor Approved");
      }
    } catch (err: any) {
      if (err.response.data.message) {
        toast.error(err.response.data.message);
      }
      else {
        toast.error("Something went wrong");
      }
    }
  }

  const rejectDoctor = async (id: string) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/hospital/reject`, {
        id
      }, { withCredentials: true });

      if(res.status === 200){
        toast.success("Doctor Removed");
        const filtered = allDoctors?.filter((doc) => {
          return doc._id !== id
        });

        setFilteredDoctors(filtered)
      }
    } catch (err: any) {
      if (err.response.data.message) {
        toast.error(err.response.data.message);
      }
      else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <>
      <div className={`w-full pb-10 min-h-screen relative flex flex-col justify-start items-center overflow-hidden`}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }} className={`w-full border-b-2 border-b-orange-500 text-black text-lg text-center fixed top-0 py-4 lg:py-5 backdrop-blur-2xl bg-white/20 font-Lora`}>MediLab</motion.p>

        <div className={`w-[80%] mt-20 lg:mt-24 pt-3 border-b-2 rounded-b-lg border-b-orange-400 md:w-[50%] lg:w-[30%] flex justify-center items-center gap-3`}>
          <p onClick={() => setOption('pending')} className={`w-full text-center cursor-pointer px-4 py-2 rounded-md ${option === 'pending' ? "bg-orange-400 text-white font-semibold" : "bg-white text-black"} duration-150 ease-in-out text-sm`}>Pending</p>
          <p onClick={() => setOption('verified')} className={`w-full text-center cursor-pointer px-4 py-2 rounded-md ${option === 'verified' ? "bg-orange-400 text-white font-semibold" : "bg-white text-black"} duration-150 ease-in-out text-sm`}>Verified</p>
        </div>

        <div className={`w-full mt-5 h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 px-3 py-5`}>
          {filteredDoctors && filteredDoctors.map((doc, index) => {
            return <div key={index} className={`w-full hover:shadow-xl duration-200 ease-in-out cursor-pointer rounded-lg bg-gray-100 px-3 py-2 h-auto flex flex-col justify-start items-center`}>
              <h1 className={`w-full text-start text-xl font-semibold font-Telegraf`}>{doc.name}</h1>
              <p className={`w-full ${doc.gender ? "block" : "hidden"} text-start text-[12px] flex justify-start items-center gap-2 font-Telegraf`}><LuPersonStanding /> {doc.gender}</p>
              <p className={`w-full ${doc.verified ? "block" : "hidden"} mb-2 text-start text-sm text-green-500 font-semibold flex justify-start items-center gap-1 font-Telegraf`}><MdVerifiedUser className='text-sm'/> Verified</p>
              <p className={`w-full ${doc.speciality ? "block" : "hidden"} text-start text-[12px] flex justify-start items-center gap-2 font-Telegraf`}><FaGraduationCap /> {doc.speciality}</p>
              <p className={`w-full ${doc.hospital ? "block" : "hidden"} text-start text-[12px] flex justify-start items-center gap-2 font-Telegraf`}><FaRegHospital /> {doc.hospital}</p>
              <div className={`w-full ${doc.verified ? "hidden" : "block"} mt-2 flex justify-center items-center gap-3`}>
                <p onClick={() => approveDoctor(doc._id)} className={`w-full bg-teal-500 hover:bg-teal-700 text-white text-center py-2 rounded-md cursor-pointer active:opacity-85 duration-150 active:scale-95`}>Approve ✓</p>
                <p onClick={() => rejectDoctor(doc._id)} className={`w-full bg-red-500 hover:bg-red-700 text-white text-center py-2 rounded-md cursor-pointer active:opacity-85 duration-150 active:scale-95`}>Reject </p>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default HospitalHome
