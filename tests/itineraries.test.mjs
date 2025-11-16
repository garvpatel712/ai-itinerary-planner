import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const TEST_USER_ID = process.env.TEST_USER_ID

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !TEST_USER_ID) {
  console.error('Please set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and TEST_USER_ID in your environment.')
  process.exit(2)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function run() {
  console.log('Running itineraries test...')

  // Cleanup any existing test rows (best effort)
  await supabase.from('itineraries').delete().eq('user_id', TEST_USER_ID).ilike('source', 'ai-generator-v1%')

  // Insert three itineraries with different created_at for ordering
  const now = new Date()
  const rows = [
    { destination: 'Alpha', user_id: TEST_USER_ID, title: 'Alpha trip', source: 'ai-generator-v1', payload: { marker: 'a' }, created_at: new Date(now.getTime() - 10000).toISOString() },
    { destination: 'Beta', user_id: TEST_USER_ID, title: 'Beta trip', source: 'ai-generator-v1', payload: { marker: 'b' }, created_at: new Date(now.getTime() - 5000).toISOString() },
    { destination: 'Gamma', user_id: TEST_USER_ID, title: 'Gamma trip', source: 'ai-generator-v1', payload: { marker: 'c' }, created_at: now.toISOString() },
  ]

  const { data: insertData, error: insertError } = await supabase.from('itineraries').insert(rows).select()
  if (insertError) {
    console.error('Insert error:', insertError)
    process.exit(3)
  }

  console.log('Inserted rows:', insertData.map(r => r.id))

  // Query back and check ordering (most recent first)
  const { data: items, error: selectError } = await supabase.from('itineraries').select('*').eq('user_id', TEST_USER_ID).order('created_at', { ascending: false })
  if (selectError) {
    console.error('Select error:', selectError)
    process.exit(4)
  }

  const titles = items.map(i => i.title)
  console.log('Titles in DB order:', titles)

  if (titles[0] !== 'Gamma' || titles[1] !== 'Beta' || titles[2] !== 'Alpha') {
    console.error('Ordering assertion failed')
    process.exit(5)
  }

  console.log('Ordering OK. Total rows:', items.length)

  // Count check via SQL
  const { count } = await supabase.from('itineraries').select('*', { count: 'exact' }).eq('user_id', TEST_USER_ID)
  console.log('Exact count for user:', count)

  console.log('\nTest completed successfully.\n')
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(99) })
