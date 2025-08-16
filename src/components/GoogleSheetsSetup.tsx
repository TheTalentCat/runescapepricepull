import React, { useState } from 'react';
import { Settings, ExternalLink, CheckCircle } from 'lucide-react';

interface GoogleSheetsSetupProps {
  onConfigSave: (config: { spreadsheetId: string; apiKey: string }) => void;
  isConfigured: boolean;
}

export const GoogleSheetsSetup: React.FC<GoogleSheetsSetupProps> = ({ 
  onConfigSave, 
  isConfigured 
}) => {
  const [spreadsheetId, setSpreadsheetId] = useState('1kzfFVDprfyG1rtoIRsKKCLU70ArpM0S6qUuJ1UA8M4U');
  const [apiKey, setApiKey] = useState('');
  const [showSetup, setShowSetup] = useState(!isConfigured);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigSave({ spreadsheetId, apiKey });
    setShowSetup(false);
  };

  const extractSpreadsheetId = (url: string) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  const handleUrlChange = (url: string) => {
    const id = extractSpreadsheetId(url);
    setSpreadsheetId(id);
  };

  if (isConfigured && !showSetup) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-2" size={20} />
          <span className="text-green-800 font-medium">Google Sheets Connected</span>
        </div>
        <button
          onClick={() => setShowSetup(true)}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          Reconfigure
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Settings className="mr-2" size={20} />
        Google Sheets Setup
      </h2>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Setup Instructions:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Google Cloud Console <ExternalLink size={12} className="ml-1" /></a></li>
          <li>Create a new project or select existing one</li>
          <li>Enable the Google Sheets API</li>
          <li>Create credentials (API Key) with restrictions</li>
          <li>Share your Google Sheet with the service account email</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sheetUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Google Sheet URL or Spreadsheet ID
          </label>
          <input
            type="text"
            id="sheetUrl"
            value={spreadsheetId}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Paste Google Sheets URL or enter Spreadsheet ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Current ID: {spreadsheetId}
          </p>
        </div>
        
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            Google API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google Sheets API key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};