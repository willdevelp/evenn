import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({});

export const {useSession, signIn, signOut, signUp} = authClient

  // const signInWithGoogle = async () => {
  //   await authClient.signIn.social({
  //     provider: "google",
  //   });
  // };
