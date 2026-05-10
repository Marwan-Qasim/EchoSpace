import { useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore.js";
import { MessageCircle, Eye, EyeOff } from "lucide-react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xl font-semibold">EchoSpace</span>
          </div>
          <p className="text-gray-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-400">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered bg-gray-900 border-gray-700 text-white placeholder:text-gray-600 focus:border-white"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-400">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered bg-gray-900 border-gray-700 text-white placeholder:text-gray-600 focus:border-white"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-400">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered bg-gray-900 border-gray-700 text-white placeholder:text-gray-600 focus:border-white w-full pr-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <label className="label">
              <span className="label-text-alt text-gray-500">At least 6 characters</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn bg-white text-black hover:bg-gray-200 border-none mt-2"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
