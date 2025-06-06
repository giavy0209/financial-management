/** @format */

"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentUser } from "@/store/features/user/userSlice"
import { AppDispatch, RootState } from "@/store/store"
import Cookies from "js-cookie"

export default function InitializeUser() {
  const dispatch = useDispatch<AppDispatch>()
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)

  useEffect(() => {
    // Check if we have a token in cookies
    const token = Cookies.get("token")
    if (token && !isLoggedIn) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, isLoggedIn])

  // This component doesn't render anything
  return null
}
