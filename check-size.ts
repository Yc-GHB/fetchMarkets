import { marketService } from './src/services/market.service.js';

async function checkSize() {
  console.log('Fetching markets...');
  const markets = await marketService.fetchAllMarkets();
  console.log('Total markets:', markets.length);
  const json = JSON.stringify(markets);
  const sizeMB = json.length / (1024 * 1024);
  console.log('Estimated JSON size (MB):', sizeMB.toFixed(2));
  
  if (sizeMB > 4.5) {
    console.log('WARNING: Size exceeds Vercel 4.5MB limit!');
  }
}

checkSize().catch(console.error);
