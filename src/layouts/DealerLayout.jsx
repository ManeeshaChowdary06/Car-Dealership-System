import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"

function DealerLayout(){

const navigate = useNavigate()

const [user,setUser] = useState(null)
const [role,setRole] = useState("dealer")

//////////////////////////////////////////////////
// LOAD USER
//////////////////////////////////////////////////

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
// ROLE CHANGE
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

// 🔥 REDIRECT
if(newRole === "admin"){
window.location.href = "/admin"
}
else if(newRole === "customer"){
window.location.href = "/"
}
else{
window.location.href = "/dealer"
}

}

//////////////////////////////////////////////////

return(
<div className="min-h-screen bg-gray-100">

{/* NAVBAR */}
<div className="flex justify-between px-10 py-4 bg-white shadow">

<h1
onClick={()=>navigate("/dealer")}
className="text-indigo-600 font-bold cursor-pointer"
>
MotoVerse Dealer
</h1>

<div className="flex items-center gap-4">

{/* MESSAGE BUTTON */}
<button
onClick={()=>navigate("/dealer/messages")}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
💬 Messages
</button>

{/* ROLE SWITCH */}
<div className="flex items-center gap-2">

<span className="text-sm text-gray-500">Role:</span>

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

</div>

{/* CONTENT */}
<div className="p-10">
<Outlet/>
</div>

</div>
)
}

export default DealerLayout