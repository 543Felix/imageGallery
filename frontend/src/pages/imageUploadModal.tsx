import {
    faCircleXmark,
    faCloudUploadAlt,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { useState,useRef } from "react";
import uploadMultipleImagesToCloudinary from "../utils/cloudinary";
import Loader from "./loader";
import AxiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

import { ImageData } from "../App";
  
interface ImageInterfce{
    image:File,
    name:string
}

interface Props{
  closeModal: (val:boolean) => void,
  userId:string,
  setUpdatedImages:React.Dispatch<React.SetStateAction<ImageData[]>>
}


const ImageUploadModal = ({ closeModal,userId,setUpdatedImages }:Props) => {
    const [images, setImages] = useState<ImageInterfce[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);
    const [loading,setLoading] = useState(false)
    const removeImage = (indexToRemove: number) => {
      setImages((prevImages) =>
        prevImages.filter((_, index) => index !== indexToRemove)
      );
    };
  
    const handleUpload = async () => {
      if (images.length === 0){
        toast.warning('browse images to uppload to the gallary')
        return;
      }
      const nonImageFiles = images.filter((file) => !file.image.type.startsWith('image/'));

  if (nonImageFiles.length > 0) {
    toast.warning('Some files are not valid images! Please upload only images.');
    return;
  }

      try {
        setLoading(true)
       const updatedImages = await  uploadMultipleImagesToCloudinary(images)
       console.log('updatedImages = ',updatedImages)
       AxiosInstance.post('/user/uploadImage',{images:updatedImages,_id:userId})
       .then((res)=>{
        if(res.data.images){
          toast.success('Image success fully added')
          setUpdatedImages(res.data.images)
          closeModal(false)
        }
       })
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    };
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        const imageObjects = files.map((file) => ({
          image: file,
          name: file.name,
        }));
  
        setImages((prevState)=>{
          return[
            ...prevState,
            ...imageObjects
          ]
        });
        
      }
    };
  
    return (
        <>
        {loading&&(
           <Loader/>
        )}
         <div className="fixed inset-0 z-20 bg-black bg-opacity-60 flex items-center justify-center p-6">
        <div className="relative bg-white w-full max-w-5xl max-h-screen h-auto p-10 rounded-3xl shadow-2xl overflow-auto backdrop-blur-xl bg-opacity-90 border border-gray-200">
          <button
            className="absolute top-6 right-6 text-gray-500 hover:text-red-600 transition duration-300"
            onClick={()=>closeModal(false)}
          >
            <FontAwesomeIcon icon={faCircleXmark} className="h-8 w-8" />
          </button>
  
          <div className="flex justify-center mb-4 items-center space-x-8">
            <h2 className="text-3xl font-extrabold text-gray-700 bg-clip-text tracking-wide">
              Upload Your Awesome Images
            </h2>
            <button
              onClick={handleUpload}
              className="bg-gradient-to-r flex from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg items-center space-x-3 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faCloudUploadAlt} className="h-5 w-5" />
              <span className="text-lg font-semibold">Upload Files</span>
            </button>
          </div>
  
          <div className={`border-dashed border-4 ${images.length>0?'max-h-[130px]':''} border-indigo-300 p-16 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all duration-300 bg-white bg-opacity-60 shadow-inner`}>
            <input
              type="file"
              hidden
              ref={fileRef}
              onChange={(e) => handleFileChange(e)}
              accept="image/*"
              multiple
            />
            <FontAwesomeIcon
              icon={faCloudUploadAlt}
              size="4x"
              className="text-indigo-400 mb-4"
            />
            <p className="text-lg text-gray-700 font-semibold">
              <span className="text-indigo-500 underline" onClick={() => fileRef!.current!.click()}>
                click to browse
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">Maximum file size: 5MB</p>
          </div>
  
          {images.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Selected Images
              </h3>
              <div className="flex overflow-x-auto space-x-4 pb-2">
                {images.map((item, index) => (
                  <div
                    key={index}
                    className="relative w-44 h-44 flex-shrink-0 rounded-xl hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={URL.createObjectURL(item.image)}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-35 rounded-lg"></div>
                    <p className="absolute bottom-2 left-2 right-2 text-white text-center bg-black bg-opacity-60 py-1 px-2 rounded-b-lg truncate">
                      {item.name}
                    </p>
                    <button
                      className="absolute top-2 right-2 text-gray-500 rounded-full p-2 transition duration-300"
                      onClick={() => removeImage(index)}
                    >
                      <FontAwesomeIcon
                        className="hover:scale-110 h-6 text-white"
                        icon={faCircleXmark}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
        </>
     
    );
  };
  
  export default ImageUploadModal;