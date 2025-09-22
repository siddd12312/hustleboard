"use client"

import Link from "next/link"

import {
usePathname }
from "next/navigation"

import {
useState }
from "react"

import {
Button }
from "@/components/ui/button"

import {
Avatar, AvatarFallback, AvatarImage }
from "@/components/ui/avatar"

import {
DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger }
from "@/components/ui/dropdown-menu"

import {
TrendingUp, User, LogOut, Settings }
from "lucide-react"

import {
useAuth }
from "@/contexts/AuthContext"

import {
AuthModal }
from "./auth-modal"





export function Navigation() {
const loc = usePathname()

  const {
user, isAuthenticated, logout }
= useAuth()

  const [showAuthModal, setShowAuthModal] = useState(false)

  const [authType, setAuthType] = useState<"login" | "signup">("login")



  const navArr = [

    {
href: "/opportunities", label: "Opportunities" }
,

    {
href: "/dashboard", label: "Dashboard" }
,

    {
href: "/profile", label: "Profile" }
,

  ]



  const isCurrent = (hr: string) => loc.startsWith(hr)



  const handleLogout = () => {
logout()
    console.log("logout")
  }
return (

    <nav className="border-b border-border bg-primary sticky top-0 z-50">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center space-x-2">

            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">

              <TrendingUp className="w-5 h-5 text-primary-foreground" />

            </div>

            <span className="text-xl font-serif font-black text-white transition-all duration-300 hover:scale-105">

              HustleBoard

            </span>

          </Link>





          <div className="flex items-center space-x-2 sm:space-x-6">

            {
isAuthenticated && navArr.map((it) => (

              <Link

                key={
it.href}
href={
it.href}
className={
`hidden sm:block transition-all duration-300 hover:scale-105 rounded-lg px-3 py-1 ${
isCurrent(it.href) ? "text-white font-bold bg-white/10" : "text-white/80 hover:text-white hover:bg-white/5 font-semibold"
                }
`}
>

                {
it.label}
</Link>

            ))}
{
isAuthenticated ? (

              <DropdownMenu>

                <DropdownMenuTrigger asChild>

                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">

                    <Avatar className="h-8 w-8 transition-all duration-300 hover:scale-110 hover:shadow-lg">

                      <AvatarImage src="https://via.placeholder.com/32x32/6366f1/ffffff?text=U" alt={
user?.firstName}
/>

                      <AvatarFallback className="bg-primary/10 text-primary">

                        <User className="w-4 h-4" />

                      </AvatarFallback>

                    </Avatar>

                  </Button>

                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end" forceMount>

                  <div className="flex items-center justify-start gap-2 p-2">

                    <div className="flex flex-col space-y-1 leading-none">

                      <p className="font-medium">{
user?.firstName}
{
user?.lastName}
</p>

                      <p className="w-[200px] truncate text-sm text-muted-foreground">

                        {
user?.email}
</p>

                    </div>

                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>

                    <Link href="/profile" className="flex items-center">

                      <User className="mr-2 h-4 w-4" />

                      <span>Profile</span>

                    </Link>

                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>

                    <Link href="/settings" className="flex items-center">

                      <Settings className="mr-2 h-4 w-4" />

                      <span>Settings</span>

                    </Link>

                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={
handleLogout}
className="text-red-600">

                    <LogOut className="mr-2 h-4 w-4" />

                    <span>Log out</span>

                  </DropdownMenuItem>

                </DropdownMenuContent>

              </DropdownMenu>

            ) : (

              <div className="flex items-center space-x-1 sm:space-x-2">

                <Button 

                  variant="ghost" 

                  size="sm" 

                  className="text-xs sm:text-sm px-2 sm:px-3 text-white hover:bg-white/20 font-semibold rounded-lg transition-all duration-300 hover:scale-105"

                  onClick={
() => {
setAuthType("login")

                    setShowAuthModal(true)

                  }
}
>

                  Sign In

                </Button>

                <Button 

                  size="sm" 

                  className="text-xs sm:text-sm px-2 sm:px-3 bg-white text-primary hover:bg-white/90 font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"

                  onClick={
() => {
setAuthType("signup")

                    setShowAuthModal(true)

                  }
}
>

                  Sign Up

                </Button>

              </div>

            )}
</div>

        </div>

      </div>



      <AuthModal 

        isOpen={
showAuthModal}
onClose={
() => setShowAuthModal(false)}
mode={
authType}
onModeChange={
setAuthType}
/>

    </nav>

  )

}
