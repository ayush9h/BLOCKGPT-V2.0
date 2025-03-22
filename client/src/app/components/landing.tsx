"use client"
import { signIn } from "next-auth/react"

export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center mb-8">
                <h1 className="font-header text-8xl font-semibold text-blue-500">BLOCKGPT</h1>
            </div>

            <div className="flex gap-4">
                
                    <button className="text-slate-800 px-5 py-2.5 gap-2 font-medium flex flex-row justify-center items-center text-center bg-slate-200 rounded-md border border-slate-300 hover:bg-slate-300 duration-150 ease-in-out cursor-pointer" onClick={()=>signIn("google",{redirectTo:"/chat"})}>
                        <img className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                        <span>Login with Google</span>
                    </button>
      
                
                    <button className="text-slate-800 px-5 py-2.5 gap-2 font-medium flex flex-row justify-center items-center text-center bg-slate-200 rounded-md border border-slate-300 hover:bg-slate-300 duration-150 ease-in-out cursor-pointer">
                    <img className="w-5 h-5" src="https://www.svgrepo.com/show/512317/github-142.svg" loading="lazy" alt="github logo"></img>
                    Sign in with Github
                    </button>
          
            </div>
        </div>
    )
}
