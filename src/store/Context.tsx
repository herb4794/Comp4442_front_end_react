import type React from "react";
import { createContext, useState } from "react";
import { AuthUser, ContextTypes } from "../type/Type";



export const ContextObj = createContext<ContextTypes>({
  user: "",
  loginStatus: true,
  setAuth: () => { },
  signOut: () => { },
  auth: { email: "", photoURL: "", displayName: "" }
})

const ContextProvider: React.FC<{ children: any }> = (props: any) => {

  const [user, setUser] = useState<ContextTypes['user']>("")
  const [auth, setAuth] = useState<AuthUser>({ displayName: "", photoURL: "", email: "" })
  const [signOut, setSignOut] = useState<any>()
  const [loginStatus, setLoginStatus] = useState<boolean>(true)

  const runSetAuth = (auth: AuthUser) => {
    setAuth(auth)
  }

  const runSetSignOut = () => {
  }

  const contextValue: ContextTypes = {
    user: user,
    setAuth: runSetAuth,
    signOut: runSetSignOut,
    loginStatus: loginStatus,
    auth: auth,

  }

  return <ContextObj.Provider value={contextValue}>{props.children}</ContextObj.Provider>


}

export default ContextProvider
