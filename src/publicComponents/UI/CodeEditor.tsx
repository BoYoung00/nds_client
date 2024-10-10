import React from 'react';
import styled from 'styled-components';

interface CodeEditorProps {
    code: string;
}

const CodeEditorContainer = styled.div`
  height: 100%;
  padding: .5rem;
  background: #000101;
  color: white;
  overflow: auto;
  border-radius: 2px;
  border: 1px solid #00A3FF;
  white-space: pre-wrap;

  .keyword {
    color: #00A3FF;
  }

  .default {
    color: white;
  }
`;

const CodeEditor: React.FC<CodeEditorProps> = ({ code }) => {
    const highlightCode = (code: string) => {
        const keywords = /\b(INSERT INTO|VALUES|CREATE DATABASE|USE|CREATE TABLE|INT|VARCHAR(.*?)|TEXT|BLOB|REAL|UNIQUE|NOT NULL|PRIMARY KEY|FOREIGN KEY|REFERENCES|public|private|class|void|return|this|String|double|FLOAT|std::)\b/gi;

        return { __html: code.replace(keywords, match => `<span class="keyword">${match}</span>`) };
    };

    return (
        <CodeEditorContainer dangerouslySetInnerHTML={highlightCode(code)} />
    );
};

export default CodeEditor;
