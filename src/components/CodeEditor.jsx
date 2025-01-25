import { useRef, useState, useEffect } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import * as Babel from "@babel/standalone"; // Import Babel standalone

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [transpiledCode, setTranspiledCode] = useState(""); // To store transpiled code

  // Function to transpile the code using Babel
  const transpileCode = (code, language) => {
    if (language === "javascript" || language === "jsx") {
      try {
        // Use Babel to transpile JSX or modern JS to older versions
        const transformedCode = Babel.transform(code, {
          presets: ["env", "react"], // You can add more presets depending on your needs
        }).code;
        return transformedCode;
      } catch (error) {
        return `Error: ${error.message}`;
      }
    }
    return code; // Return code as-is for unsupported languages
  };

  // Handle changes to the editor's content and transpile code
  const onChange = (newValue) => {
    setValue(newValue);
    const transformed = transpileCode(newValue, language);
    setTranspiledCode(transformed); // Set transpiled code
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  useEffect(() => {
    // When language changes, set default code snippet for the new language
    setValue(CODE_SNIPPETS[language] || "");
    const transformed = transpileCode(CODE_SNIPPETS[language], language);
    setTranspiledCode(transformed);
  }, [language]);

  return (
    <Box>
      <HStack spacing={4}>
        <Box w="50%">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="75vh"
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(newValue) => onChange(newValue)}
          />
        </Box>
        <Output editorRef={editorRef} language={language} transpiledCode={transpiledCode} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
