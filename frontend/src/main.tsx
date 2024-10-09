import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './routes.tsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import ImageUploadModal from './pages/imageUploadModal.tsx';
 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
    <ToastContainer
        autoClose={3000}
        draggable
        closeOnClick
        pauseOnHover
      />
      <Router />
    </>
  </StrictMode>,
)
