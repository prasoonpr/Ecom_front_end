/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResendOTPMutation, useVerifyUserMutation } from "../../services/userApi";
// import { useDispatch } from "react-redux";
// import { setUser } from "../../redux/userSlice/userSlice";
import LoadingModal from "../LoadingModal";

const VerifyOTP = () => {
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [verifyUser,{isLoading}] = useVerifyUserMutation();
  const [resendOTP] = useResendOTPMutation();
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendEnabled(true);
    }
  }, [timer]);

  const handleResendOTP = async () => {
    setTimer(60);
    setIsResendEnabled(false);
    const email = localStorage.getItem('email');
    try {
      await resendOTP({ email });
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyUser({ otp });
      if ('data' in response) {
         localStorage.setItem('userToken',response.data.accessToken)
        localStorage.removeItem('email');
        navigate('/');
        window.location.reload(); 
      } else if ('error' in response) {
        setError(response.error?.data?.message || 'Verification failed');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };
  if(isLoading){
    return<LoadingModal/>
  }
    return (
      <div className="min-h-screen bg-bodyColor flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Verify OTP</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
           
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Enter 6 digit otp
              </label>
              <div className="relative">
                <input
                  id="otp"
                  name="otp"
                  onChange={(e)=>setOtp(e.target.value)}
                  type="number"
                  required
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-xs"
                  placeholder="Enter your otp"
                />
               
              </div>
              {error&&(<p className="text-red-500 text-xs hover:text-red-300">
                  {error}
                </p>)}
            </div>
            
            <button
              type="submit"
              className="w-35 py-1.5 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
             verify
            </button>
          </form>
         <div className="text-xs text-end">
         {timer > 0 ? (
        <p className="timer"style={{color:"red"}}>Resend OTP in {timer} seconds</p>
      ) : (
        <p className="timer">You can now resend the OTP</p>
      )}
      {isResendEnabled && (<button
        className={'resend-button'}
        onClick={handleResendOTP}
       
      >
        Resend OTP
      </button>)}
         </div>
          
        </div>
      </div>
    );
}

export default VerifyOTP
