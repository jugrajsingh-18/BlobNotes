import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type AuthDialogProps = {
  setView?: boolean;
  resetView?: () => void;
};

export default function AuthDialog({ setView, resetView }: AuthDialogProps) {
  const { registerUser, loginUser } = useAuth()
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // PASSWORD VALIDATION FUNCTION USING REGEX.
  const validatePassword = (password: string): boolean => {
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/]).{6,}$/;
    return re.test(password);
  };
  const handleRegister = () => {
    if (!validateEmail(email)) {
      toast.error("Enter a valid email.")
      return
    }
    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 chars,contain a number,contain special char and a capital letter.")
      return
    }
    if (!name) {
      toast.error("Enter a name.")
      return
    }
    const user = {
      id:btoa(email),
      name: name,
      email: email,
      password: btoa(password),
      // TodoSectionArray:[]
    }
    const response = registerUser(user)
    if (response.status == 200) {
      toast.success(response.message)
      setOpen(false)
      navigate('/dashboard')
      return
    }
    if (response.status == 409) {
      toast.error(response.message)
      return
    }
  }
  const handleLogin = () => {
    if (!validateEmail(email)) {
      toast.error("Enter a valid email.")
      return
    }
    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 chars,contain a number,contain special char and a capital letter.")
      return
    }
    const user = {
      email,
      password: btoa(password)
    }
    const response = loginUser(user)
    console.log(response);
    
    if (response.status == 200) {
      toast.success(response.message)
      setOpen(false)
      navigate('/dashboard')
      return
    }
    if (response.status == 404) {
      toast.error(response.message)
      return
    }
  }

  useEffect(() => {
    if (setView !== undefined) {
      setOpen(setView);
    }

  }, [setView]);

  const [mode, setMode] = useState("login")

  const switchToRegister = () => setMode("register")
  const switchToLogin = () => setMode("login")
  const handleOpenChange = (value: boolean) => {
    setOpen(value);

    // when dialog closes, reset parent trigger
    if (!value) {
      resetView?.();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>

      <DialogTrigger asChild>
        <Button className="cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:scale-105">Login</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Login" : "Register"}
          </DialogTitle>
        </DialogHeader>

        {/* LOGIN FORM */}
        {mode === "login" && (
          <div className="space-y-4">
            <input className="w-full border p-2" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value.toLowerCase())} />
            <div className="relative">
              <input
                className="w-full border p-2 pr-16"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <Button className="w-full" onClick={handleLogin}>Login</Button>

            <p className="text-sm text-center">
              Don’t have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={switchToRegister}
              >
                Register
              </span>
            </p>
          </div>
        )}

        {/* REGISTER FORM */}
        {mode === "register" && (
          <div className="space-y-4">
            <input className="w-full border p-2" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <input className="w-full border p-2" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value.toLowerCase())} />
            <div className="relative">
              <input
                className="w-full border p-2 pr-16"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <Button className="w-full" onClick={handleRegister}>Register</Button>

            <p className="text-sm text-center">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={switchToLogin}
              >
                Login
              </span>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}