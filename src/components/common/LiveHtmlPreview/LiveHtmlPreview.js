// src/components/common/LiveHtmlPreview/LiveHtmlPreview.js
import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import Button from '../Button';
import { X, ExternalLink } from 'lucide-react';

const LiveHtmlPreview = ({ htmlContent, onClose }) => {
  const [sanitizedHtml, setSanitizedHtml] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    if (htmlContent) {
      const cleanHtml = DOMPurify.sanitize(htmlContent, { ADD_TAGS: ["iframe"], ADD_ATTR: ["allow"] });
      setSanitizedHtml(cleanHtml);
    }
  }, [htmlContent]);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(sanitizedHtml);
      iframeDoc.close();
    }
  }, [sanitizedHtml]);

  const openInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(sanitizedHtml);
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

export default LiveHtmlPreview;
