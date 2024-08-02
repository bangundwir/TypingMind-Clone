import React from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import Button from '../common/Button';

const Settings = ({ isOpen, onClose, sendOnEnter, toggleSendOnEnter }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-80 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <Button onClick={onClose} className="p-1">
            <X size={20} />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Send on Enter</span>
          <Button
            onClick={toggleSendOnEnter}
            className={`px-3 py-1 rounded-full ${
              sendOnEnter ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            {sendOnEnter ? 'On' : 'Off'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;