import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    
    console.log('Testing admin login for:', email)

    // Test the signin function
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data?.user) {
      return NextResponse.json({ error: 'No user returned' }, { status: 400 })
    }

    console.log('Login successful, user:', data.user.id)

    // Check if this is admin login
    const isAdmin = email === 'admin@gmail.com' && password === 'admin@1234'
    
    if (isAdmin) {
      console.log('Admin login detected, updating role...')
      // Update user profile with admin role
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ role: 'admin' })
        .eq('user_id', data.user.id)
      
      if (profileError) {
        console.error('Error updating admin role:', profileError)
      } else {
        console.log('Admin role updated successfully')
      }
    }

    // Get user profile to check role
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', data.user.id)
      .single()

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profileData?.role || 'user',
        isAdmin: profileData?.role === 'admin' || data.user.email === 'admin@gmail.com'
      },
      isAdmin: profileData?.role === 'admin' || data.user.email === 'admin@gmail.com'
    })

  } catch (error) {
    console.error('Test login error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}