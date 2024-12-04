import { motion } from 'framer-motion'
const LoadingModal = () => {
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-32 h-32">
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M50 10 L75 50 L50 90 L25 50 Z"
                  stroke="#FFD700"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl text-yellow-400 font-semibold tracking-wide">GD</span>
            </div>
          </div>
        </div>
      );

}

export default LoadingModal
