'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'


type NavbarProps = {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
};


export default function Navbar({selectedModel, setSelectedModel}:NavbarProps) {
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  if (!session?.user) return null

  return (
    <nav className="w-full bg-white">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">

        {/* User Model Selection */}
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="llama3-8b-8192">LLaMA3-8B</option>
          <option value="qwen/qwen3-32b">Qwen3-32B</option>
          <option value="gemma2-9b-it">Gemma2-9B</option>
        </select>

        {/* User data */}
        <div className="relative">
          <img
            src={session.user.image as string}
            alt="User Image"
            onClick={toggleDropdown}
            className="h-10 w-10 cursor-pointer rounded-full bg-slate-200 p-1 transition-colors duration-150 hover:bg-slate-300"
          />

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-slate-200 bg-white shadow-lg z-50">
              <div className="space-y-3 p-4">
                <div className="space-y-1">
                  <p className="font-paragraph text-xs text-slate-500">
                    User signed in:
                  </p>
                  <p className="font-paragraph text-sm text-slate-900">
                    {session.user.name}
                  </p>
                </div>

                <button
                  onClick={() => signOut({ redirectTo: '/' })}
                  className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm font-paragraph text-red-600 transition-colors duration-200 hover:bg-red-100"
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
