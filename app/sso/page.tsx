'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, LockClosedIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function SSOSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log("Login form submitted");
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Basic validation
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
      
      console.log("Redirecting to dashboard...");
      
      try {
        // For demo, any credentials will work - try router first
        router.push('/demos/cvs-dashboard');
        
        // As a fallback, use direct navigation after a short delay
        setTimeout(() => {
          if (window.location.pathname === '/sso') {
            console.log("Router navigation may have failed, using direct navigation");
            window.location.href = '/demos/cvs-dashboard';
          }
        }, 500);
      } catch (error) {
        console.error("Navigation error:", error);
        // Fallback to direct navigation
        window.location.href = '/demos/cvs-dashboard';
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Login Form Section - Left Side */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center mb-8">
              <Image 
                src="/kigo logo.svg" 
                alt="Kigo" 
                width={120} 
                height={40} 
                className="h-10 w-auto" 
              />
              <span className="mx-4 text-gray-300">×</span>
              <Image 
                src="/logos/cvs-logo.svg" 
                alt="CVS" 
                width={88} 
                height={22} 
                className="h-8 w-auto" 
              />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Access the CVS ExtraCare Support Portal
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or sign in with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Microsoft</span>
                    <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 0H0V10H10V0Z" fill="#F25022"/>
                      <path d="M21 0H11V10H21V0Z" fill="#7FBA00"/>
                      <path d="M10 11H0V21H10V11Z" fill="#00A4EF"/>
                      <path d="M21 11H11V21H21V11Z" fill="#FFB900"/>
                    </svg>
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Google</span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9274 23.7663 12.2764Z" fill="#4285F4"/>
                      <path d="M12.2402 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50693 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2402 24.0008Z" fill="#34A853"/>
                      <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51221C-0.18526 10.0056 -0.18526 14.0004 1.51221 17.3912L5.50253 14.3003Z" fill="#FBBC04"/>
                      <path d="M12.2402 4.74966C13.9508 4.7232 15.6043 5.36697 16.8435 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2402 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50693 9.70575C6.45946 6.86173 9.11388 4.74966 12.2402 4.74966Z" fill="#EA4335"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Illustration Section - Right Side */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        {/* Playful gradient overlay */}
        <div className="absolute inset-0 opacity-40 mix-blend-soft-light">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-radial from-blue-300/20 at-tr to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-radial from-red-300/20 at-bl to-transparent"></div>
        </div>
        
        {/* Brand logos as background elements with more playful animations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Kigo logo only - large floating in background */}
          <div className="absolute -top-10 right-20 w-72 h-72 animate-gentle-float">
            <div className="relative w-full h-full opacity-15">
              <Image 
                src="/kigo logo only.svg" 
                alt="Kigo Background"
                fill
                style={{ objectFit: 'contain' }}
                className="filter blur-[1px] text-blue-500"
              />
            </div>
          </div>
          
          {/* CVS logo - smaller floating in background */}
          <div className="absolute bottom-20 left-20 w-64 h-64 animate-gentle-float-reverse">
            <div className="relative w-full h-full opacity-15">
              <Image 
                src="/logos/cvs-logo.svg" 
                alt="CVS Background"
                fill
                style={{ objectFit: 'contain' }}
                className="filter blur-[1px]"
              />
            </div>
          </div>
        </div>

        {/* Content Overlay - More playful co-branded design */}
        <div className="absolute inset-0 flex justify-center items-center z-10">
          <div className="max-w-md text-center">
            {/* Dynamic Logo Animation Container */}
            <div className="relative h-80 mb-8">
              {/* Orbital rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border border-blue-300/30 animate-spin-slow"></div>
                <div className="absolute w-48 h-48 rounded-full border border-red-300/30 animate-spin-reverse-slow"></div>
              </div>
              
              {/* Central container with brand colors */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-full w-40 h-40 flex items-center justify-center shadow-lg border border-white/50">
                  <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-500/10 to-red-500/10 animate-pulse-gentle"></div>
                  
                  {/* Kigo and CVS logos in an interlinked design */}
                  <div className="relative w-32 h-32">
                    {/* Kigo logo only - positioned for interaction */}
                    <div className="absolute top-0 left-0 w-20 h-20 animate-float-micro">
                      <Image 
                        src="/kigo logo only.svg" 
                        alt="Kigo" 
                        width={60} 
                        height={60} 
                        className="filter drop-shadow"
                      />
                    </div>
                    
                    {/* CVS logo - positioned for interaction */}
                    <div className="absolute bottom-0 right-0 w-20 h-16 animate-float-micro-reverse">
                      <Image 
                        src="/logos/cvs-logo.svg" 
                        alt="CVS" 
                        width={70} 
                        height={20} 
                        className="filter drop-shadow"
                      />
                    </div>
                    
                    {/* Connection line between logos */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M30 30 L98 98" 
                        stroke="url(#gradient)" 
                        strokeWidth="2" 
                        strokeDasharray="6 4"
                        className="animate-dash-slow"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4B55FD" />
                          <stop offset="100%" stopColor="#CC0000" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Orbiting elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Orbiting Kigo mini logo */}
                  <div className="absolute w-10 h-10 animate-orbit">
                    <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                      <Image 
                        src="/kigo logo only.svg" 
                        alt="Kigo" 
                        width={28} 
                        height={28} 
                      />
                    </div>
                  </div>
                  
                  {/* Orbiting CVS mini logo */}
                  <div className="absolute w-10 h-10 animate-orbit-reverse animation-delay-500">
                    <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                      <div className="w-8 h-5 relative">
                        <Image 
                          src="/logos/cvs-logo.svg" 
                          alt="CVS" 
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional orbiting elements with brand colors */}
                  <div className="absolute w-4 h-4 bg-blue-400/70 rounded-full blur-sm animate-orbit-inner animation-delay-700"></div>
                  <div className="absolute w-4 h-4 bg-red-400/70 rounded-full blur-sm animate-orbit-inner-reverse animation-delay-300"></div>
                </div>
              </div>
              
              {/* Particle effects */}
              <div className="absolute w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-red-400 rounded-full blur-sm animate-pulse animation-delay-500"></div>
                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-blue-300 rounded-full blur-sm animate-pulse animation-delay-700"></div>
                <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-red-300 rounded-full blur-sm animate-pulse animation-delay-300"></div>
              </div>
            </div>
            
            <h2 className="text-xl font-medium text-gray-800 mb-2">Unified Support Experience</h2>
            <p className="text-gray-600 mb-6">
              A seamless integration between Kigo Pro and CVS ExtraCare
            </p>
            
            {/* Streamlined feature pills */}
            <div className="flex flex-wrap justify-center gap-2 text-xs mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Integrated Platform</span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">Real-time Updates</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Customer-Centric</span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">Visual Analytics</span>
            </div>
            
            {/* Footer with brand colors */}
            <div className="mt-6 text-center">
              <div className="text-gray-500 text-xs">
                © 2023 Kigo + CVS Pharmacy Partnership
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 