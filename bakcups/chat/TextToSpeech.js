import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speechRate, setSpeechRate] = useState(1);

  useEffect(() => {
    const savedVoice = localStorage.getItem('selectedVoice');
    const savedRate = localStorage.getItem('speechRate');

    const populateVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices.filter(voice => voice.lang.includes('en') || voice.lang.includes('id')));
      if (availableVoices.length > 0) {
        const defaultVoice = savedVoice || availableVoices[0].name;
        setSelectedVoice(defaultVoice);
      }
    };

    speechSynthesis.addEventListener('voiceschanged', populateVoices);
    populateVoices();

    if (savedRate) {
      setSpeechRate(parseFloat(savedRate));
    }

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', populateVoices);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedVoice', selectedVoice);
  }, [selectedVoice]);

  useEffect(() => {
    localStorage.setItem('speechRate', speechRate.toString());
  }, [speechRate]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200"
        title="Settings"
      >
        <SettingsIcon size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Text-to-Speech Settings</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed: {speechRate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;