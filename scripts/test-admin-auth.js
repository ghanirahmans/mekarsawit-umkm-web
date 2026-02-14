const BASE_URL = 'http://localhost:3000';

async function runTest() {
  console.log('🚀 Starting Admin Auth Test...');

  // 1. Login
  console.log('\n1️⃣  Attempting Login...');
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@mekarsawit',
      password: 'admin123',
    }),
  });

  if (!loginRes.ok) {
    console.error('❌ Login failed:', loginRes.status, await loginRes.text());
    process.exit(1);
  }

  const cookieHeader = loginRes.headers.get('set-cookie');
  console.log('✅ Login successful. Set-Cookie header:', cookieHeader);

  if (!cookieHeader || !cookieHeader.includes('admin_token')) {
    console.error("❌ 'admin_token' cookie not found in response headers!");
    process.exit(1);
  }

  // Extract the cookie for the next request
  const adminToken = cookieHeader.split(';')[0]; // simplistic extraction
  console.log('ℹ️  Using cookie:', adminToken);

  // 2. Access Protected API
  console.log('\n2️⃣  Accessing Protected Route (/api/admin/village-codes)...');
  const apiRes = await fetch(`${BASE_URL}/api/admin/village-codes`, {
    headers: {
      Cookie: adminToken,
    },
  });

  if (apiRes.status === 200) {
    console.log('✅ API Access Successful (200 OK)');
    const data = await apiRes.json();
    console.log(
      '   Data received:',
      Array.isArray(data) ? `Array[${data.length}]` : data,
    );
  } else if (apiRes.status === 401) {
    console.error('❌ API Access Failed: 401 Unauthorized');
    console.error('   The server rejected the cookie.');
  } else {
    console.error(`❌ API Access Failed: ${apiRes.status}`);
  }

  // 3. Check Debug Route
  console.log('\n3️⃣  Checking Debug Route (/api/debug-auth)...');
  const debugRes = await fetch(`${BASE_URL}/api/debug-auth`, {
    headers: {
      Cookie: adminToken,
    },
  });
  const debugData = await debugRes.json();
  console.log('   Debug Info:', JSON.stringify(debugData, null, 2));

  if (debugData.session?.isAuthenticated) {
    console.log('✅ Debug route confirms: Authenticated');
  } else {
    console.error('❌ Debug route says: Not Authenticated');
  }
}

runTest().catch(console.error);
