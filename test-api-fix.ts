import { createExchange } from '@alango/dr-manhattan';

async function test() {
  // Test 1: Standard Kalshi (Current Library behavior)
  const kalshiDefault = createExchange('kalshi');
  console.log('Kalshi Default API:', (kalshiDefault as any).apiUrl);
  try {
     const ms1 = await kalshiDefault.fetchMarkets({ limit: 5 });
     console.log('Default markets count:', ms1.length);
  } catch(e: any) { console.log('Default error:', e.message); }

  // Test 2: Custom Kalshi Main API
  const kalshiMain = createExchange('kalshi', {
      apiUrl: 'https://api.kalshi.com/trade-api/v2'
  });
  console.log('\nKalshi Main API:', (kalshiMain as any).apiUrl);
  try {
     const ms2 = await kalshiMain.fetchMarkets({ limit: 5 });
     console.log('Main markets count:', ms2.length);
     if (ms2.length > 0) {
         console.log('Sample from main:', ms2[0].question);
     }
  } catch(e: any) { console.log('Main error:', e.message); }

  // Test 3: Polymarket searchMarkets
  const poly = createExchange('polymarket');
  console.log('\nPolymarket searchMarkets (Gamma API):');
  try {
      const ms3 = await (poly as any).searchMarkets({ limit: 5 });
      console.log('Search results count:', ms3.length);
      if (ms3.length > 0) {
          console.log('Sample from search:', ms3[0].question);
      }
  } catch(e: any) { console.log('Search error:', e.message); }
}

test();
