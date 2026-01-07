import { Router, Request, Response } from 'express';
import { marketService } from '../services/market.service.js';

const router = Router();

router.get('/markets', async (req: Request, res: Response) => {
  try {
    const markets = await marketService.fetchAllMarkets();
    res.json({
      success: true,
      timestamp: Date.now(),
      count: markets.length,
      data: markets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
