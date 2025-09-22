"use client"

import {
useState }
from "react"

import {
Button }
from "@/components/ui/button"

import {
Input }
from "@/components/ui/input"

import {
Label }
from "@/components/ui/label"

import {
Modal,
 ModalContent,
 ModalDescription,
 ModalFooter,
 ModalHeader,
 ModalTitle,
}
from "@/components/ui/modal"

import {
useAuth }
from "@/contexts/AuthContext"

import {
Loader2 , Eye , EyeOff }
from "lucide-react"

interface AuthModalProps {
isOpen: boolean

  onClose: () => void

  mode: "login" | "signup"

  onModeChange: (mode: "login" | "signup") => void
}
export function AuthModal({
isOpen, onClose, mode, onModeChange }
: AuthModalProps) {
const {
login, register }
= useAuth()
  
  const [data, setData] = useState({
firstName: "",
    lastName: "",
    email: "",
    password: "",
  }
)

  const [seePass, setSeePass] = useState(false)
  
  const [loading, setLoading] = useState(false)
  
  const [err, setErr] = useState("")

  const handleForm = async (evt: React.FormEvent) => {
evt.preventDefault()

    setLoading(true)

    setErr("")

    try {
if (mode === "login") {
await login(data.email, data.password)
      }
else {
await register(data.firstName, data.lastName, data.email, data.password)
      }
onClose()
      setData({
firstName: "", lastName: "", email: "", password: "" }
)
    }
catch (e: any) {
setErr(e.response?.data?.message || "An error occurred. Please try again.")
    }
finally {
setLoading(false)
    }
}
const handleInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
setData(prev => ({
...prev,
      [evt.target.name]: evt.target.value
    }
))
  }
const flipMode = () => {
onModeChange(mode === "login" ? "signup" : "login")

    setErr("")

    setData({
firstName: "", lastName: "", email: "", password: "" }
)
  }
return (
    <Modal open={
isOpen}
onOpenChange={
onClose}
>

      <ModalContent className="sm:max-w-md">

        <ModalHeader>
          <ModalTitle>
            {
mode === "login" ? "Welcome back" : "Create your account"}
</ModalTitle>
          <ModalDescription>
            {
mode === "login" 
              ? "Sign in to your HustleBoard account to continue tracking your side hustles."
              : "Join HustleBoard and start tracking your side hustles, earnings, and growth opportunities."
            }
</ModalDescription>
        </ModalHeader>
        <form onSubmit={
handleForm}
className="space-y-4">
          {
mode === "signup" && (
            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">

                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={
data.firstName}
onChange={
handleInput}
required
                  disabled={
loading}
/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={
data.lastName}
onChange={
handleInput}
required
                  disabled={
loading}
/>
              </div>
            </div>
          )}
<div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={
data.email}
onChange={
handleInput}
required
              disabled={
loading}
/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">

              <Input
                id="password"
                name="password"
                type={
seePass ? "text" : "password"}
value={
data.password}
onChange={
handleInput}
required
                disabled={
loading}
minLength={
6}
/>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={
() => setSeePass(!seePass)}
disabled={
loading}
>
                {
seePass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
</Button>
            </div>
            {
mode === "signup" && (
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            )}
</div>

          {
err && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {
err}
</div>
          )}
<ModalFooter className="flex-col space-y-2">

            <Button type="submit" className="w-full" disabled={
loading}
>
              {
loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {
mode === "login" ? "Signing in..." : "Creating account..."}
</>
              ) : (
                mode === "login" ? "Sign in" : "Create account"
              )}
</Button>

          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )

}
