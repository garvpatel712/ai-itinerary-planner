import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create admin user with fixed credentials
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@gmail.com',
      password: 'admin@1234',
      email_confirm: true,
      user_metadata: {
        name: 'Admin User',
        role: 'admin'
      }
    })

    if (authError) {
      console.error('Error creating admin user:', authError)
      return Response.json({ error: authError.message }, { status: 400 })
    }

    // Create user profile with admin role
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: authData.user.id,
        name: 'Admin User',
        email: 'admin@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff',
        bio: 'System Administrator',
        location: 'System',
        role: 'admin'
      })

    if (profileError) {
      console.error('Error creating admin profile:', profileError)
      return Response.json({ error: profileError.message }, { status: 400 })
    }

    return Response.json({ 
      success: true, 
      message: 'Admin user created successfully',
      user: {
        email: 'admin@gmail.com',
        password: 'admin@1234'
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}