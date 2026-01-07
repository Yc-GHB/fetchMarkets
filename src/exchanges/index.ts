import { createExchange, MarketUtils } from '@alango/dr-manhattan';
import dotenv from 'dotenv';

dotenv.config();

export const exchanges = {
  polymarket: createExchange('polymarket'),
  limitless: createExchange('limitless'),
  kalshi: createExchange('kalshi'),
  // predictfun: createExchange('predictfun', {
  //   apiKey: process.env.PREDICTFUN_API_KEY,
  //   privateKey: process.env.PREDICTFUN_PRIVATE_KEY,
  // }),
  // opinion: createExchange('opinion', {
  //   apiKey: process.env.OPINION_API_KEY
  // }),
};

export { MarketUtils };
export type ExchangeKey = keyof typeof exchanges;
export const getAllExchanges = () => Object.entries(exchanges);
