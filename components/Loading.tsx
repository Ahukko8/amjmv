import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex flex-col gap-5 justify-center items-center min-h-screen bg-gray-100">
      <motion.div
        className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <p>ލޯޑިން</p>
    </div>
  );
};

export default Loading;
