import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginContext } from "/src/App";
import { Eye, EyeOff } from "lucide-react";

function SuperAdminLogin() {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setError] = useState("");
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const { login, setLogin, setUserEmail, setUserName } = useContext(loginContext);

  useEffect(() => {
    if (login) navigate("/superadmin");
  }, [login, navigate]);

  const checkLogin = async () => {
    const login_time = new Date().toLocaleString();
    const emailPattern = /^[\w.-]+@(gmail\.com|ac\.in|yahoo\.com)$/;
    const email = username.toLowerCase();

    if (!emailPattern.test(email)) {
      setError("Only @gmail.com, @ac.in, @yahoo.com emails are allowed.");
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/api/login/`, {
        email,
        password,
        user_type: "Superadmin",
        login_time,
      });

      const data = res.data;
      localStorage.setItem("userRole", "Super_admin");
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("login_time", login_time);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", email.split("@")[0]);

      setLogin(true);
      setUserEmail(email);
      setUserName(email.split("@")[0]);
      navigate("/superadmin");
    } catch (error) {
      setError("Login Failed..Please Check Your Credentials");
      console.log("error Message : ", error)
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200"
    >
      <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl p-10 w-[380px] sm:w-[420px] flex flex-col gap-4 border border-orange-200/50">
        <div className="text-center">
          <h1 className="text-3xl font-news font-bold text-orange-700 leading-tight drop-shadow-sm">
            Welcome <br /> Admin
          </h1>
          <p className="text-sm text-red-600 mt-1">{err}</p>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <div>
            <label className="text-sm font-semibold text-orange-700">Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border border-orange-300 rounded-md bg-white 
                        focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
            />
          </div>

          <div className="relative">
            <label className="text-sm font-semibold text-orange-700">Password</label>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-1 p-3 border border-orange-300 rounded-md bg-white pr-10
                        focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
            />
            <div
              className="absolute top-11 right-3 text-orange-700 cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <button
            className="w-full mt-2 py-3 rounded-md bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02]"
            onClick={checkLogin}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminLogin;
