import React, { useState, useEffect } from 'react';
import { ItemSearch } from './components/ItemSearch';
import { ItemDashboard } from './components/ItemDashboard';
import { PriceChart } from './components/PriceChart';
import { AnalysisPanel } from './components/AnalysisPanel';
import { GoogleSheetsSetup } from './components/GoogleSheetsSetup';
import { usePriceData } from './hooks/usePriceData';
import { GoogleSheetsService } from './services/googleSheets';
import { RefreshCw, Database, TrendingUp } from 'lucide-react';

function App() {
  const {
    items,
    selectedItemData,
    selectedItemId,
    isLoading,
    error,
    addItem,
    selectItem,
    refreshAllItems,
  } = usePriceData();

  const [googleSheetsConfig, setGoogleSheetsConfig] = useState<{
    spreadsheetId: string;
    apiKey: string;
  } | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const selectedItem = items.find(item => item.id === selectedItemId);

  const handleConfigSave = (config: { spreadsheetId: string; apiKey: string }) => {
    setGoogleSheetsConfig(config);
    localStorage.setItem('googleSheetsConfig', JSON.stringify(config));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAllItems();
      
      // Sync to Google Sheets if configured
      if (googleSheetsConfig && selectedItemData.length > 0 && selectedItemId) {
        const sheetsService = new GoogleSheetsService({
          ...googleSheetsConfig,
          range: 'Sheet1!A:F'
        });
        
        await sheetsService.appendPriceData(selectedItemId, selectedItemData);
        setLastSync(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Error during refresh:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load saved config on mount
  useEffect(() => {
    const saved = localStorage.getItem('googleSheetsConfig');
    if (saved) {
      setGoogleSheetsConfig(JSON.parse(saved));
    }
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (items.length > 0) {
        handleRefresh();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <TrendingUp className="text-blue-600 mr-3" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RuneScape Price Analyzer</h1>
                <p className="text-sm text-gray-500">Real-time OSRS item price monitoring & analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastSync && (
                <span className="text-sm text-gray-500">
                  Last sync: {lastSync}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <RefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} size={16} />
                {isRefreshing ? 'Refreshing...' : 'Refresh All'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 mr-2" size={20} />
              <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Setup and Search */}
          <div className="space-y-6">
            <GoogleSheetsSetup
              onConfigSave={handleConfigSave}
              isConfigured={!!googleSheetsConfig}
            />
            
            <ItemSearch onAddItem={addItem} />
            
            {googleSheetsConfig && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center text-green-600 mb-2">
                  <Database className="mr-2" size={16} />
                  <span className="font-medium">Sheets Integration Active</span>
                </div>
                <p className="text-sm text-gray-600">
                  Data is being automatically synced to your Google Sheet for analysis and archival.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Dashboard and Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <ItemDashboard
              items={items}
              onSelectItem={selectItem}
              selectedItemId={selectedItemId}
            />

            {selectedItem && selectedItemData.length > 0 && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Price Chart: {selectedItem.name}</h2>
                  {isLoading ? (
                    <div className="h-96 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <PriceChart data={selectedItemData} itemName={selectedItem.name} />
                  )}
                </div>

                <AnalysisPanel priceData={selectedItemData} itemName={selectedItem.name} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;