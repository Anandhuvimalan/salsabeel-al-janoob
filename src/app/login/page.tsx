"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
            Admin Portal
          </h1>
          <p className="mt-2 text-gray-400">Secure access to dashboard</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">
            <div className="group relative">
              <input
                id="email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full rounded-lg border border-gray-700 bg-gray-800/60 py-3.5 pl-4 pr-12 text-white placeholder-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                required
              />
              <label 
                htmlFor="email" 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all 
                          peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 
                          peer-focus:top-0 peer-focus:scale-75 peer-focus:text-purple-400 peer-focus:bg-gray-900 peer-focus:px-2
                          peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:scale-75 peer-[&:not(:placeholder-shown)]:px-2"
              >
                Email Address
              </label>
              <EnvelopeIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="group relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full rounded-lg border border-gray-700 bg-gray-800/60 py-3.5 pl-4 pr-12 text-white placeholder-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                required
              />
              <label 
                htmlFor="password" 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all 
                          peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 
                          peer-focus:top-0 peer-focus:scale-75 peer-focus:text-purple-400 peer-focus:bg-gray-900 peer-focus:px-2
                          peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:scale-75 peer-[&:not(:placeholder-shown)]:px-2"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-400/10 p-3 text-center text-red-300 border border-red-400/20"
            >
              {errorMsg}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 py-3.5 px-6 font-medium text-white 
                      hover:from-purple-500 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-purple-500 
                      focus:ring-offset-2 focus:ring-offset-gray-900 transition-all hover:shadow-lg relative overflow-hidden"
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              </div>
            ) : null}
            <span className={isLoading ? "opacity-0" : "opacity-100"}>
              Sign In
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}