import { motion } from 'framer-motion';

function Home() {
  return (
    <>
      <div className={`w-full min-h-screen relative flex flex-col justify-start items-center overflow-hidden`}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }} className={`w-full text-black text-lg lg:text-sm text-center absolute top-5 font-Lora`}>MediLab</motion.p>
        
      </div>
    </>
  )
}

export default Home