import  { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { validateRegisterForm } from "../../utils/user/FormValidation";
import { useCheckUserMutation } from "../../services/userApi";
import LoadingModal from "../LoadingModal";

const Signup = () => {
  const [checkUser,{isLoading}]=useCheckUserMutation()
  const navigate=useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [truePass, setTruePass] = useState(false);
    const [confirmPassword,setConfirmPassword]=useState('')
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

  // for handle form
    const handleForm = async (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

  //for handle password
    const handlePass = async (e) => {
      const setpass = await e.target.value;
      setConfirmPassword(setpass)
      if (setpass == form.password) {
        setTruePass(false);
      } else {
        setTruePass(true);
      }
    };

  // for password visibility
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };
  
  // for handle submit
    const handleSubmit = async (e) => {
      e.preventDefault();

      const error = validateRegisterForm(form);
      if (Object.keys(error).length > 0) {
        return setErrors(error);
      }else{
        setErrors('')
      }
       if(confirmPassword==''){
        setTruePass(true);
      }

     try {
      const response=await checkUser(form)
      console.log(response);
      
      if ('error' in response) {
        setErrors(prevErrors => ({
          ...prevErrors,
          email: response.error?.data?.message || 'Something went wrong',
        }));
      } else {
        localStorage.setItem('email',response.data.email)
        navigate('/verify-user'); 
      }
     } catch (err) {
      console.error('Unhandled error:', err);
     }
    };
    if(isLoading){
      return<LoadingModal/>
    }
    return (
      <div className="min-h-screen bg-bodyColor flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              {errors.firstName ? (
                <p className="text-red-500 text-xs hover:text-red-300">
                  {errors.firstName}
                </p>
              ) : (
                <label
                  htmlFor="firstName"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
              )}
  
              <input
                id="firstName"
                name="firstName"
                type="text"
                onChange={handleForm}
                value={form.firstName}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-xs"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              {errors.lastName ? (
                <p className="text-red-500 text-xs hover:text-red-300">
                  {errors.lastName}
                </p>
              ) : (
                <label
                  htmlFor="lastName"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
              )}
  
              <input
                id="lastName"
                name="lastName"
                type="text"
                onChange={handleForm}
                value={form.lastName}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-xs"
                placeholder="Enter your last name"
              />
            </div>
            <div>
              {errors.email ? (
                <p className="text-red-500 text-xs hover:text-red-300">
                  {errors.email}
                </p>
              ) : (
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
              )}
  
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleForm}
                value={form.email}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-xs"
                placeholder="Enter your email"
              />
            </div>
            <div>
              {errors.password ? (
                <p className="text-red-500 text-xs hover:text-red-300">
                  {errors.password}
                </p>
              ) : (
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
              )}
  
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleForm}
                  value={form.password}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-xs"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              {truePass ? (
                <p className="text-red-500 text-xs hover:text-red-300">
                  Password not match
                </p>
              ) : (
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
              )}
  
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={handlePass}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-xs"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-3 w-3 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-1 block text-xs text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-black hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-black hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-1.5 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Sign Up
            </button>
          </form>
          {/* <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>
            <div className="mt-3">
              <button
                type="button"
                className="w-full flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
              </button>
            </div>
          </div> */}
          <p className="mt-4 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-medium text-black hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    );
}

export default Signup
