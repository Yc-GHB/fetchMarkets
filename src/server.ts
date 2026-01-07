import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import marketRoutes from './routes/market.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', marketRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: "Market Aggregator API",
    version: "1.0.0",
    endpoints: {
      markets: "/api/markets",
      health: "/health"
    },
    supported_platforms: ["Polymarket", "Limitless", "Opinion", "Kalshi"]
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Export app for Vercel
export default app;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Market Aggregator Service running on http://localhost:${PORT}`);
    console.log(`📊 API Endpoint: http://localhost:${PORT}/api/markets`);
  });
}
