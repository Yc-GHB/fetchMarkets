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
            markets = await exchange.fetchMarkets({ limit: 5000,offset: 0,active: true,closed: true });
          // }
          
          return markets.map((m: any) => {
            // For Kalshi, questions often look like complex parlay strings.
            // We prioritize the most descriptive field available.
            let question = m.question;
            if (name === 'kalshi' && m.metadata) {
              question = m.metadata.subtitle || m.metadata.event_title || m.metadata.title || m.question;
            }

            return {
              id: m.id || m.uid,
              platform: name,
              question: question || 'Unknown Question',
              outcomes: m.outcomes || [],
              prices: m.prices ? Object.values(m.prices).map((p: any) => typeof p === 'number' ? p : parseFloat(p)) : [],
              liquidity: m.liquidity || 0,
              volume: m.volume || 0,
              endDate: m.closeTime?.toISOString() || '',
              url: m.url || (m.metadata?.market_slug ? `https://polymarket.com/event/${m.metadata.market_slug}` : ''),
              isBinary: MarketUtils.isBinary(m),
              isOpen: MarketUtils.isOpen(m),
            };
          });
        } catch (error: any) {
          console.warn(`[${name}] Skip fetching: ${error.message}`);
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
