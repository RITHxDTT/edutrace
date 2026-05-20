"use client"
// import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'


export default function Page() {
  // const {data:session} = useSession();
  // useEffect(()=>{
  //   if(session){
  //     console.log("Seasion: ", session)
  //     console.log("Refresh token: ", session.refreshToken)
  //     console.log("access token: ", session.accessToken)
  //   }
  // },[session])
  return (
    <div>
      <p>Hello World, happy coding</p>
    </div>
  )
}
