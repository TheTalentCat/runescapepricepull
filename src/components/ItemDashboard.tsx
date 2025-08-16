import React from 'react';
import { TrendingUp, TrendingDown, Minus, Clock, BarChart3 } from 'lucide-react';
import { ItemData } from '../types';

interface ItemDashboardProps {
  items: ItemData[];
  onSelectItem: (itemId: number) => void;
  selectedItemId: number | null;
}

export const ItemDashboard: React.FC<ItemDashboardProps> = ({ 
  items, 
  onSelectItem, 
  selectedItemId 
}) => {
  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return <TrendingUp className="text-green-500" size={16} />;
      case 'SELL':
        return <TrendingDown className="text-red-500" size={16} />;
      default:
        return <Minus className="text-gray-500" size={16} />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'SELL':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'N/A';
    return price.toLocaleString() + ' GP';
  };

  const formatPriceChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    const icon = isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <span className={`flex items-center ${colorClass} text-sm font-medium`}>
        {icon}
        <span className="ml-1">
          {change.toLocaleString()} GP ({changePercent.toFixed(1)}%)
        </span>
      </span>
    );
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <BarChart3 className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Added</h3>
        <p className="text-gray-500">Add an item above to start monitoring prices</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold flex items-center">
          <BarChart3 className="mr-2" size={20} />
          Monitored Items
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                24h Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recommendation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelectItem(item.id)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedItemId === item.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">ID: {item.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(item.currentPrice)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatPriceChange(item.priceChange, item.priceChangePercent)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRecommendationColor(item.recommendation)}`}>
                    {getRecommendationIcon(item.recommendation)}
                    <span className="ml-1">{item.recommendation}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {item.lastUpdated}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};