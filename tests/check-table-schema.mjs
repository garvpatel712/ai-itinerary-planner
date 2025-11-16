// Script to check the actual table schema
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahpphstloxuecpznkyqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocHBoc3Rsb3h1ZWNwem5reXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTM0ODQsImV4cCI6MjA3MzUyOTQ4NH0.mF2Hcunr_GbEMfv5x2LSzq7NhnlhWl8ppzZP5yoZKYo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableSchema() {
  console.log('🔍 Checking actual itineraries table schema...\n');

  try {
    // Query to get table schema information
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'itineraries')
      .order('ordinal_position');

    if (error) {
      console.log('❌ Error checking schema:', error.message);
      
      // Try a simpler approach - just select from the table
      console.log('\n🔍 Trying to query the table directly...');
      const { data: tableData, error: tableError } = await supabase
        .from('itineraries')
        .select('*')
        .limit(1);

      if (tableError) {
        console.log('❌ Table does not exist or is not accessible:', tableError.message);
      } else {
        console.log('✅ Table exists!');
        if (tableData && tableData.length > 0) {
          console.log('📋 Available columns:', Object.keys(tableData[0]));
        } else {
          console.log('📋 Table is empty, but exists');
        }
      }
    } else {
      console.log('✅ Table schema found:');
      console.log('📋 Columns:');
      data.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable ? '(nullable)' : '(required)'} ${col.column_default ? `default: ${col.column_default}` : ''}`);
      });
    }

  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

checkTableSchema();