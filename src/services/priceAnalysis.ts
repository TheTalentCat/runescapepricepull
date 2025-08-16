import { PriceData } from '../types';

export class PriceAnalysisService {
  static calculateMovingAverage(prices: number[], period: number): number[] {
    const result: number[] = [];
    
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        result.push(NaN);
      } else {
        const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(sum / period);
      }
    }
    
    return result;
  }

  static calculateRSI(prices: number[], period: number = 14): number[] {
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? Math.abs(change) : 0);
    
    const avgGains = this.calculateMovingAverage(gains, period);
    const avgLosses = this.calculateMovingAverage(losses, period);
    
    return avgGains.map((avgGain, i) => {
      const avgLoss = avgLosses[i];
      if (avgLoss === 0) return 100;
      const rs = avgGain / avgLoss;
      return 100 - (100 / (1 + rs));
    });
  }

  static analyzePrice(priceData: PriceData[]): {
    recommendation: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reason: string;
  } {
    if (priceData.length < 20) {
      return { recommendation: 'HOLD', confidence: 0, reason: 'Insufficient data' };
    }

    const prices = priceData
      .map(d => d.avgHighPrice || d.avgLowPrice)
      .filter((p): p is number => p !== null);

    if (prices.length < 10) {
      return { recommendation: 'HOLD', confidence: 0, reason: 'Insufficient valid price data' };
    }

    const currentPrice = prices[prices.length - 1];
    const ma10 = this.calculateMovingAverage(prices, 10);
    const ma20 = this.calculateMovingAverage(prices, 20);
    const rsi = this.calculateRSI(prices);

    const currentMA10 = ma10[ma10.length - 1];
    const currentMA20 = ma20[ma20.length - 1];
    const currentRSI = rsi[rsi.length - 1];

    let recommendation: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let confidence = 0;
    let reason = '';

    // Simple analysis logic
    if (currentRSI < 30 && currentPrice < currentMA20) {
      recommendation = 'BUY';
      confidence = Math.min(90, (30 - currentRSI) * 2 + 30);
      reason = 'Oversold conditions detected';
    } else if (currentRSI > 70 && currentPrice > currentMA20) {
      recommendation = 'SELL';
      confidence = Math.min(90, (currentRSI - 70) * 2 + 30);
      reason = 'Overbought conditions detected';
    } else if (currentMA10 > currentMA20 && currentPrice > currentMA10) {
      recommendation = 'BUY';
      confidence = 60;
      reason = 'Bullish trend confirmed';
    } else if (currentMA10 < currentMA20 && currentPrice < currentMA10) {
      recommendation = 'SELL';
      confidence = 60;
      reason = 'Bearish trend confirmed';
    } else {
      recommendation = 'HOLD';
      confidence = 50;
      reason = 'No clear trend';
    }

    return { recommendation, confidence, reason };
  }

  static calculateVolatility(priceData: PriceData[]): number {
    const prices = priceData
      .map(d => d.avgHighPrice || d.avgLowPrice)
      .filter((p): p is number => p !== null);

    if (prices.length < 2) return 0;

    const returns = prices.slice(1).map((price, i) => 
      Math.log(price / prices[i])
    );

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized volatility as percentage
  }
}