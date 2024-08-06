// common/MarkdownRenderer/MarkdownRenderer.js
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Play, Eye, EyeOff } from 'lucide-react';
import HtmlPreviewer from '../HtmlPreviewer/HtmlPreviewer';
import Button from '../Button';

const MarkdownRenderer = ({ content }) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const htmlWrapper = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
  <title>React TypeScript Without Bundler</title>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
        "three/examples/jsm/": "https://unpkg.com/three@0.160.0/examples/jsm/"
      }
    }
  </script>
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/plain" id="jsx-code">
    import ReactDOM from 'react-dom';

    [[APP_CODE]]

    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
  <script>
    const jsxCode = document.getElementById('jsx-code').textContent;
    const compiledCode = Babel.transform(jsxCode, { presets: ['react'] }).code;
    const script = document.createElement('script');
    script.type = 'module';
    script.text = compiledCode;
    document.body.appendChild(script);
  </script>
</body>
</html>
`;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleRun = (code, language) => {
    if (['javascript', 'jsx', 'tsx'].includes(language)) {
      const htmlContent = htmlWrapper.replace('[[APP_CODE]]', code);
      const htmlContentUpdatedImports = htmlContent.replace(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g, (match, p1) => {
        if (p1.startsWith('https://') || p1.startsWith('three/') || p1 === 'three') return match;
        return match.replace(p1, `https://cdn.skypack.dev/${p1}`);
      });

      setHtmlContent(htmlContentUpdatedImports);
      setIsPreviewVisible(true);
    }
  };

  const openInNewTab = (content) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(content);
      newWindow.document.close();
    }
  };

  const downloadHtml = (content) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preview.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : null;
            const codeContent = String(children).replace(/\n$/, '');

            if (!inline && ['javascript', 'jsx', 'tsx'].includes(language)) {
              return (
                <div className="relative">
                  <SyntaxHighlighter style={materialDark} language={language} showLineNumbers={showLineNumbers} {...props}>
                    {codeContent}
                  </SyntaxHighlighter>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleRun(codeContent, language)}
                      className="text-xs px-3 py-2 rounded-full text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <Play size={16} />
                    </button>
                    <button
                      onClick={() => handleCopy(codeContent)}
                      className="text-xs px-3 py-2 rounded-full text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {isCopied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={() => setShowLineNumbers(!showLineNumbers)}
                      className="text-xs px-3 py-2 rounded-full text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showLineNumbers ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              );
            }

            if (!inline && language === 'html') {
              return (
                <div className="relative">
                  <SyntaxHighlighter style={materialDark} language={language} showLineNumbers={showLineNumbers} {...props}>
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
                    <button
                      onClick={() => setShowLineNumbers(!showLineNumbers)}
                      className="text-xs px-3 py-2 rounded-full text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showLineNumbers ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
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
          onDownload={() => downloadHtml(htmlContent)}
          onOpenInNewTab={() => openInNewTab(htmlContent)}
        />
      )}
    </>
  );
};

export default MarkdownRenderer;
