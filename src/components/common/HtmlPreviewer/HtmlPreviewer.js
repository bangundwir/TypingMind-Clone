// common/HtmlPreviewer/HtmlPreviewer.js
import React, { useState, useRef, useEffect } from 'react';
import { X, ExternalLink, RotateCw, Code, Maximize, Minimize, Download, Eye, EyeOff, Edit3, Save } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Button from '../Button';

const HtmlPreviewer = ({ htmlContent, onClose, onDownload, onOpenInNewTab }) => {
  const [showCode, setShowCode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState('horizontal');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(htmlContent);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.srcdoc = htmlContent;
    }
  }, [htmlContent]);

  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerWidth < 768 ? 'vertical' : 'horizontal');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSave = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = editableContent;
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4">
      <div className={`bg-white rounded-lg overflow-hidden flex flex-col ${isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl h-[90vh]'}`}>
        <div className="bg-gray-100 p-2 sm:p-3 flex justify-between items-center border-b">
          <h2 className="text-base sm:text-lg font-semibold">HTML Preview</h2>
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={onOpenInNewTab}
              className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Open in new tab"
            >
              <ExternalLink size={16} />
            </button>
            <button
              onClick={onDownload}
              className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Download HTML"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => {
                if (iframeRef.current) {
                  iframeRef.current.srcdoc = htmlContent;
                }
              }}
              className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Refresh preview"
            >
              <RotateCw size={16} />
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Toggle code view"
            >
              <Code size={16} />
            </button>
            <button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Toggle line numbers"
            >
              {showLineNumbers ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Save"
              >
                <Save size={16} />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Edit"
              >
                <Edit3 size={16} />
              </button>
            )}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Close preview"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className={`flex-grow overflow-hidden flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}`}>
          {showCode && (
            <div className={`${orientation === 'vertical' ? 'h-1/2' : 'w-1/2'} overflow-auto`}>
              <div className="h-full">
                {isEditing ? (
                  <textarea
                    className="w-full h-full p-2 bg-gray-900 text-white"
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                  />
                ) : (
                  <SyntaxHighlighter style={materialDark} language="html" showLineNumbers={showLineNumbers}>
                    {editableContent}
                  </SyntaxHighlighter>
                )}
              </div>
            </div>
          )}
          <div className={`${showCode ? (orientation === 'vertical' ? 'h-1/2' : 'w-1/2') : 'w-full h-full'}`}>
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="HTML Preview"
              sandbox="allow-scripts"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HtmlPreviewer;
