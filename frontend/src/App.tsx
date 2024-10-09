import { useState,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff,faTrash,faPen } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ImageUploadModal from "./pages/imageUploadModal";
import AxiosInstance from "./axiosInstance";
import Image from "./pages/individualImage";
import { toast } from "react-toastify";

export interface ImageData {
  _id:string;
  createdAt:string;
 updatedAt:string;
  url: string;
  name: string;
}

interface User{
  id:string,
  name:string
}

const imageInitialData:ImageData = {
  _id:'',
createdAt:'',
updatedAt:'',
url: '',
name: '',
}

function App() {
  const [images, setImages] = useState<ImageData[]>([]);
 
  const navigate = useNavigate()
  const [uploadModal,setModal] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [userData,setUserData] = useState<User>({
    id:'',
    name:''
  })
  const [imageData,setImageData] = useState<ImageData>(imageInitialData)
  const [showImage,setShowImage] = useState(false)
  const [deleteModal,setDeleteModal] = useState(false)
  const [deleteImageId,setDeleteImageId] = useState('')
  const [mode,setMode] = useState<'Edit'|''>('')

  // const fetchimages = useCallback((id:string)=>{
   
  // },[])
  useEffect(()=>{
      const data = JSON.parse(localStorage.getItem('userData') as string)
      console.log('data = ',data)
      if(data){
        setUserData(data)
        AxiosInstance.get(`/user/getImages?id=${data.id}`)
        .then((res)=>{
          console.log('images = ',res.data)
          if(res.data.images){
            console.log('images = ',res.data)
            setImages(res.data.images)
          }
        })
      }else{
        navigate('/login')
      }
  },[navigate])

 

  const LogOut = ()=>{
    AxiosInstance.post('/user/logOut')
    .then(()=>{
      localStorage.removeItem('userData')
      toast.success('successfully logged out')
      navigate('/login')
    })
  }

  const handleDrop = () => {
    if (draggedIndex === null || dropIndex === null) return;

    const newImages = Array.from(images);
    const [removedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, removedImage);
    AxiosInstance.get(
      `/user/swapImages?draggedIndex=${draggedIndex}&dropIndex=${dropIndex}&userId=${userData.id}`
    )
      .then(() => {
        setImages(newImages);
      })
      .catch((err) => {
        console.log(err);
      });

    setDraggedIndex(null);
    setDropIndex(null);
  };

  const onDragStart = (ev: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    const target = ev.target as HTMLElement;

    const { width, height, left, top } = target.getBoundingClientRect();

    setOffset({
      x: ev.pageX - left,
      y: ev.pageY - top,
    });
    const hideDragImage = target.cloneNode(true) as HTMLElement;
    hideDragImage.id = "hideDragImage-hide";
    hideDragImage.style.opacity = "0";
    hideDragImage.style.position = "absolute";
    hideDragImage.style.top = "1000px";


    

    const dragImage = target.cloneNode(true) as HTMLElement;
    dragImage.id = "draggeimage";
    dragImage.style.position = "absolute";
    dragImage.style.width = `${width}px`;
    dragImage.style.height = `${height}px`;
    dragImage.style.pointerEvents = "none";

    const updateDragImagePosition = (event: MouseEvent) => {
      const mouseX = event.clientX + window.scrollX; 
      const mouseY = event.clientY + window.scrollY; 
    
      dragImage.style.left = `${mouseX - width / 2}px`; 
      dragImage.style.top = `${mouseY - height / 2}px`;
    };
    
    document.addEventListener('mousemove', updateDragImagePosition);

    document.body.appendChild(hideDragImage);
    document.body.appendChild(dragImage);

    ev.dataTransfer.setDragImage(hideDragImage, 0, 0);
  };

  const onDragEnd = () => {
    const hideDragImage = document.getElementById("hideDragImage-hide");
    const dragImage = document.getElementById("draggeimage");
    hideDragImage?.remove();
    dragImage?.remove();
  };

  const onDrag = (ev: React.DragEvent<HTMLDivElement>) => {
    const dragImage = document.getElementById("draggeimage");
    if (dragImage) {
      dragImage.style.left = ev.pageX - offset.x + "px";
      dragImage.style.top = ev.pageY - offset.y + "px";
    }

    // Implement auto-scrolling when dragging near the bottom or top
    const SCROLL_THRESHOLD = 150; // px near the edges to start scrolling
    const scrollableElement = document.documentElement;

    if (ev.clientY < SCROLL_THRESHOLD) {
      scrollableElement.scrollBy(0, -10); // Scroll up when near the top
    } else if (
      window.innerHeight - ev.clientY <
      SCROLL_THRESHOLD
    ) {
      scrollableElement.scrollBy(0, 10); // Scroll down when near the bottom
    }
  };

  const openImage = (image:ImageData)=>{
    setImageData(image)
   setShowImage(true)
  }

  const closeImage = ()=>{ 
    setImageData(imageInitialData)
    setShowImage(false)
    if(mode==='Edit'){
      setMode('')
    }
  }

  const deleteImage = ()=>{
    if(deleteImageId){
      AxiosInstance.delete(`/user/deleteImage?imageId=${deleteImageId}&id=${userData.id}`)
      .then((res)=>{
        console.log(res.data)
        const filteredImages = images.filter((item)=>item._id!==deleteImageId)
        setImages(filteredImages)
        toast.success('Image successfully deleted')
      })
      .catch((error)=>{
        toast.error('An unexpeected error occured while deleting image')
        console.log('error = ',error)
      }).finally(()=>{
        setDeleteImageId('')
        setDeleteModal(false)
      })
    }
   
  }

  const showDeleteImageModal = (e:React.MouseEvent<SVGSVGElement, MouseEvent>,id:string)=>{
    e.stopPropagation()
    setDeleteImageId(id)
    setDeleteModal(true)
  }
  const closeDeleteImageModal = ()=>{
    setDeleteImageId('')
    setDeleteModal(false)
  }

  const rename = ()=>{
     setMode('Edit')
  }
   
  return (
    <>
    {uploadModal===true&&(
       <ImageUploadModal closeModal={setModal} userId={userData.id} setUpdatedImages={setImages} />
    )}

    {deleteModal===true&&(
      <div className="fixed inset-0 z-20 bg-black bg-opacity-60 flex items-center justify-center p-6">
          <div className="bg-white h-[220px] w-[500px] rounded-lg items-center justify-center py-20">
             <div className="flex flex-col space-y-3 items-center justify-center h-full w-full">
              <h1 className='text-2xl font-semibold'>Are you sure you want to delete ?</h1>
              <div className="flex space-x-4 text-lg">
              <button className="bg-red-700 text-white font-semibold px-5 py-1 rounded " onClick={()=>deleteImage()}>Delete</button>
              <button className="bg-green-700 text-white font-semibold px-5 py-1 rounded"  onClick={()=>closeDeleteImageModal()}>Cancel</button>
              </div>
              
             </div>
          </div>
      </div>
    )}
     
    {showImage===true&&imageData&&(
      <Image imageData={imageData} closeImage={closeImage} mode={mode} userId={userData.id}  setImages={setImages} />
    )}
      <div className="h-14 w-full bg-indigo-500 flex text-white justify-end px-5 items-center">
        <div className="flex  items-center space-x-2 font-bold">
        <button className="bg-transparent border-white border-2  h-8 px-5 font-bold rounded-lg " onClick={()=>setModal(true)}>Upload</button>
        <h1>{`Welcome ${userData.name}`}</h1>
        <FontAwesomeIcon className="text-white h-4" icon={faPowerOff} onClick={LogOut} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 p-5">
        {images.map((item, index) => {
          const isDragging = draggedIndex === index;

          return (
            <div
              key={index}
              className={`relative ${isDragging ? "opacity-0" : ""}`}
              draggable
              onClick={()=>openImage(item)}
              onDragStart={(e) => onDragStart(e, index)}
              onDrag={(e) => onDrag(e)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => {
                setDropIndex(index);
                e.preventDefault();
              }}
              onDrop={handleDrop}
            >
              {item.url ? (
                <img
                  className="object-cover object-center w-full h-44 max-w-full rounded-lg"
                  src={item.url}
                  alt="gallery-photo"
                  style={{ opacity: isDragging ? 1 : undefined }}
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
              )}
              <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full bg-black bg-opacity-50 rounded-lg"></div>
              <div className="absolute top-3 right-3 flex text-white space-x-3">
              <FontAwesomeIcon icon={faPen} onClick={()=>rename()} className=" hover:scale-125 transition-transform duration-200" />
              <FontAwesomeIcon icon={faTrash} onClick={(e)=>showDeleteImageModal(e,item._id)} className=" hover:scale-125 transition-transform duration-200"  />
              </div>
              <h2 className="absolute bottom-1 left-4 text-white">{item.name}</h2>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
