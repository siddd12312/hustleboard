"use client"

import React, {
createContext , useContext , useEffect , useState }
from 'react'

import {
apiClient , User , ApiError }
from '@/lib/api'



interface AuthContextType {
user : User | null

  token : string | null

  isLoading : boolean

  isAuthenticated : boolean

  login : (email : string , password : string) => Promise<void>

  register : (userData : {
firstName : string

    lastName : string

    email : string

    password : string

  }
) => Promise<void>

  logout : () => void

  updateUser : (userData : Partial<User>) => Promise<void>

  error : string | null

  clearError : () => void

}
const AuthContext = createContext<AuthContextType | undefined>(undefined)



export function AuthProvider({
children }
: {
children : React.ReactNode }
) {
const [usr1, setUsr1] = useState<User | null>(null)

   const [tok, setTok] = useState<string | null>(null)

   const [loadin, setLoadin] = useState(true)

   const [err, setErr] = useState<string | null>(null)

   

   const isAuthenticated = !!usr1 && !!tok



   useEffect(() => {
let exTok = typeof window !== 'undefined' ? localStorage.getItem('token') : null

      if (exTok) {
setTok(exTok)

        apiClient.setToken(exTok)

        fetchUserProfile()
      }
else 
      {
setLoadin(false)
      }
}
, [])


   const fetchUserProfile = async () => {
try 
      {
const res = await apiClient.getProfile()

        setUsr1(res.data.user)

      }
catch (e) {
console.log('faild fetch', e)

        logout()
      }
finally 
      {
setLoadin(false)
      }
}
const login = async (eml : string, pwd : string) => {
try 
      {
setErr(null)

        setLoadin(true)

        const resp = await apiClient.login(eml, pwd)

        setUsr1(resp.data.user)

        setTok(resp.data.token)

      }
catch (e) {
if (e instanceof ApiError) {
setErr(e.message)

        }
else 
        {
setErr('Login failed. Please try again.')
        }
throw e
      }
finally 
      {
setLoadin(false)
      }
}
const register = async (usrData : {
firstName : string

      lastName : string

      email : string

      password : string

   }
) => {
try 
      {
setErr(null)

        setLoadin(true)

        const resp2 = await apiClient.register(usrData)

        setUsr1(resp2.data.user)

        setTok(resp2.data.token)

      }
catch (e) {
if (e instanceof ApiError) {
setErr(e.message)
        }
else 
        {
setErr('Registration failed. Please try again.')
        }
throw e
      }
finally 
      {
setLoadin(false)
      }
}
const logout = () => {
apiClient.logout()

      setUsr1(null)

      setTok(null)

   }
const updateUser = async (usrData : Partial<User>) => {
try 
      {
setErr(null)
        const resp3 = await apiClient.updateProfile(usrData)
        setUsr1(resp3.data.user)
      }
catch (e) {
if (e instanceof ApiError) {
setErr(e.message)
        }
else 
        {
setErr('Failed to update profile. Please try again.')
        }
throw e
      }
}
const clearError = () => {
setErr(null)
   }
const value : AuthContextType = {
user : usr1,

      token : tok,

      isLoading : loadin,

      isAuthenticated : isAuthenticated,

      login : login,

      register : register,

      logout : logout,

      updateUser : updateUser,

      error : err,

      clearError : clearError,

   }
return (

    <AuthContext.Provider value={
value}
>

      {
children}
</AuthContext.Provider>

   )
}
export function useAuth() {
const ctx = useContext(AuthContext)
  if (ctx === undefined) {
throw new Error('useAuth must be used within an AuthProvider')
  }
return ctx
}
