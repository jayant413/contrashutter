"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import LoginForm from "@/components/login-form";
import RegisterForm from "@/components/register-form";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-center max-w-6xl mx-auto">
        {/* Image Section */}
        <div className="md:w-1/2 relative h-[600px] rounded-xl overflow-hidden hidden md:block">
          <Image
            src="/placeholder.svg?height=1200&width=800"
            alt="Photography services"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primaryBlue/80 to-primaryBlue/30 flex flex-col items-center justify-center text-white p-8">
            <Camera className="w-16 h-16 text-primaryOrange mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-center">
              Welcome to Contrashutter
            </h2>
            <p className="text-lg text-center max-w-md">
              Join our community of photography enthusiasts and access premium
              services for all your special events.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <h3 className="font-bold text-2xl text-primaryOrange">1000+</h3>
                <p>Happy Clients</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <h3 className="font-bold text-2xl text-primaryOrange">5000+</h3>
                <p>Events Covered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 w-full">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Camera className="h-8 w-8 text-primaryOrange" />
                <span className="text-2xl font-bold">Contrashutter</span>
              </div>
              <h1 className="text-3xl font-bold">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {isLogin
                  ? "Sign in to access your account"
                  : "Join us to get started with our services"}
              </p>
            </div>

            <div className="bg-primaryBlue/5 dark:bg-primaryBlue/20 p-1 rounded-lg flex mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-center rounded-md transition-colors ${
                  isLogin
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-center rounded-md transition-colors ${
                  !isLogin
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                Register
              </button>
            </div>

            {isLogin ? <LoginForm /> : <RegisterForm />}

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
              By continuing, you agree to our{" "}
              <Link
                href="/terms-conditions"
                className="text-primaryBlue dark:text-blue-300 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/return-replace-policy"
                className="text-primaryBlue dark:text-blue-300 hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
