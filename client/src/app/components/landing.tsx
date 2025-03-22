import { signIn } from "../auth"

export default function Landing(){
    return(
        <>
            <div className="max-w-7xl m-auto flex flex-col items-center justify-center text-center">
                <h1 className="font-display text-8xl font-semibold text-blue-500">BLOCKGPT</h1>
            </div>

            <form
              action={async () => {
                "use server"
                await signIn("google")
              }}
            >
              <button type="submit">Signin with Google</button>
            </form>
        </>
    )
}