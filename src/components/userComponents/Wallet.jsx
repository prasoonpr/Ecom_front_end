import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGetWalletQuery } from "../../services/userApi";

const Wallet = () => {
 const {data}= useGetWalletQuery()
 const [wallet,setWallet]=useState([])

 useEffect(()=>{
    if(data?.wallet){
        setWallet({...data.wallet})
    }
 },[data])
 
    // const handleAddFunds = () => {
    //   const amount = 100 // For demonstration, we're adding a fixed amount
    //   setBalance(prevBalance => prevBalance + amount)
    //   setTransactions(prevTransactions => [
    //     { id: Date.now(), description: 'Added Funds', amount: amount, date: new Date().toISOString().split('T')[0] },
    //     ...prevTransactions
    //   ])
    // }
  
    return (
      <div className="w-full bg-white shadow-md  rounded-sm py-12 px-4 sm:px-6 lg:px-8 ml-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white  rounded-sm overflow-hidden"
        >
          <div className=" px-6 py-4">
            <h1 className="text-3xl font-bold text-navbarColor">My Wallet</h1>
          </div>
  
          <div className="p-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-green-100 rounded-lg p-6 mb-6"
            >
              <h2 className="text-2xl font-semibold text-green-800">Balance</h2>
              <p className="text-4xl font-bold text-green-600">₹{wallet.balance_amount}</p>
            </motion.div>
  
            <motion.button
            //   whileHover={{ scale: 1.05 }}
            //   whileTap={{ scale: 0.95 }}
              className="w-full bg-navbarColor text-white font-bold py-3 px-4 rounded-lg mb-6 "
            //   onClick={handleAddFunds}
            >
              Add Funds
            </motion.button>
  
            <div>
              <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
              <ul className="divide-y divide-gray-200">
                {wallet?.data?.map((transaction,index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="py-4"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-lg font-medium text-gray-800">{transaction.item}</p>
                        <p className="text-sm text-gray-500">order_id: {transaction.order_id}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                      <p className={`text-lg font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount >= 0 ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    )
}

export default Wallet
