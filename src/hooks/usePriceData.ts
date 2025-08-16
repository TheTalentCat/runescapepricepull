import { useState, useEffect, useCallback } from 'react';
import { PriceData, ItemData } from '../types';
import { RuneScapeApiService } from '../services/runescapeApi';
import { PriceAnalysisService } from '../services/priceAnalysis';
import { format } from 'date-fns';

export const usePriceData = () => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [selectedItemData, setSelectedItemData] = useState<PriceData[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiService = new RuneScapeApiService();

  const addItem = useCallback(async (itemId: number, itemName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch initial data
      const priceData = await apiService.fetchPriceData(itemId, '1h');
      const currentPrice = await apiService.fetchLatestPrice(itemId);
      
      // Calculate 24h change
      let priceChange = 0;
      let priceChangePercent = 0;
      
      if (priceData.length >= 24 && currentPrice) {
        const price24hAgo = priceData[priceData.length - 24]?.avgHighPrice || 
                          priceData[priceData.length - 24]?.avgLowPrice;
        
        if (price24hAgo) {
          priceChange = currentPrice - price24hAgo;
          priceChangePercent = (priceChange / price24hAgo) * 100;
        }
      }

      // Get recommendation
      const analysis = PriceAnalysisService.analyzePrice(priceData);

      const newItem: ItemData = {
        id: itemId,
        name: itemName,
        lastUpdated: format(new Date(), 'MMM dd, HH:mm'),
        currentPrice,
        priceChange,
        priceChangePercent,
        recommendation: analysis.recommendation,
      };

      setItems(prev => {
        const exists = prev.find(item => item.id === itemId);
        if (exists) {
          return prev.map(item => item.id === itemId ? newItem : item);
        }
        return [...prev, newItem];
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch item data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshItem = useCallback(async (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    try {
      const priceData = await apiService.fetchPriceData(itemId, '1h');
      const currentPrice = await apiService.fetchLatestPrice(itemId);
      
      // Calculate 24h change
      let priceChange = 0;
      let priceChangePercent = 0;
      
      if (priceData.length >= 24 && currentPrice) {
        const price24hAgo = priceData[priceData.length - 24]?.avgHighPrice || 
                          priceData[priceData.length - 24]?.avgLowPrice;
        
        if (price24hAgo) {
          priceChange = currentPrice - price24hAgo;
          priceChangePercent = (priceChange / price24hAgo) * 100;
        }
      }

      const analysis = PriceAnalysisService.analyzePrice(priceData);

      setItems(prev => prev.map(i => 
        i.id === itemId 
          ? {
              ...i,
              currentPrice,
              priceChange,
              priceChangePercent,
              recommendation: analysis.recommendation,
              lastUpdated: format(new Date(), 'MMM dd, HH:mm')
            }
          : i
      ));

      // Update selected item data if this is the selected item
      if (selectedItemId === itemId) {
        setSelectedItemData(priceData);
      }

    } catch (err) {
      console.error('Error refreshing item:', err);
    }
  }, [items, selectedItemId]);

  const selectItem = useCallback(async (itemId: number) => {
    setSelectedItemId(itemId);
    setIsLoading(true);

    try {
      const priceData = await apiService.fetchPriceData(itemId, '5m');
      setSelectedItemData(priceData);
    } catch (err) {
      setError('Failed to fetch detailed price data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAllItems = useCallback(async () => {
    for (const item of items) {
      await refreshItem(item.id);
    }
  }, [items, refreshItem]);

  return {
    items,
    selectedItemData,
    selectedItemId,
    isLoading,
    error,
    addItem,
    selectItem,
    refreshItem,
    refreshAllItems,
  };
};