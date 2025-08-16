export interface PriceData {
  timestamp: number;
  avgHighPrice: number | null;
  avgLowPrice: number | null;
  highPriceVolume: number;
  lowPriceVolume: number;
}

export interface ApiResponse {
  data: PriceData[];
}

export interface ItemData {
  id: number;
  name: string;
  lastUpdated: string;
  currentPrice: number | null;
  priceChange: number;
  priceChangePercent: number;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey: string;
  range: string;
}