import React, { useRef } from 'react';

const CodeEditor = ({ value, onChange, placeholder, disabled }) => {
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  // Auto-closing pairs
  const closingPairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    '"': '"',
    "'": "'",
    '`': '`'
  };

  // Synchronize scroll between textarea and highlight layer
  const handleScroll = (e) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.target.scrollTop;
      highlightRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  // Handle special keys
  const handleKeyDown = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const hasSelection = start !== end;

    // Tab key - insert spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const newCode = value.substring(0, start) + '  ' + value.substring(end);
      onChange({ target: { value: newCode } });
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
      return;
    }

    // Auto-close brackets, parentheses, quotes
    if (closingPairs[e.key]) {
      e.preventDefault();
      const closing = closingPairs[e.key];
      const selectedText = value.substring(start, end);
      
      if (hasSelection) {
        // Wrap selection with pair
        const newCode = value.substring(0, start) + e.key + selectedText + closing + value.substring(end);
        onChange({ target: { value: newCode } });
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + 1;
            textareaRef.current.selectionEnd = end + 1;
          }
        }, 0);
      } else {
        // Insert pair
        const newCode = value.substring(0, start) + e.key + closing + value.substring(end);
        onChange({ target: { value: newCode } });
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
          }
        }, 0);
      }
      return;
    }

    // Skip closing bracket if next char is the same
    if ([')', ']', '}', '"', "'", '`'].includes(e.key)) {
      const nextChar = value.charAt(start);
      if (nextChar === e.key) {
        e.preventDefault();
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
          }
        }, 0);
        return;
      }
    }

    // Auto-indent on Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentLine = value.substring(0, start).split('\n').pop();
      const indent = currentLine.match(/^\s*/)[0];
      const lastChar = value.charAt(start - 1);
      const nextChar = value.charAt(start);
      
      // Add extra indent if opening bracket before cursor and closing bracket after
      const needsExtraIndent = ['{', '[', '('].includes(lastChar) && [')', ']', '}'].includes(nextChar);
      
      if (needsExtraIndent) {
        const newCode = value.substring(0, start) + '\n' + indent + '  ' + '\n' + indent + value.substring(end);
        onChange({ target: { value: newCode } });
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + indent.length + 3;
          }
        }, 0);
      } else {
        const newCode = value.substring(0, start) + '\n' + indent + value.substring(end);
        onChange({ target: { value: newCode } });
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + indent.length + 1;
          }
        }, 0);
      }
      return;
    }

    // Backspace - delete matching pair
    if (e.key === 'Backspace' && !hasSelection) {
      const charBefore = value.charAt(start - 1);
      const charAfter = value.charAt(start);
      
      if (closingPairs[charBefore] === charAfter) {
        e.preventDefault();
        const newCode = value.substring(0, start - 1) + value.substring(start + 1);
        onChange({ target: { value: newCode } });
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start - 1;
          }
        }, 0);
        return;
      }
    }
  };

  // Simple syntax highlighting for JavaScript
  const highlightSyntax = (text) => {
    if (!text) return '';

    let highlighted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Comments
    highlighted = highlighted
      .replace(/(\/\/[^\n]*)/g, '<span style="color: #6a9955;">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a9955;">$1</span>');
    
    // Strings
    const stringPattern1 = /("(?:[^"\\]|\\.)*")/g;
    const stringPattern2 = /('(?:[^'\\]|\\.)*')/g;
    const stringPattern3 = /(`(?:[^`\\]|\\.)*`)/g;
    
    highlighted = highlighted
      .replace(stringPattern1, '<span style="color: #ce9178;">$1</span>')
      .replace(stringPattern2, '<span style="color: #ce9178;">$1</span>')
      .replace(stringPattern3, '<span style="color: #ce9178;">$1</span>');
    
    // Keywords
    highlighted = highlighted
      .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|from|new|this|typeof|await|async|break|continue|do|switch|case|default|try|catch|finally|throw|in|of)\b/g, '<span style="color: #c586c0;">$1</span>');
    
    // Numbers
    highlighted = highlighted
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #b5cea8;">$1</span>');

    return highlighted;
  };

  // Count lines for line numbers
  const lineCount = Math.max((value || '').split('\n').length, 20);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-neutral-800/50 bg-neutral-900/80">
      <style>{`
        /* Modern scrollbar styling */
        .code-editor-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .code-editor-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .code-editor-scroll::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        .code-editor-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
        
        .code-editor-scroll::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Firefox scrollbar */
        .code-editor-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
        }
      `}</style>
      
      <div className="flex h-full">
        <div className="hidden sm:block bg-neutral-950 px-3 py-4 text-neutral-600 text-right select-none font-mono text-xs md:text-sm leading-6 overflow-hidden flex-shrink-0">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="h-6">{i + 1}</div>
          ))}
        </div>

        <div className="flex-1 relative min-w-0">
          <pre
            ref={highlightRef}
            className="code-editor-scroll absolute inset-0 p-4 font-mono text-xs md:text-sm leading-6 overflow-auto pointer-events-none text-white"
            style={{ 
              whiteSpace: 'pre',
              wordWrap: 'normal',
              tabSize: 2
            }}
          >
            <code
              dangerouslySetInnerHTML={{
                __html: value ? highlightSyntax(value) : ''
              }}
            />
          </pre>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="code-editor-scroll relative w-full h-full p-4 bg-transparent text-white caret-purple-400 font-mono text-xs md:text-sm leading-6 outline-none resize-none placeholder-neutral-600"
            style={{
              whiteSpace: 'pre',
              wordWrap: 'normal',
              overflow: 'auto',
              tabSize: 2,
              color: value ? 'transparent' : 'white'
            }}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;