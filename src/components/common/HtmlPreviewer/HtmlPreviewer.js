import React, { useState, useRef, useEffect } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { X, ExternalLink, RotateCw, Code, Maximize, Minimize } from 'lucide-react';

const HtmlPreviewer = ({ htmlContent, onClose }) => {
  const [showCode, setShowCode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState('horizontal');
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

  const openInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  const refreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = htmlContent;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const files = {
    '/index.html': htmlContent,
  };

  const ButtonTooltip = ({ onClick, title, children }) => (
    <button
      onClick={onClick}
      className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4">
      <div className={`bg-white rounded-lg overflow-hidden flex flex-col ${isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl h-[90vh]'}`}>
        <div className="bg-gray-100 p-2 sm:p-3 flex justify-between items-center border-b">
          <h2 className="text-base sm:text-lg font-semibold">HTML Preview</h2>
          <div className="flex space-x-1 sm:space-x-2">
            <ButtonTooltip onClick={openInNewTab} title="Open in new tab">
              <ExternalLink size={16} />
            </ButtonTooltip>
            <ButtonTooltip onClick={refreshPreview} title="Refresh preview">
              <RotateCw size={16} />
            </ButtonTooltip>
            <ButtonTooltip onClick={() => setShowCode(!showCode)} title="Toggle code view">
              <Code size={16} />
            </ButtonTooltip>
            <ButtonTooltip onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </ButtonTooltip>
            <ButtonTooltip onClick={onClose} title="Close preview">
              <X size={16} />
            </ButtonTooltip>
          </div>
        </div>
        <div className={`flex-grow overflow-hidden flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}`}>
          {showCode && (
            <div className={`${orientation === 'vertical' ? 'h-1/2' : 'w-1/2'} overflow-auto`}>
              <Sandpack
                template="static"
                files={files}
                options={{
                  showNavigator: false,
                  showTabs: false,
                  editorHeight: '100%',
                  editorWidthPercentage: 100,
                  layout: "preview",
                  readOnly: true,
                }}
                customSetup={{
                  entry: '/index.html',
                }}
                className="h-full [&_.sp-wrapper]:h-full [&_.sp-layout]:h-full [&_.sp-stack]:h-full"
              />
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