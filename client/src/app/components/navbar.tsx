"use client"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useState } from "react"

export default function Navbar() {
    const { data: session } = useSession()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    console.log(session?.user?.image)
    if (!session?.user) return null

    return (
        <nav className="bg-white shadow-sm shadow-black/15 w-full">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
                <div className="text-lg font-semibold font-paragraph">Placeholder for model selection</div>
                <div>
                    <img
                        src={session?.user?.image as string}
                        alt="User Image"
                        className="relative h-10 w-10 rounded-full bg-slate-200 hover:bg-slate-300 duration-150 ease-in-out p-1 cursor-pointer"
                        onClick={toggleDropdown}
                    />
                    {isDropdownOpen && (
                        <div 
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
                        >
                            <div className="py-1">
                                <h1 className="text-sm font-semibold font-paragraph">{session.user.email}</h1>
                                <button
                                    onClick={() => signOut({ redirectTo: '/' })}
                                    className="w-full text-left p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200 font-paragraph"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
