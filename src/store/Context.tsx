import type React from "react"
import { createContext, useState, useEffect } from "react"
import { AuthUser, ContextTypes } from "../type/Type"

export const ContextObj = createContext<ContextTypes>({
  user: "",
  loginStatus: false,
  setAuth: () => { },
  signOut: () => { },
  auth: { email: "" }
})

const ContextProvider: React.FC<{ children: any }> = (props) => {

  const [user, setUser] = useState("")
  const [auth, setAuth] = useState<AuthUser>({ email: "" })
  const [loginStatus, setLoginStatus] = useState(false)

  // Login（setAuth）
  const runSetAuth = (auth: AuthUser) => {
    setAuth(auth)
    setUser(auth.email)
    setLoginStatus(true)

    // persist
    localStorage.setItem("user", JSON.stringify(auth))
  }

  //  Logout
  const runSignOut = () => {
    setAuth({ email: "" })
    setUser("")
    setLoginStatus(false)

    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  // App init（auto login）
  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setAuth(parsed)
      setUser(parsed.email)
      setLoginStatus(true)
    }
  }, [])

  const contextValue: ContextTypes = {
    user,
    setAuth: runSetAuth,
    signOut: runSignOut,
    loginStatus,
    auth,
  }

  return (
    <ContextObj.Provider value={contextValue}>
      {props.children}
    </ContextObj.Provider>
  )
}

export default ContextProvider
