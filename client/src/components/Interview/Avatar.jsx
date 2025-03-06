import React from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

const Avatar = () => {
  return (
    <motion.div
      className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center"
      animate={{ opacity: [0, 1], scale: [0.9, 1] }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
        {/* Placeholder for AI Avatar */}
        <Mic className="text-white animate-pulse" size={40} />
      </div>
    </motion.div>
  );
};

export default Avatar;
