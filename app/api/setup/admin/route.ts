import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  try {
    // This is a setup endpoint to create the admin user
    // In production, this should be a one-time setup script
    
    const { email, password } = await req.json()
    
    if (email !== 'admin@gmail.com' || password !== 'admin@1234') {
      return NextResponse.json({ error: 'Invalid setup credentials' }, { status: 400 })
    }

    // Check if admin user already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id, user_id')
      .eq('email', 'admin@gmail.com')
      .single()

    if (existingUser) {
      return NextResponse.json({ 
        message: 'Admin user already exists', 
        userId: existingUser.user_id,
        existing: true 
      })
    }

    // Create admin user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@gmail.com',
      password: 'admin@1234',
    })

    if (authError) {
      console.error('Admin signup error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 })
    }

    // Create admin profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: authData.user.id,
        email: 'admin@gmail.com',
        name: 'Admin User',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Admin profile creation error:', profileError)
      // Try to clean up the auth user if profile creation failed
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: 'Failed to create admin profile' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Admin user created successfully',
      userId: authData.user.id,
      email: authData.user.email
    })

  } catch (error) {
    console.error('Admin setup error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}