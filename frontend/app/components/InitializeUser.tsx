/** @format */

"use client"

import Cookies from "js-cookie"
import { useDispatch, useSelector } from "react-redux"

import { useEffect } from "react"

import { getCurrentUser } from "@/store/features/user/userSlice"
import { AppDispatch, RootState } from "@/store/store"

/** @format */

/** @format */

/** @format */

/** @format */

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
