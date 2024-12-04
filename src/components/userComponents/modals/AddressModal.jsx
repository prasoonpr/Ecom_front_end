/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useSetDefaultAddressMutation } from "../../../services/userApi"

const AddressModal = ({onClose,addresses,}) => {
  const [setDefault]=useSetDefaultAddressMutation()

    //for setting default address
    const setDefaultAddress=async(address_id)=>{
      const response=await setDefault({address_id})
      if(response.data){
        // toast.success(response.data.message)
      }
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center  z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900" id="modal-title">Select Address</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            {addresses.map((address,index)=>(
            <div key={index} className="h-32 p-4 w-full mb-1  border-2 text-sm font-semibold flex gap-2">
                <div>
                    <input 
                    value={address._id}
                    checked={address.defaultAddress.status}
                    className="cursor-pointer"
                    onChange={(e)=>{setDefaultAddress(e.target.value)}}
                    type="radio" />
                </div>
                <div className="flex flex-col">
                {address.name},<br />
                {address.phone},{address.pincode},{address.locality},<br />
                {address.address},{address.city},{address.state},
                {address.landmark},<br /><br />
                Address Type:-{address.addressType}
                </div>
            </div>
            ))}
          
          </div>
        </div>
      )
}

export default AddressModal
