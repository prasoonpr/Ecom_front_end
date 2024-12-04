import { Eye, EyeOff } from "lucide-react";
import { assets } from "../../assets/assets"
import { useState } from "react";
// import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAdminLoginMutation } from "../../services/adminApi";
// import { setAdminCredentials } from "../../redux/adminAuthSlice";
const AdminLoginPage = () => {
  const navigate=useNavigate()
  // const dispatch=useDispatch()
  const [adminLogin,{error}]=useAdminLoginMutation()
    const [showPassword, setShowPassword] = useState(false);
  const [form,setForm]=useState({
    email:"",
    password:""
  })
  const handleForm=async(e)=>{
    setForm({...form,[e.target.name]:e.target.value})
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const response=await adminLogin(form)
    // dispatch(setAdminCredentials({ accessToken: response.data.accessToken }));
    localStorage.setItem('adminToken',response.data.accessToken)
    navigate('/admin');
  }


    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white">
      <div className="p-4">
       
        <img
          src={assets.logo}
          alt="Company Logo"
          width={120}
          height={70}
          className="rounded-full"
        />
      </div>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white/10 p-8 rounded-lg shadow-2xl w-full max-w-sm">
          {error?<h2 className="text-sm font-bold text-center text-red-700 mb-4">{error?.data?.message}</h2>:<h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>}
         
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleForm}
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleForm}
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3 w-3 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-1 block text-gray-400">
                  Remember me
                </label>
              </div>
              <a href="#" className="font-medium text-black hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-1.5 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
