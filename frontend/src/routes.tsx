import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/registration";
import App from "./App";
import PageNotFound from "./pages/pageNotFound";
 
  


const Router = ()=>{

    
    
    return (
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<App/>} />
               <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>} />
                <Route path="/*" element={<PageNotFound/>} />
                </Routes>
        </BrowserRouter>
    )
}


export default Router


