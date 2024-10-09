import React,{useState,useEffect} from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInstance from "../axiosInstance";
import Loader from "./loader";

interface FormData{
    email:string;
    password:string
}

const Login=()=>{

    const [formData,setFormData] = useState<FormData>({
        email:'',
        password:'',
    })
    const [loading,setLoading] = useState(false) 
    const navigate = useNavigate()
    
    useEffect(()=>{
        const data = JSON.parse(localStorage.getItem('userData') as string)
        if(data){
            navigate('/')
        }
    },[navigate])
    const handleFormChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
       setFormData((prevState)=>{
        return{
            ...prevState,
            [e.target.name]:e.target.value
        }
       })
    }

    const formSubmit = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault()
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
       if(formData.email.trim().length===0){
        toast.warning('Email field cannot be empty')
        return
       }else if(!emailRegex.test(formData.email.trim())){
        toast.warning('Invalid mailId')
        return
      }else if(formData.password.trim().length===0){
        toast.error('password field cannot be empty')
        return
      }else{
        setLoading(true)
        AxiosInstance.post('/user/login',{email:formData.email,password:formData.password})
        .then((res)=>{
            if(res.data){
                localStorage.setItem('userData', JSON.stringify({ id: res.data.id, name:res.data.name }));
                toast.success('logged in successfully')
               navigate('/')
            }
        }).catch(()=>{
            toast.error('An error occured while logging')
        }).finally(()=>{
            setLoading(false)
        })
      }
    }

    return(
        <>

        {loading===true&&(
            <Loader />
        )}
        <div className="h-screen w-screen flex   justify-center items-center">
            <div className="lg:w-[450px] py-6 px-8 h-80 mt-20 bg-white rounded shadow-xl flex  flex-col justify-center">
  <form action="" className="flex flex-col space-y-2 w-full">
  <div>
      <label htmlFor="email" className="block text-gray-800 font-bold">Email:</label>
      <input type="text" name="email" id="email" placeholder="Enter your email" onChange={handleFormChange} value={formData.email} className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600" />
    </div>
    <div>
      <label htmlFor="password" className="block text-gray-800 font-bold">Password:</label>
      <input type="password" name="password" id="password" placeholder="Enter your password" onChange={handleFormChange} value={formData.password} className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600" />
      <a href="#" className="text-sm font-thin text-gray-800 hover:underline mt-2 inline-block hover:text-indigo-600">Forget Password</a>
    </div>
    <button className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded" onClick={(e)=>formSubmit(e)}>Login</button>
  </form>
  <div className="flex space-x-4 mt-3 items-center justify-center">
  <p>Dont'have an account...</p>
  <button className="bg-indigo-500 text-white px-4 py-1 rounded-lg  hover:bg-indigo-700" onClick={()=>navigate('/register')}>Register</button>
  </div>
</div>
        </div>
        </>
        
       
    )
}

export default Login