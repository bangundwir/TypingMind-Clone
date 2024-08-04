import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Key } from 'lucide-react';

const ApiKeyModal = ({ isOpen, onClose, apiKey, setApiKey }) => {
  const [inputApiKey, setInputApiKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(inputApiKey);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="License Key">
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <Key size={24} className="text-yellow-400 mr-2" />
          <h2 className="text-xl font-bold">License Key</h2>
        </div>
        <p className="text-center">Enter License Key to unlock all premium features.</p>
        <input
          type="text"
          value={inputApiKey}
          onChange={(e) => setInputApiKey(e.target.value)}
          placeholder="Enter your license key here"
          className="w-full p-2 bg-gray-800 text-white rounded"
        />
        <div className="text-center">
          <a href="#" className="text-blue-400 hover:text-blue-300">Buy A License Key</a>
        </div>
        <div className="text-center">
          <a href="#" className="text-blue-400 hover:text-blue-300">Recover License Key</a>
        </div>
        <Button onClick={handleSave} className="w-full">
          Activate License
        </Button>
        <p className="text-xs text-center text-gray-400"> 
          The app will connect to the license server to verify your license key. To manage your license keys and devices, click the button below.
        </p>
        <div className="flex justify-center space-x-2">
          <Button onClick={() => {}} className="text-xs px-2 py-1">
            Buy / Upgrade License
          </Button>
          <Button onClick={() => {}} className="text-xs px-2 py-1">
            Manage License & Devices
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;