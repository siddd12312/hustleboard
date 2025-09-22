"use client"

import {
Navigation }
from "@/components/navigation"

import {
UserProfile }
from "@/components/user-profile"

export default function ProfilePage( ) {
return (

    <div className="min-h-screen bg-background relative"
    >

      <div className="absolute inset-0 opacity-25"
      >
        <div className="absolute inset-0"
            style={
{
backgroundImage: `
            linear-gradient(45deg, transparent 40%, #dc2626 40%, #dc2626 45%, transparent 45%, transparent 55%, #dc2626 55%, #dc2626 60%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, #dc2626 40%, #dc2626 45%, transparent 45%, transparent 55%, #dc2626 55%, #dc2626 60%, transparent 60%)
          `,

          backgroundSize: '80px 80px',
          backgroundPosition: '0 0, 40px 40px',
          animation: 'drift 120s linear infinite'
        }
}
/>

      </div>


      <style jsx>
      {
`
        @keyframes drift {
0% {
transform: translateX(0px) translateY(0px);
}
25% {
transform: translateX(10px) translateY(-5px);
}
50% {
transform: translateX(5px) translateY(-10px);
}
75% {
transform: translateX(-5px) translateY(-3px);
}
100% {
transform: translateX(0px) translateY(0px);
}
}
`}
</style>
      

      <Navigation />

      <main className="py-8 relative z-10"
      >

        <UserProfile />

      </main>

    </div>
  )

}
