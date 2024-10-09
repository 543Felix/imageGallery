const upload_preset:string = import.meta.env.VITE_UPLOAD_PRESET
const cloud_name:string = import.meta.env.VITE_CLOUD_NAME

// import cloudinary from 'cloudinary'

// cloudinary.v2.config({
//   cloud_name: cloud_name,
//   api_key:  api_key,
//   api_secret: api_secret
// });

interface imageFile{
    image:File,
    name:string
}

interface AfterUpload{
    url:string,
    name:string
}

const getResourceType = (file:File) => {
    const fileType = file.type.split('/')[0];
    switch (fileType) {
      case 'image':
        return 'image';
      case 'video':
        return 'video';
      case 'audio':
        return 'audio';
      default:
        return 'raw'; // For documents and other files
    }
  };

const uploadImageToCloudinary = async(file:File)=>{
    try {
    const uploadData = new FormData()

    uploadData.append("file", file)
    uploadData.append("upload_preset", upload_preset)
    uploadData.append("cloud_name", cloud_name)
    uploadData.append("resource_type",'raw')
       console.log('resouceType = ',getResourceType(file))
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/upload`, {
        method: "post",
        body: uploadData
    })

    const data = await res.json()
    console.log('uploaded image data = ',data)
    return data.url

    } catch (error) {
        console.log(error)
    }
    
}

const uploadMultipleImagesToCloudinary = async(files:imageFile[])=>{
try {
    const processedImages:AfterUpload[] =[]
    for(const item of files){
        const url:string = await uploadImageToCloudinary(item.image)
        if(url){
            processedImages.push({url:url,name:item.name})
        }
        
    }
    return processedImages
} catch (error) {
   console.log(error)
}
}


  

export default uploadMultipleImagesToCloudinary