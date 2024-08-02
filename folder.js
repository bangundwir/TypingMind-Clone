const fs = require('fs');
const path = require('path');

const directories = [
  'src/components/Chat',
  'src/components/Sidebar',
  'src/components/common/Button',
  'src/components/common/MarkdownRenderer',
  'src/hooks',
  'src/services',
  'src/utils',
  'src/contexts',
  'src/pages'
];

const files = [
  'src/components/Chat/ChatArea.js',
  'src/components/Chat/InputArea.js',
  'src/components/Chat/index.js',
  'src/components/Sidebar/Sidebar.js',
  'src/components/Sidebar/index.js',
  'src/components/common/Button/Button.js',
  'src/components/common/Button/index.js',
  'src/components/common/MarkdownRenderer/MarkdownRenderer.js',
  'src/components/common/MarkdownRenderer/index.js',
  'src/hooks/useModelConfig.js',
  'src/hooks/useLocalStorage.js',
  'src/services/api.js',
  'src/utils/textUtils.js',
  'src/utils/dateUtils.js',
  'src/contexts/ChatContext.js',
  'src/pages/Home.js',
  'src/App.js'
];

directories.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

files.forEach(file => {
  fs.writeFileSync(path.join(__dirname, file), '', 'utf8');
});

console.log('Struktur folder dan file berhasil dibuat!');

