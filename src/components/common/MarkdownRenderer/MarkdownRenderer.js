// components/common/MarkdownRenderer/MarkdownRenderer.js
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import HtmlPreviewer from '../HtmlPreviewer/HtmlPreviewer';
import Button from '../Button';
import { Copy, Check } from 'lucide-react';

const MarkdownRenderer = ({ content }) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : null;
            const codeContent = String(children).replace(/\n$/, '');

            if (!inline && language) {
              if (language === 'html') {
                return (
                  <div className="relative">
                    <SyntaxHighlighter style={materialDark} language={language} {...props}>
                      {codeContent}
                    </SyntaxHighlighter>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button
                        onClick={() => {
                          setHtmlContent(codeContent);
                          setIsPreviewVisible(true);
                        }}
                        className="text-xs px-3 py-2 rounded-full"
                      >
                        Run
                      </Button>
                      <button
                        onClick={() => handleCopy(codeContent)}
                        className="text-xs px-3 py-2 rounded-full text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div className="relative">
                  <SyntaxHighlighter style={materialDark} language={language} {...props}>
                    {codeContent}
                  </SyntaxHighlighter>
                  <button
                    onClick={() => handleCopy(codeContent)}
                    className="absolute top-2 right-2 text-xs px-3 py-2 rounded-full text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {isPreviewVisible && (
        <HtmlPreviewer
          htmlContent={htmlContent}
          onClose={() => setIsPreviewVisible(false)}
        />
      )}
    </>
  );
};

export default MarkdownRenderer;
