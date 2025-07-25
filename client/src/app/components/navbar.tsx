'use client'

import { ChevronDown, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'


type NavbarProps = {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
};


export default function Navbar({ selectedModel, setSelectedModel }: NavbarProps) {
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  if (!session?.user) return null

  return (
    <nav className="w-full bg-white">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-6">

        {/* User Model Selection */}
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full appearance-none bg-white text-slate-700 text-sm border border-slate-300 rounded-lg pl-3 pr-10 py-2 cursor-pointer"
          >
            <option value="llama3-8b-8192">Llama3-8B</option>
            <option value="qwen/qwen3-32b">Qwen3-32B</option>
            <option value="gemma2-9b-it">Gemma2-9B</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
            <ChevronDown className='h-4 w-4' />
          </div>
        </div>

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
                  className="flex items-center w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm font-paragraph text-red-600 transition-colors duration-200 hover:bg-red-100"
                >
                  Sign Out
                  <LogOut className='h-4 w-4 ml-2'/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
