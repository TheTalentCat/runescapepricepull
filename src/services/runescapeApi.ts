import { ApiResponse, PriceData } from '../types';

export class RuneScapeApiService {
  private baseUrl = 'https://prices.runescape.wiki/api/v1/osrs';

  async fetchPriceData(itemId: number, timestep: string = '5m'): Promise<PriceData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/timeseries?timestep=${timestep}&id=${itemId}`,
        {
          headers: {
            'User-Agent': 'Price Analysis Tool - https://example.com'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching price data:', error);
      throw error;
    }
  }

  async fetchLatestPrice(itemId: number): Promise<number | null> {
    try {
      const response = await fetch(`${this.baseUrl}/latest?id=${itemId}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const itemData = data.data[itemId.toString()];
      
      return itemData?.high || itemData?.low || null;
    } catch (error) {
      console.error('Error fetching latest price:', error);
      return null;
    }
  }
}