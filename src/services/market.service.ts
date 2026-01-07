import { exchanges, MarketUtils } from '../exchanges/index.js';
import { MarketData } from '../types/market.js';

export class MarketService {
  async fetchAllMarkets(): Promise<MarketData[]> {
    const results = await Promise.allSettled(
      Object.entries(exchanges).map(async ([name, exchange]) => {
        try {
          let markets: any[] = [];
          
          // Polymarket's fetchMarkets uses a limited 'sampling' API.
          // searchMarkets uses the full Gamma API which provides much better data.
          // if ('searchMarkets' in exchange) {
          //   markets = await (exchange as any).searchMarkets({ limit: 5000, offset: 0 });
          // } else {
            markets = await exchange.fetchMarkets({ limit: 1000, offset: 0, active: true, closed: true });
          // }
          
          return markets.map((m: any) => {
            // For Kalshi, questions often look like complex parlay strings.
            // We prioritize the most descriptive field available.
            let question = m.question;
            if (name === 'kalshi' && m.metadata) {
              question = m.metadata.subtitle || m.metadata.event_title || m.metadata.title || m.question;
            }

            // Ensure we don't have BigInt values which crash JSON.stringify in Vercel/Express
            const normalizeNumber = (val: any) => {
              if (val === null || val === undefined) return 0;
              if (typeof val === 'bigint') return Number(val);
              if (typeof val === 'string') return parseFloat(val) || 0;
              return Number(val) || 0;
            };

            const formatDate = (date: any) => {
              if (!date) return '';
              try {
                if (date instanceof Date) return date.toISOString();
                if (typeof date === 'string' || typeof date === 'number') {
                  return new Date(date).toISOString();
                }
                return String(date);
              } catch (e) {
                return '';
              }
            };

            return {
              id: String(m.id || m.uid || ''),
              platform: name,
              question: question || 'Unknown Question',
              outcomes: Array.isArray(m.outcomes) ? m.outcomes.map(String) : [],
              prices: m.prices ? Object.values(m.prices).map(normalizeNumber) : [],
              liquidity: normalizeNumber(m.liquidity),
              volume: normalizeNumber(m.volume),
              endDate: formatDate(m.closeTime),
              url: m.url || (m.metadata?.market_slug ? `https://polymarket.com/event/${m.metadata.market_slug}` : ''),
              isBinary: Boolean(MarketUtils.isBinary(m)),
              isOpen: Boolean(MarketUtils.isOpen(m)),
            };
          });
        } catch (error: any) {
          console.error(`[${name}] Error fetching markets:`, error);
          return [];
        }
      })
    );

    const allMarkets = results
      .filter((r): r is PromiseFulfilledResult<any[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value);

    return allMarkets;
  }
}

export const marketService = new MarketService();
