import { Link, useNavigate} from "react-router-dom";
import AuthDialog from "./AuthDialog";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

export default function Header() {
    const {currentUser,handleLogout} = useAuth()
    const navigate = useNavigate()
    let initials
   if(currentUser){ 
    initials = currentUser.name
    .split(" ")
    .map((n:string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);}

    const onLogout = ()=>{
        handleLogout()
        navigate('/')
    }
    return (
        <header className="sticky top-0 z-30 bg-white shadow-sm flex justify-between items-center px-10 py-4 w-full">
            <Link to="/">
                <div
                    className="text-2xl font-bold cursor-pointer bg-primary text-white p-2 rounded-md
  transform transition-all duration-200 hover:-translate-y-1 hover:scale-105"
                >
                    BlobNotes
                </div>
            </Link>
            <div className="flex items-center justify-center gap-5">
           {currentUser?
          <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-slate-700">{initials}</span>
        </div>

        {/* Name + email */}
        <div className="hidden sm:flex flex-col leading-tight text-right">
          <span className="text-sm font-semibold text-gray-800">{currentUser.name}</span>
          <span className="text-xs text-gray-400">{currentUser.email}</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Logout */}
        <Button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-gray-300 transition-colors duration-150 px-2 py-1 rounded-lg  cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </Button>
        <Button onClick={()=>navigate('/dashboard')} className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-gray-300 transition-colors duration-150 px-2 py-1 rounded-lg  cursor-pointer">
          Dashboard
          </Button>
      </div>:
    <AuthDialog/>   
        }
                
            </div>
        </header>
    )
}