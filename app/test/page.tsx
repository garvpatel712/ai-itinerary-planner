"use client"

import { useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function TestSupabasePage() {
  useEffect(() => {
    console.log("TestSupabasePage useEffect running")
    const testSupabaseConnection = async () => {
      try {
        const { error } = await supabase.from("test").select("*").limit(1)

        if (error && error.message.includes('relation "test" does not exist')) {
          console.log("Supabase connection is successful!")
        } else if (error) {
          console.error("Error connecting to Supabase:", error.message)
        } else {
          console.log("Supabase connection is successful!")
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err)
      }
    }

    testSupabaseConnection()
  }, [])

  return (
    <div>
      <h1>Testing Supabase Connection</h1>
      <p>Check the browser console for the connection status.</p>
    </div>
  )
}