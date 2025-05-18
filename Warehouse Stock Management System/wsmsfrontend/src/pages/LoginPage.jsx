import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import companylogo from "../assets/icons/companylogo.png";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <div className="w-1/2 flex flex-col justify-center items-center text-white px-10 py-12 relative">
        <div className="absolute inset-0 bg-pattern opacity-30"></div>
        <div className="text-center flex flex-col items-center relative z-10">
          <h1 className="text-4xl font-bold text-[#F3A026] mb-4 drop-shadow-lg">
            Warehouse Stock Management System
          </h1>
          <p className="text-2xl text-[#F3A026]/80 mb-8 drop-shadow-md">for San-San Marketing La Union</p>
          <div className="bg-white p-6 rounded-full shadow-lg hover:scale-[1.05] transition-all duration-300 ease-in-out">
            <img
              src={companylogo}
              alt="Company Logo"
              className="w-64 h-64 object-contain rounded-full border-8 border-[#F3A026] shadow-2xl"
            />
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transition-all duration-300 hover:scale-[1.02]">
          <h2 className="text-3xl font-bold text-[#F3A026] text-center mb-4">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-8">Log in to your account</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-5 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F3A026]"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F3A026]"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#F3A026] to-[#F29C11] text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer flex justify-center items-center"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
