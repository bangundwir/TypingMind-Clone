// components/common/HtmlPreviewer/HtmlPreviewer.js
import React, { useEffect, useRef } from 'react';
import Button from '../Button';
import { X, ExternalLink } from 'lucide-react';

const HtmlPreviewer = ({ htmlContent, onClose }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
    }
  }, [htmlContent]);

  const openInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl relative overflow-auto" style={{ maxHeight: '90vh' }}>
        <div className="absolute top-2 right-2 flex space-x-2">
          <Button onClick={openInNewTab} className="p-1">
            <ExternalLink size={20} />
          </Button>
          <Button onClick={onClose} className="p-1">
            <X size={20} />
          </Button>
        </div>
        <div className="p-4 border rounded-lg bg-white overflow-auto">
          <iframe
            ref={iframeRef}
            title="Live HTML Preview"
            style={{ width: '100%', height: '80vh', border: 'none' }}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
};

export default HtmlPreviewer;