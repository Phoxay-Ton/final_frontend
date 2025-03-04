"use client";

import Image from "next/image";
import Img from "/public/img/login.jpeg";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-700 to-blue-900">
      <div className="bg-white shadow-lg rounded-lg flex p-6 space-x-6 max-w-3xl">
        {/* Left Side - Image */}
        <div className="flex-shrink-0">
          <Image
            src={Img} // Make sure to place the image in the public folder
            alt="OICP.KM Logo"
            width={250}
            height={250}
            className="rounded-lg border border-gray-300"
          />
        </div>
        
        {/* Right Side - Login Form */}
        <div className="w-80">
          <h2 className="text-2xl text-gray-900 text-center mb-4">LOGIN</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">ຊື່ ແລະ ນາມສະກຸນ</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg text-black"
                placeholder="Enter username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">ລະຫັດຜ່ານ</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg text-black"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg" >
              ເຂົ້າສູ່ລະບົບ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
