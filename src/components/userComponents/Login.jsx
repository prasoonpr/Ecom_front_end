/* eslint-disable react/no-unescaped-entities */
import  { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation, useLoginWithGoogleMutation } from '../../services/userApi.js';
// import { useDispatch } from 'react-redux';
// import { setCredentials } from '../../redux/authSlice.js';
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google'

const Login = () => {
  const navigate=useNavigate()
  // const dispatch=useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const [loginWithGoogle,{error:googleError}]=useLoginWithGoogleMutation()
  const [login,{error}]=useLoginMutation()
  const [err,setErr]=useState(false)
  const [form,setForm]=useState({
    email:"",
    password:""
  })

  // for handlig form
  const handleForm=async(e)=>{
    setForm({...form,[e.target.name]:e.target.value})
  }

  // for handlig submit
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(form.email.trim()==''){
      setErr(true)
    }else{
      setErr(false)
    }
    const response=await login(form)
    localStorage.setItem('userToken',response.data.accessToken)
    navigate('/');
    window.location.reload(); 
  }

// for handling password visibility
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
//for handling response of the google
    const responseGoogle=async(authResult)=>{
      console.log(authResult);
      if(authResult){
        const response=await loginWithGoogle({credential:authResult.credential})
        localStorage.setItem('userToken',response.data.accessToken)
        // dispatch(setCredentials({ accessToken: response.data.accessToken }));
        navigate('/products');
        window.location.reload(); 
      }
    }

    return (
      <div className="min-h-screen bg-bodyColor flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
         {error? <h2 className="text-sm font-bold text-center text-red-700 mb-4">{error?.data?.message}</h2>:<h2 className="text-xl font-bold text-center text-gray-800 mb-4">Login</h2>}
         {googleError&&<h2 className="text-sm font-bold text-center text-red-700 mb-4">{googleError?.data?.message}</h2>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleForm}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-xs"
                placeholder="Enter your email"
              />
              {err&&<p className='text-sm text-red-500'>enter a valid email</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleForm}
                  type={showPassword ? "text" : "password"}
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
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3 w-3 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-1 block text-gray-700">
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
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-3">
              {/* <button
              onClick={googleLogin}
                type="button"
                className="w-full flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button> */}
              <GoogleOAuthProvider clientId='815687154391-8493bekd5vue71o8ke6po36s0e06rsfb.apps.googleusercontent.com'>
              <GoogleLogin
              onSuccess={responseGoogle}
              onError={()=>{
                console.log(error);
              }}
              />
              </GoogleOAuthProvider>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-600">
            Don't have an account?{' '}
            <Link to={'/signup'} className="font-medium text-black hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
}

export default Login

