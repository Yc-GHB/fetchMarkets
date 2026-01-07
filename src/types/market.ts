export interface MarketData {
  id: string;
  platform: string;
  question: string;
  outcomes: string[];
  prices: number[];
  liquidity: number;
  volume: number;
  endDate: string;
  url: string;
}

export interface UnifiedMarketResponse {
  success: boolean;
  timestamp: number;
  data: MarketData[];
}
