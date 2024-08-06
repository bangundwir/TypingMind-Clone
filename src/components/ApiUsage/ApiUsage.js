import React, { useEffect, useState } from 'react';
import { fetchApiUsage } from '../../services/api';

const ApiUsage = ({ selectedApiKey, baseUrlKey }) => {
  const [usage, setUsage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsageData = async () => {
      try {
        const data = await fetchApiUsage(selectedApiKey, baseUrlKey);
        setUsage(data);
      } catch (error) {
        setError(error.message);
      }
    };

    if (selectedApiKey) {
      getUsageData();
    }
  }, [selectedApiKey, baseUrlKey]);

  if (!selectedApiKey) {
    return <p>Please enter your API key to see usage details.</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!usage) {
    return <p>Loading usage data...</p>;
  }

  const usagePercentage = (usage.data.usage / usage.data.limit) * 100;

  return (
    <div className="bg-gray-800 p-4 rounded text-white">
      <h3 className="font-bold mb-2">API Usage</h3>
      <p>Label: {usage.data.label}</p>
      <p>Limit: {usage.data.limit}</p>
      <p>Usage: {usage.data.usage}</p>
      <p>Remaining: {usage.data.limit_remaining}</p>
      <p>Free Tier: {usage.data.is_free_tier ? 'Yes' : 'No'}</p>
      <h4 className="font-bold mt-2">Rate Limit</h4>
      <p>Requests: {usage.data.rate_limit.requests}</p>
      <p>Interval: {usage.data.rate_limit.interval}</p>
      <div className="mt-4">
        <div className="relative h-4 bg-gray-600 rounded overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500 ease-in-out"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
        <p className="mt-2 text-sm">{usagePercentage.toFixed(2)}% used</p>
      </div>
    </div>
  );
};

export default ApiUsage;
