import React, { useState, useRef, useEffect } from 'react';
import '../styles/CodeEditorModal.css';

const CodeEditorModal = ({ onClose }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
    { value: 'python', label: 'Python', color: '#3776ab' },
    { value: 'java', label: 'Java', color: '#ed8b00' },
    { value: 'cpp', label: 'C++', color: '#00599c' },
    { value: 'html', label: 'HTML', color: '#e34c26' },
    { value: 'css', label: 'CSS', color: '#1572b6' },
    { value: 'sql', label: 'SQL', color: '#336791' },
    { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
  ];

  const languageTemplates = {
    javascript: '// JavaScript Code\nfunction solution() {\n    // Write your code here\n    return null;\n}',
    python: '# Python Code\ndef solution():\n    # Write your code here\n    pass',
    java: '// Java Code\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
    cpp: '// C++ Code\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
    html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Document</title>\n</head>\n<body>\n    <!-- Write your HTML here -->\n</body>\n</html>',
    css: '/* CSS Code */\n.container {\n    /* Write your styles here */\n}',
    sql: '-- SQL Query\nSELECT * FROM table_name\nWHERE condition;',
    typescript: '// TypeScript Code\nfunction solution(): any {\n    // Write your code here\n    return null;\n}'
  };

  useEffect(() => {
    setCode(languageTemplates[selectedLanguage] || '');
  }, [selectedLanguage]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleSaveCode = () => {
    // You can add functionality to save the code or pass it to parent component
    console.log('Saving code:', { language: selectedLanguage, code });
    alert('Code saved successfully!');
  };

  const handleRunCode = () => {
    // You can add functionality to run the code
    console.log('Running code:', { language: selectedLanguage, code });
    alert('Code execution feature can be implemented here!');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`code-editor-overlay ${isFullscreen ? 'fullscreen' : ''}`} onClick={onClose}>
      <div className={`code-editor-modal ${isFullscreen ? 'fullscreen-modal' : ''}`} onClick={handleModalClick}>
        {/* Header */}
        <div className="code-editor-header">
          <div className="header-left">
            <div className="window-controls">
              <button className="window-control close" onClick={onClose}></button>
              <button className="window-control minimize"></button>
              <button className="window-control maximize" onClick={toggleFullscreen}></button>
            </div>
            <h3 className="editor-title">Code Editor</h3>
          </div>
          <div className="header-right">
            <button className="action-button run-button" onClick={handleRunCode}>
              <span className="button-icon">▶</span>
              Run
            </button>
            <button className="action-button save-button" onClick={handleSaveCode}>
              <span className="button-icon">💾</span>
              Save
            </button>
          </div>
        </div>

        {/* Language Selector */}
        <div className="language-selector">
          <div className="language-tabs">
            {languages.map((lang) => (
              <button
                key={lang.value}
                className={`language-tab ${selectedLanguage === lang.value ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.value)}
                style={{
                  '--lang-color': lang.color
                }}
              >
                <span className="language-dot" style={{ backgroundColor: lang.color }}></span>
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="code-editor-container">
          <div className="line-numbers">
            {code.split('\n').map((_, index) => (
              <div key={index} className="line-number">
                {index + 1}
              </div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            className="code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start typing your code..."
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="code-editor-footer">
          <div className="footer-left">
            <span className="status-info">
              Language: <strong>{languages.find(l => l.value === selectedLanguage)?.label}</strong>
            </span>
            <span className="status-info">
              Lines: <strong>{code.split('\n').length}</strong>
            </span>
            <span className="status-info">
              Characters: <strong>{code.length}</strong>
            </span>
          </div>
          <div className="footer-right">
            <span className="encoding">UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorModal;