import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface ItemSearchProps {
  onAddItem: (itemId: number, itemName: string) => void;
}

export const ItemSearch: React.FC<ItemSearchProps> = ({ onAddItem }) => {
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemId || !itemName) return;

    setIsLoading(true);
    try {
      await onAddItem(parseInt(itemId), itemName);
      setItemId('');
      setItemName('');
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Search className="mr-2" size={20} />
        Add Item to Monitor
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-1">
              Item ID
            </label>
            <input
              type="number"
              id="itemId"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder="e.g., 30753"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Twisted bow"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            'Adding...'
          ) : (
            <>
              <Plus className="mr-2" size={16} />
              Add Item
            </>
          )}
        </button>
      </form>
    </div>
  );
};