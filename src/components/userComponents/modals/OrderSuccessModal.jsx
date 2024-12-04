import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const OrderSuccessModal = () => {
  const navigate=useNavigate()
  const [isVisible, setIsVisible] = useState(true)



  const handleGoToOrderHistory = () => {
    setIsVisible(false)
    navigate('/account/orders')
  }

  const handleContinueShopping = () => {
    setIsVisible(false)
    navigate('/products')
  }

  if (!isVisible) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bodyColor z-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Woohoo! Order Placed!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          Get ready for some awesome goodies coming your way!
        </motion.p>
        <div className="flex flex-col gap-4">
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleGoToOrderHistory}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <Clock className="w-5 h-5 mr-2" />
            View Order History
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleContinueShopping}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Continue Shopping
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}


export default OrderSuccessModal