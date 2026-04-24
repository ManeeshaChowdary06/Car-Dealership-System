import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"

function CustomerLayout(){

const navigate = useNavigate()
const [user,setUser] = useState(null)
const [role,setRole] = useState("customer")

useEffect(()=>{
loadUser()
},[])

async function loadUser(){

const { data } = await supabase.auth.getUser()

if(data.user){
setUser(data.user)

const { data: userData } = await supabase
.from("users")
.select("role")
.eq("id", data.user.id)
.single()

setRole(userData?.role)
}
}

//////////////////////////////////////////////////
// ROLE CHANGE (FINAL WORKING)
//////////////////////////////////////////////////

async function handleRoleChange(e){

const newRole = e.target.value

if(!user) return

const { error } = await supabase
.from("users")
.update({ role: newRole })
.eq("id", user.id)

if(error){
alert("Role update failed")
return
}

// 🔥 FULL REDIRECT (NO STATE BUGS)
if(newRole === "dealer"){
window.location.href = "/dealer"
}
else if(newRole === "admin"){
window.location.href = "/admin"
}
else{
window.location.href = "/"
}

}

//////////////////////////////////////////////////

return(
<div>

{/* NAVBAR */}
<div className="flex justify-between px-10 py-4 bg-white shadow">

<h1
onClick={()=>navigate("/")}
className="text-indigo-600 font-bold cursor-pointer"
>
MotoVerse
</h1>

<div className="flex items-center gap-4">

<button onClick={()=>navigate("/")}>Home</button>
<button onClick={()=>navigate("/cars")}>Browse</button>

{/* 🔥 ROLE SWITCH */}
<select
value={role}
onChange={handleRoleChange}
className="border px-2 py-1 rounded"
>
<option value="customer">Customer</option>
<option value="dealer">Dealer</option>
<option value="admin">Admin</option>
</select>

</div>

</div>

{/* CONTENT */}
<div className="p-10">
<Outlet/>
</div>

</div>
)
}

export default CustomerLayout