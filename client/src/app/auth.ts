import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

export const {handlers, signIn, signOut, auth}=NextAuth({
    providers:[Google, GitHub],
    secret:process.env.NEXTAUTH_SECRET
})