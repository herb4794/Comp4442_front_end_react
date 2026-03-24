import React from "react"

export type ContextTypes = {
  user: string
  setAuth: (auth: AuthUser) => void
  auth: AuthUser
  loginStatus: boolean,
  signOut: () => void
}

export type AuthUser = {
  email: string,
  displayName: string
  photoURL?: string
}
