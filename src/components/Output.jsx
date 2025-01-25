import { useState } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import * as Babel from "@babel/standalone";
import React  from "react";
import ReactDOM from 'react'

const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);

      if (language === "javascript" || language === "jsx") {
        
        const transformedCode = Babel.transform(sourceCode, {
          presets: ["react"],
        }).code;

        
        let executionResult = "";
        const executeCode = new Function("React", "ReactDOM", "return " + transformedCode);
        executionResult = executeCode(React, ReactDOM);

        setOutput(executionResult);
        setIsError(false);

        // If you want the result of the execution, handle it here
        console.log("Execution Result:", executionResult);
      } else {
        toast({
          title: "Unsupported language.",
          description: "Babel transformation only works for JavaScript/JSX.",
          status: "warning",
          duration: 6000,
        });
        setOutput(["Unsupported language for Babel transformation."]);
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
      setOutput([`Error: ${error.message}`]);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to transform and execute code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="50%">
      <Text mb={2} fontSize="lg">
        Output
      </Text>
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        isLoading={isLoading}
        onClick={runCode}
      >
        Run Code
      </Button>
      <Box
        height="75vh"
        p={2}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
        overflowY="auto"
      >
        {output}
      </Box>
    </Box>
  );
};

export default Output;
