import React from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import { PriceData } from '../types';
import { PriceAnalysisService } from '../services/priceAnalysis';

interface AnalysisPanelProps {
  priceData: PriceData[];
  itemName: string;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ priceData, itemName }) => {
  const analysis = PriceAnalysisService.analyzePrice(priceData);
  const volatility = PriceAnalysisService.calculateVolatility(priceData);
  
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return 'bg-green-500';
      case 'SELL':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return <TrendingUp size={24} />;
      case 'SELL':
        return <TrendingDown size={24} />;
      default:
        return <Activity size={24} />;
    }
  };

  const getVolatilityLevel = (vol: number) => {
    if (vol < 10) return { level: 'Low', color: 'text-green-600' };
    if (vol < 25) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'High', color: 'text-red-600' };
  };

  const volatilityInfo = getVolatilityLevel(volatility);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Analysis: {itemName}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommendation Card */}
        <div className={`rounded-lg p-6 text-white ${getRecommendationColor(analysis.recommendation)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">Recommendation</span>
            {getRecommendationIcon(analysis.recommendation)}
          </div>
          <div className="text-2xl font-bold mb-1">{analysis.recommendation}</div>
          <div className="text-sm opacity-90">Confidence: {analysis.confidence}%</div>
          <div className="mt-2 text-sm opacity-80">{analysis.reason}</div>
        </div>

        {/* Volatility Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-900">Volatility</span>
            <AlertTriangle className="text-gray-600" size={20} />
          </div>
          <div className={`text-2xl font-bold mb-1 ${volatilityInfo.color}`}>
            {volatilityInfo.level}
          </div>
          <div className="text-sm text-gray-600">
            {volatility.toFixed(1)}% annualized
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Based on recent price movements
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Market Insights</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Price data points: {priceData.length}</li>
          <li>• Analysis confidence: {analysis.confidence}%</li>
          <li>• Market volatility: {volatilityInfo.level.toLowerCase()}</li>
          <li>• {analysis.reason}</li>
        </ul>
      </div>
    </div>
  );
};