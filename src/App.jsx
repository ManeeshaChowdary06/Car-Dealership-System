import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./services/supabaseClient"

import CustomerLayout from "./layouts/CustomerLayout"
import DealerLayout from "./layouts/DealerLayout"
import AdminLayout from "./layouts/AdminLayout"

import Home from "./pages/Home"
import BrowseCars from "./pages/BrowseCars"
import CarDetails from "./pages/CarDetails"
import DealerDashboard from "./pages/DealerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import Messages from "./pages/Messages"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App(){

const [user,setUser] = useState(null)
const [loading,setLoading] = useState(true)

useEffect(()=>{
loadUser()
},[])

async function loadUser(){
const { data } = await supabase.auth.getUser()

if(data.user){
setUser(data.user)
}

setLoading(false)
}

//////////////////////////////////////////////////

if(loading){
return <div className="p-10">Loading...</div>
}

//////////////////////////////////////////////////

if(!user){
return (
<Routes>
<Route path="*" element={<Login/>}/>
<Route path="/register" element={<Register/>}/>
</Routes>
)
}

//////////////////////////////////////////////////

return(

<Routes>

{/* CUSTOMER */}
<Route path="/" element={<CustomerLayout/>}>
<Route index element={<Home/>}/>
<Route path="cars" element={<BrowseCars/>}/>
<Route path="car/:id" element={<CarDetails/>}/>
<Route path="messages" element={<Messages/>}/>
</Route>

{/* DEALER */}
<Route path="/dealer" element={<DealerLayout/>}>
<Route index element={<DealerDashboard/>}/>
<Route path="messages" element={<Messages/>}/>
</Route>

{/* ADMIN */}
<Route path="/admin" element={<AdminLayout/>}>
<Route index element={<AdminDashboard/>}/>
</Route>

{/* FALLBACK */}
<Route path="*" element={<Navigate to="/" />} />

</Routes>
)
}

export default App