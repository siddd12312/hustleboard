import type React from "react"

import type {
Metadata }
from "next"

import {
Inter }
from "next/font/google"

import {
Crimson_Text }
from "next/font/google"

import {
JetBrains_Mono }
from "next/font/google"

import {
Analytics }
from "@vercel/analytics/next"

import {
Suspense }
from "react"

import {
AuthProvider }
from "@/contexts/AuthContext"

import "./globals.css"





const a = Inter({
subsets : [ "latin" ] ,

   variable: "--font-inter",

      display: "swap",

}
)




const b = Crimson_Text({
subsets: [ "latin" ],

  weight: [ "400", "600", "700" ],

  variable: "--font-crimson",

   display: "swap",

}
)



const c = JetBrains_Mono({
subsets: [ "latin" ],

   variable: "--font-jetbrains",

   display: "swap",

}
)






export const metadata: Metadata = {
title: "HustleBoard - Grow Your Side Hustle Income",

      description: "Discover opportunities, track earnings, and grow your skills with HustleBoard",

      generator: "v0.app",

}
export default function RootLayout({
children,
}
: Readonly<{
children: React.ReactNode
}
>) {
return (

      <html lang="en">

        <body className={
"font-sans " + a.variable + " " + b.variable + " " + c.variable + " antialiased" }
>

                  <AuthProvider>

                 <Suspense fallback={
null}
>

                    {
children}
</Suspense>

                </AuthProvider>


              <Analytics />

        </body>

      </html>

   )

}
