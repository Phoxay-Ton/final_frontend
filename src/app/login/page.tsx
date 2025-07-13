"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Img from "/public/img/login.jpeg";

// Add Phetsarath OT font
const fontLoader = () => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Phetsarath+OT:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load font on component mount
  useState(() => {
    fontLoader();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth", {
        username,
        password,
      });

      const token = response.data.token;
      const user = response.data.data;
      setSuccessMsg("ເຂົ້າສູ່ລະບົບສຳເລັດ!");
      console.log("Token:", token);

      // Store token
      localStorage.setItem("token", token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/admin");
      });

    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 flex items-center justify-center p-4 relative overflow-hidden" style={{ fontFamily: 'Phetsarath OT, sans-serif' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-pulse delay-2000"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white/70 backdrop-blur-lg border border-sky-300/60 rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* Left Side - Image */}
            <div className="lg:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-sky-200/60 to-blue-200/60">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur-lg opacity-40"></div>
                  <Image
                    src={Img}
                    alt="OICP.KM Logo"
                    width={320}
                    height={320}
                    className="relative rounded-2xl shadow-lg border-2 border-sky-300/60"
                  />
                </div>
                <div className="text-slate-800">
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
                    ຍິນດີຕ້ອນຮັບ
                  </h1>
                  <p className="text-slate-700 text-lg">
                    ເຂົ້າສູ່ລະບົບເພື່ອດຳເນີນການຕໍ່
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="max-w-md mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">ເຂົ້າສູ່ລະບົບ</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-blue-600 mx-auto rounded-full"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Username Field */}
                  <div className="relative">
                    <label className="block text-slate-800 text-sm font-medium mb-2">
                      ຊື່ຜູ້ໃຊ້
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white/60 border border-sky-300 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm frot-times text-lg"
                        placeholder="ປ້ອນຊື່ຜູ້ໃຊ້"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <label className="block text-slate-800 text-sm font-medium mb-2">
                      ລະຫັດຜ່ານ
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 bg-white/60 border border-sky-300 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm font-times text-lg"
                        placeholder="ປ້ອນລະຫັດຜ່ານ"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-slate-500 hover:text-slate-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-slate-500 hover:text-slate-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error/Success Messages */}
                  {errorMsg && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 backdrop-blur-sm">
                      <p className="text-red-600 text-sm flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errorMsg}
                      </p>
                    </div>
                  )}

                  {successMsg && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 backdrop-blur-sm">
                      <p className="text-green-600 text-sm flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {successMsg}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          ກຳລັງເຂົ້າສູ່ລະບົບ...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          ເຂົ້າສູ່ລະບົບ
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}