import React, { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { ChevronRight, ChevronDown, Edit3, Trash2, Plus } from 'lucide-react';

const Templates = ({ savedPrompts, setSavedPrompts, initialSystemInstruction, setInitialSystemInstruction }) => {
  const [isPromptDropdownOpen, setIsPromptDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [activePromptId, setActivePromptId] = useState('');

  const togglePromptDropdown = () => setIsPromptDropdownOpen(!isPromptDropdownOpen);

  const handleSavePrompt = () => {
    if (currentPrompt.trim() !== '' && newTemplateName.trim() !== '') {
      if (modalMode === 'add') {
        const newPrompt = {
          id: Date.now().toString(),
          name: newTemplateName,
          content: currentPrompt,
        };
        setSavedPrompts([...savedPrompts, newPrompt]);
      } else {
        setSavedPrompts(savedPrompts.map(prompt => 
          prompt.id === activePromptId ? { ...prompt, name: newTemplateName, content: currentPrompt } : prompt
        ));
      }
      setIsModalOpen(false);
      setCurrentPrompt('');
      setNewTemplateName('');
    }
  };

  const handleCreateTemplate = () => {
    setModalMode('add');
    setCurrentPrompt('');
    setNewTemplateName('');
    setIsModalOpen(true);
  };

  const handleEditTemplate = (template) => {
    setModalMode('edit');
    setCurrentPrompt(template.content);
    setNewTemplateName(template.name);
    setActivePromptId(template.id);
    setIsModalOpen(true);
  };

  const handleSelectTemplate = (template) => {
    setInitialSystemInstruction(template.content);
    setActivePromptId(template.id);
  };

  const handleDeleteTemplate = (templateId, event) => {
    event.stopPropagation();
    setSavedPrompts(savedPrompts.filter((template) => template.id !== templateId));
    if (activePromptId === templateId) {
      setInitialSystemInstruction('');
      setActivePromptId('');
    }
  };

  return (
    <div className="mt-4">
      <Button onClick={handleCreateTemplate} className="w-full text-xs px-2 py-1 flex items-center justify-center mb-2">
        <Plus size={14} className="mr-1" /> Create Template
      </Button>
      <div className="relative">
        <Button onClick={togglePromptDropdown} className="w-full text-xs px-2 py-1 flex items-center justify-between bg-gray-800 text-white rounded">
          Initial Prompts
          {isPromptDropdownOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </Button>
        {isPromptDropdownOpen && (
          <div className="absolute z-10 w-full bg-gray-800 rounded mt-2 max-h-60 overflow-y-auto">
            {savedPrompts.map((template) => (
              <div
                key={template.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200 ${
                  template.id === activePromptId ? 'bg-gray-600' : 'hover:bg-gray-700'
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <span className="flex-grow truncate">{template.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTemplate(template);
                    }}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteTemplate(template.id, e)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        title={modalMode === 'add' ? 'Add New Prompt' : 'Edit Prompt'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="template-name">
              Template Name
            </label>
            <input
              id="template-name"
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Enter template name"
              className="w-full p-2 bg-gray-800 text-white rounded mb-2"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="template-content">
              Template Content
            </label>
            <textarea
              id="template-content"
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder="Enter template content"
              className="w-full p-2 bg-gray-800 text-white rounded"
              rows="4"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSavePrompt} className="text-xs px-2 py-1">
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Templates;