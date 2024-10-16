import React,{ useState,useEffect} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import AxiosInstance from "../axiosInstance";
import Loader from './loader'
import { useNavigate } from "react-router-dom";
import OTPVerification from "./otp";


interface FormData{
    name:string;
    email:string;
    phoneNo:string;
    password:string;
    confirmPassword:string
}

const Register = ()=>{

    const [formData,setFormData] = useState<FormData>({
        name:'',
        email:'',
        phoneNo:'',
        password:'',
        confirmPassword:''
    })
     const [password,setShowPassword] = useState(false)
     const [confirmPassword,setConfirmPassword] = useState(false)
     const [loading,setLoading] = useState(false)
     const [otpModal,setOtpModal] = useState(false)
     const navigate = useNavigate()
       
     useEffect(()=>{
        const data = JSON.parse(localStorage.getItem('userData') as string)
        if(data){
            navigate('/')
        }
    },[navigate])

    const handleFormSubmit = (e:React.ChangeEvent<HTMLInputElement>)=>{
       setFormData((prevState)=>{
        return{
            ...prevState,
            [e.target.name]:e.target.value
        }
       })
    }

    const formSubmit = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault()
        const nameRegex = /^([A-Z][a-z]*)(\s[A-Z][a-z]*){0,49}$/
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const phoneRegex = /^\d{10}$/
        const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/~`-]{5,10}$/
       if(formData.name.trim().length===0){
         toast.warning('Name is required')
         return
       }else if(!nameRegex.test(formData.name.trim())){
        toast.warning('First letter of name should be capital leter and only include characters')
        return
       }else if(formData.email.trim().length===0){
        toast.warning('Email is required')
        return
       }else if(!emailRegex.test(formData.email.trim())){
         toast.warning('Invalid mailId')
         return
       }else if(formData.phoneNo.trim().length===0){
        toast.warning('Phone number is required')
        return
       }else if(!phoneRegex.test(formData.phoneNo.trim())){
        toast.warning('Phone number should contain exactly 10 digits with only numbers')
        return
       }else if(formData.password.trim().length===0){
        setLoading(false)
        toast.warning('Password is required')
        return
       }else if(!passwordRegex.test(formData.password.trim())){
        setLoading(false)
        toast.warning('Create a strong password with minimum 5 digits')
        return
       }else if(formData.password!==formData.confirmPassword){
        toast.warning('Password didn\'t match')
        return
       }else{
        setLoading(true)
        AxiosInstance.post('/user/register',formData)
        .then((res)=>{
          if(res.data.message){
            toast.success(res.data.message)
            // navigate('/register/verifyOtp')
          }
        })
        .catch((error)=>{
           console.log(error)
        })
        .finally(()=>{
            setLoading(false)
            setOtpModal(true)
        })
       }
    }
    return(
        <>
        {/* bg-[url(../../public/registerationBgImg.jpg)] bg-cover */}
        {loading&&(
            <Loader/>
        )}
        {otpModal&&(
            <OTPVerification name={formData.name} email={formData.email} />
        )}
        <div className="h-screen w-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className=" sm:mx-auto sm:w-full sm:max-w-md lg:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <h2 className="mt-2 text-center text-2xl leading-9 font-extrabold text-gray-900">
            Create a new account
        </h2>
            <form method="POST"  className="mt-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-5  text-gray-700">Name</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input id="name"  name="name" placeholder="John Doe" type="text" onChange={handleFormSubmit} value={formData.name}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                        <div className="hidden absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd">
                                </path>
                            </svg>
                        </div>
                    </div>
                </div>

                

                <div className="mt-6">
                    <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
                        Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input id="email" name="email" placeholder="user@example.com" type="email" onChange={handleFormSubmit} value={formData.email}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                        <div className="hidden absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <label htmlFor="phoneNo" className="block text-sm font-medium leading-5 text-gray-700">
                       Phone Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input id="phoneNo" name="phoneNo" placeholder="752******2" type="text" onChange={handleFormSubmit} value={formData.phoneNo}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                        <div className="hidden absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">
                        Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input id="password" name="password" type={password===false?'password':'text'} onChange={handleFormSubmit} value={formData.password}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                            <FontAwesomeIcon className="absolute top-3 right-3" onClick={()=>setShowPassword(!password)} icon={password===false?faEye:faEyeSlash} />
                            </div>
                </div>

                <div className="mt-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium leading-5 text-gray-700">
                        Confirm Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input id="confirmPassword" name="confirmPassword" type={confirmPassword===false?'password':'text'} onChange={handleFormSubmit} value={formData.confirmPassword}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                            <FontAwesomeIcon className="absolute top-3 right-3" onClick={()=>setConfirmPassword(!confirmPassword)} icon={confirmPassword===false?faEye:faEyeSlash} />
                            </div>
                </div>

                <div className="mt-6">
                    <span className="block w-full rounded-md shadow-sm">
                        <button
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out" onClick={(e)=>formSubmit(e)}>
                            Create account
                        </button>
                    </span>
                </div>
            </form>
            <div className="flex space-x-4 mt-3 items-center justify-center">
  <p>Already have an account...</p>
  <button className="bg-indigo-500 text-white px-4 py-1 rounded-lg hover:bg-indigo-700" onClick={()=>navigate('/login')}>Login</button>
  </div>

        </div>
    </div>
        </div>
       
        </>
        
    )
}

export default Register