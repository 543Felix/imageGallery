import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
// import { faPen } from "@fortawesome/free-solid-svg-icons"
import { ImageData } from "../App"
import { toast } from "react-toastify"
import AxiosInstance from "../axiosInstance"
import Loader from "./loader"


interface Props{
    imageData:ImageData,
    closeImage:()=>void,
    mode:'Edit'|'',
    userId:string,
    setImages:React.Dispatch<React.SetStateAction<ImageData[]>>
}
const Image:React.FC<Props> = ({imageData,closeImage,mode,userId,setImages})=>{

    const [imageName,setImageName] = useState('')
    const [loading,setLoading] = useState(false)

     useEffect(()=>{
        if(mode==='Edit'){
            setImageName(imageData.name)
        }
     },[mode,imageData.name])

     const rename = ()=>{
        if(imageName.trim().length===0){
            toast.error('image Name cannot be empty')
            return
        }else{
            setLoading(true)
            AxiosInstance.patch('/user/imageRename',{imageId:imageData._id,imageName,userId:userId})
            .then((res)=>{
              if(res.data.images){
                setImages(res.data.images)
              }
            }).catch(()=>{
                toast.error('An error occured while updating images')
            }).finally(()=>{
                setLoading(false)
                closeImage()
            })
        }
     }
    return(
        <>
        {loading===true&&(
            <Loader />
        )}
        <div className="fixed  h-screen w-screen z-20 bg-black bg-opacity-85 flex items-center justify-center p-6">
            <FontAwesomeIcon icon={faCircleXmark} className="z-30 text-white absolute top-5 right-5 h-8" onClick={()=>closeImage()} />
           
            <div className=" relative bg-black px-10">
           
            <img src={imageData.url} className="h-auto max-h-screen  w-auto max-w-screen"  alt="" />
            <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full bg-black bg-opacity-50 rounded-lg"></div>
            <div className="absolute bottom-4 left-0 right-0 text-white" >
                <div className=" flex items-center justify-center  space-x-3">
                    <input className="w-1/2  text-center px-5 py-1 bg-black focus:outline-none"  readOnly={mode === ''}   value={mode===''?imageData.name:imageName} onChange={(e)=>setImageName(e.target.value)}  type="text" />
                    {mode==='Edit'&&(
                      <button className="bg-indigo-500 px-4 py-1" onClick={rename}>Save changes</button>
                    )}
                </div>
           
            </div>
            </div>
            
        </div>
        </>
        
    )
}

export default Image