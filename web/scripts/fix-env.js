const fs = require('fs');
const content = `DATABASE_URL="postgresql://postgres.nkqpthvoxywnhsexpwcx:ANA%40kesho123@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
SHIPBLU_API_KEY="VV2ZTYcE.Z24r7q3f4NnXUvmUnkPTSMRijIMDqu8X"
`;
// Next.js handles quotes in .env automatically, but let's be standard.
// Actually standard .env often uses quotes for values with special chars.
// Let's rely on node writing it cleanly.
fs.writeFileSync('.env', content, { encoding: 'utf8' });
console.log('.env fixed');
