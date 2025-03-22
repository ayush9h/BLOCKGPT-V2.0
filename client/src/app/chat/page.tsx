"use client"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"


export default function Chat(){
    const { data: session } = useSession()

    if (!session?.user) return null

    return (
        <>
        <div>
            <h1>{session.user.email}</h1>
            <button onClick={() => signOut({redirectTo:'/'})} className="hover:bg-red-700 p-2">Sign Out</button>
        </div>
       
        
        </>
    )
}