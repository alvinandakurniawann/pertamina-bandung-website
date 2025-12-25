// Script untuk create admin user dengan password
// Jalankan: node scripts/create-admin-user.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE harus di-set di .env.local')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = 'alvinnanda@pertamina.com'
  const password = 'Sdp!juli2004bandung'
  
  console.log(`Creating user: ${email}...`)
  
  try {
    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)
    
    if (existingUser) {
      console.log('User sudah ada. Mengupdate password...')
      
      // Update password
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password: password }
      )
      
      if (error) {
        console.error('Error updating password:', error)
        process.exit(1)
      }
      
      console.log('✅ Password berhasil diupdate!')
      console.log(`User ID: ${existingUser.id}`)
      console.log(`Email: ${email}`)
    } else {
      // Create new user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Auto-confirm email
      })
      
      if (error) {
        console.error('Error creating user:', error)
        process.exit(1)
      }
      
      console.log('✅ User berhasil dibuat!')
      console.log(`User ID: ${data.user.id}`)
      console.log(`Email: ${data.user.email}`)
    }
    
    // Insert ke dummy_accounts untuk tracking
    const { error: dbError } = await supabaseAdmin
      .from('dummy_accounts')
      .upsert({
        email: email,
        is_active: true,
        notes: 'Admin user dengan password'
      }, {
        onConflict: 'email'
      })
    
    if (dbError) {
      console.warn('Warning: Gagal insert ke dummy_accounts:', dbError.message)
    } else {
      console.log('✅ User ditambahkan ke dummy_accounts untuk tracking')
    }
    
    console.log('\n✅ Selesai! User bisa login dengan:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

createAdminUser()

