'use client'
import { signIn } from 'next-auth/react'

export default function Landing() {
    return (
        <div className="flex min-h-screen flex-col bg-white px-4 py-8">
            {/* Main Content */}
            <div className="flex flex-1 flex-col items-center justify-center">
                {/* Beta Badge */}
                <div className="mb-6 flex items-center gap-2 rounded-full px-4 py-1.5 bg-blue-100 border border-blue-300 shadow-sm shadow-blue-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4 text-blue-600"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 3.75L10.5 9H4.5l6.75 4.5-2.25 6 5.25-3.75 5.25 3.75-2.25-6L19.5 9h-6l-.75-5.25z"
                        />
                    </svg>
                    <span className="text-xs font-paragraph font-medium text-blue-700">
                        Currently in Beta
                    </span>
                </div>

                {/* Title */}
                <div className="mb-10 text-center">
                    <h1 className="font-header text-5xl md:text-8xl font-semibold text-blue-500">
                        BLOCKGPT
                    </h1>
                </div>

                {/* Sign-in Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto max-w-sm sm:max-w-none justify-center">
                    {/* Google Button */}
                    <button
                        onClick={() => signIn('google', { redirectTo: '/chat' })}
                        className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-paragraph font-medium text-slate-800 transition-all duration-150 hover:bg-slate-200 focus:outline-none cursor-pointer"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google logo"
                            className="h-5 w-5"
                            loading="lazy"
                        />
                        <span>Sign in with Google</span>
                    </button>

                    {/* GitHub Button */}
                    <button
                        onClick={() => signIn('github', { redirectTo: '/chat' })}
                        className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-paragraph font-medium text-slate-800 transition-all duration-150 hover:bg-slate-200 focus:outline-none cursor-pointer"
                    >
                        <img
                            src="https://www.svgrepo.com/show/512317/github-142.svg"
                            alt="GitHub logo"
                            className="h-5 w-5"
                            loading="lazy"
                        />
                        <span>Sign in with GitHub</span>
                    </button>
                </div>
            </div>

            <footer className="mt-16 w-full max-w-2xl mx-auto text-center text-sm text-slate-500">
                <div className="mt-2 font-paragraph text-xs text-slate-400">
                    © {new Date().getFullYear()} BLOCKGPT. All rights reserved.
                </div>
            </footer>

        </div>
    )
}
