// Debug script to test affiliate registrations connection
// Run this in your browser console or as a separate test file

import { supabase } from './src/lib/supabase.js';

async function debugAffiliateConnection() {
  console.log('🔍 Debugging Affiliate Connection...');
  
  try {
    // Test 1: Check if we can connect to Supabase
    console.log('\n1. Testing Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('affiliate_registrations')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('❌ Connection Error:', connectionError);
      
      // Check if table exists
      if (connectionError.code === '42P01') {
        console.log('💡 Table "affiliate_registrations" does not exist!');
        console.log('📝 You need to run the SQL migration first.');
        return;
      }
      
      // Check RLS policies
      if (connectionError.code === '42501' || connectionError.message.includes('RLS')) {
        console.log('🔒 RLS Policy Issue - checking policies...');
        await checkRLSPolicies();
        return;
      }
    } else {
      console.log('✅ Connection successful!');
      console.log(`📊 Total records: ${connectionTest.count}`);
    }

    // Test 2: Try to fetch data
    console.log('\n2. Testing data fetch...');
    const { data: affiliates, error: fetchError } = await supabase
      .from('affiliate_registrations')
      .select('*')
      .limit(5);
    
    if (fetchError) {
      console.error('❌ Fetch Error:', fetchError);
    } else {
      console.log('✅ Data fetch successful!');
      console.log('📋 Sample data:', affiliates);
      
      if (affiliates.length === 0) {
        console.log('⚠️ No affiliate registrations found in database');
        console.log('💡 Try inserting a test record from your marketing site');
      }
    }

    // Test 3: Check table structure
    console.log('\n3. Checking table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'affiliate_registrations' });
    
    if (!tableError && tableInfo) {
      console.log('📋 Table columns:', tableInfo);
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

async function checkRLSPolicies() {
  console.log('\n🔒 Checking RLS Policies...');
  
  try {
    // Try with different approaches
    const tests = [
      { name: 'Anonymous access', client: supabase },
    ];
    
    for (const test of tests) {
      console.log(`\nTesting ${test.name}...`);
      const { data, error } = await test.client
        .from('affiliate_registrations')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error(`❌ ${test.name} failed:`, error.message);
      } else {
        console.log(`✅ ${test.name} works!`);
      }
    }
  } catch (error) {
    console.error('Policy check error:', error);
  }
}

// Test insert capability
async function testInsert() {
  console.log('\n📝 Testing insert capability...');
  
  const testData = {
    full_name: 'Test Affiliate',
    email: `test-${Date.now()}@example.com`,
    mobile_number: '+1234567890',
    description: 'Test affiliate registration from debug script'
  };
  
  const { data, error } = await supabase
    .from('affiliate_registrations')
    .insert(testData)
    .select();
  
  if (error) {
    console.error('❌ Insert failed:', error);
  } else {
    console.log('✅ Insert successful:', data);
  }
}

// Run the debug
debugAffiliateConnection();

// Uncomment to test insert
// testInsert();

console.log(`
🔧 Debug Commands:
- debugAffiliateConnection() - Run full diagnostic
- testInsert() - Test inserting a record
- checkRLSPolicies() - Check access policies

📋 Common Solutions:
1. Run the SQL migration: affiliate-registrations-migration-enhanced.sql
2. Check RLS policies in Supabase dashboard
3. Verify environment variables in .env file
4. Check if marketing site is using correct table name
`);