"use client"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Image from "next/image"


export default function Navbar(){

    const { data: session } = useSession()

    if (!session?.user) return null

    return(
        <>
            <div className="flex flex-col">
            <Image src={session?.user?.image as string} width={500} height={500} alt="User Image"></Image>
            <h1>{session.user.email}</h1>
            <button onClick={() => signOut({redirectTo:'/'})} className="hover:bg-red-700 p-2">Sign Out</button>
            </div>
           
        </>
    )
}