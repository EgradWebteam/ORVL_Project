import React, { memo, useEffect, useState } from "react";
import * as math from "mathjs";
import Draggable from "react-draggable";
import "./Calculator.css";

import { FaMinus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaRegWindowMaximize } from "react-icons/fa";
const ScientificCalculator = ({ onClose }) => {
  const [evaluatedResult, setEvaluatedResult] = useState(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [input, setInput] = useState("");
  const[showM,setShowM]=useState(false)
  const[isNested,setIsNested]=useState(false)
  const [result, setResult] = useState("0");
  const [mode, setMode] = useState("Deg");
  const [memory, setMemory] = useState(0);
  const [showHelp, setShowHelp] = useState(false)
  const [isMod, setIsMod] = useState(false)
  const [islogXY, setIsLogXY] = useState(false)
  const [isOpenParenthesis, setIsOpenParenthesis] = useState(false);
  const [displayInput, setDisplayInput] = useState('');
  const [intermediateValue, setIntermediateValue] = useState("");
  const [lastYthRoot, setLastYthRoot] = useState(null); 
  const [intermediateExpression, setIntermediateExpression] = useState(""); 
  const handleMemoryRecall = () => {
    const operators = ['+', '-', '/', '*'];
    const lastChar = input.charAt(input.length - 1);
    console.log(lastChar, "This is the last charrrrrrr ")
    if (operators.includes(lastChar)) {
      console.log(`The last character is ${lastChar}and is included in the array`);
      setInput(prev => prev + memory.toString());
    }
    else {
      // if (memory !== null)
      setInput(memory.toString());
      console.log("The input value being set issssssssss..........", input);
    }
    console.log(memory, "This is the memory that is stored in the memory variable");
  }
  const handleMemoryClear = () => {
    setMemory(0)
    setShowM(false)
    console.log("The memory is set to 0 again", memory);
    console.log(memory)
  }
  useEffect(() => {
    console.log('Memory:', memory);
    console.log('Result:', result);
  }, [memory, result]); 
  useEffect(() => {
    console.log('Result:', result);
  }, [result]);


  // const handleMemoryStore = (event) => {
  //   // setMemory(event.target.value);
  //   setShowM(true)
  //   try {
  //     const evaluatedResult = math.evaluate(input);
  //     console.log(evaluatedResult, "This is the evaluated result", result, "Thos os the value that we need to set for the memoru variable")
  //     console.log(result, "result tat should be displaued pon the input type")
  //     setResult(evaluatedResult);
  //     setMemory(evaluatedResult)
  //   } catch (error) {
  //     setResult('Error');
  //   }
  // }

  const handleMemoryStore = (event) => {
    setShowM(true);
    try {
      if (input.trim() === '') {
        setResult('Error: No input provided');
        return; // Exit the function early
      }
  
      // Regular expression to match the last complete number in the input
      const lastNumberMatch = input.match(/-?\d+(\.\d+)?(?=[+\-*/]|$)/);
      
      // If no valid number is found, set error
      if (!lastNumberMatch) {
        setResult('Error: No valid number found');
        return; // Exit if no valid number is found
      }
  
      // Get the last complete number
      const lastNumber = parseFloat(lastNumberMatch[0]);
      console.log(lastNumber, "This is the last number found in the input");
  
      // Check for incomplete expressions by ensuring the last character is not an operator
      const lastChar = input.trim().slice(-1);
      
      if (['+', '-', '*', '/'].includes(lastChar)) {
        // If the expression ends with an operator, extract the number before it
        const inputWithoutLastChar = input.trim().slice(0, -1); // Remove the last character (operator)
        const previousNumberMatch = inputWithoutLastChar.match(/-?\d+(\.\d+)?$/); // Match the last complete number in the updated string
        
        if (previousNumberMatch) {
          const previousNumber = parseFloat(previousNumberMatch[0]);
          setMemory(previousNumber); 
        } else {
          setResult('Error: No valid number found before operator');
          return; // Exit if no valid number is found before the operator
        }
      } else {
        // If the input is complete, store the last evaluated result in memory
        const evaluatedResult = math.evaluate(input);
        console.log(evaluatedResult, "This is the evaluated result");
  
        // Set the result and memory using the last complete number
        // setResult(evaluatedResult);
        setMemory(evaluatedResult); // Store the last complete number in memory
      }
    } catch (error) {
      setResult('Error');
      console.error("Error while evaluating input:", error);
    }
  }
  
  


  const isOperatorAtEnd = (expression) => {
    // Check if the expression ends with an operator
    const operators = ["+", "-", "*", "/", "%"];
    return operators.includes(expression.slice(-1));
  };

  const handleButtonClick = (value) => {
    const hasOperator = /[\+\-\*\/]/.test(input);
    const lastChar = input.charAt(input.length - 1);
    if (value === "π") {
      if(!hasOperator){
        setInput(Math.PI.toString())
      }
      else{
        setInput(input + Math.PI);
      }
    } else if (value === "e") {
      if(!hasOperator){
        setInput(math.e.toString())
      }
      else{
        setInput(input + Math.E);
      }
    }
  //  **************************NEWWWWWWWWWWWWWWW*****************************
    else if (value === "(") {
      // const lastChar = input.charAt(input.length - 1);
      if (lastChar === "" || "+-*/(".includes(lastChar) || ["sin", "cos", "tan"].some(func => input.endsWith(func)) ||  /\d$/.test(lastChar)) {
        setInput(input + "(");
        setIsOpenParenthesis(true);
      } else {
        console.log("Invalid placement of opening parenthesis");
      }
    } 
    else if (value === ")") {
      const lastChar = input.charAt(input.length - 1);
      const openCount = (input.match(/\(/g) || []).length;
      const closeCount = (input.match(/\)/g) || []).length;
  
      if (lastChar !== "(" && lastChar !== "" && !["+","-", "*", "/"].includes(lastChar) && openCount > closeCount) {
        setInput(input + ")");
        setIsOpenParenthesis(true);
      } else {
        console.log("Invalid placement of closing parenthesis or no matching opening parenthesis");
      }
    } 
// ******************************NEWWWWWWWWWWWWWWWWWWWW*********************************
    else if (value === "+") {
      const lastChar = input.charAt(input.length - 1);
      const openCount = (input.match(/\(/g) || []).length;
      const closeCount = (input.match(/\)/g) || []).length;
  
      if (lastChar !== "" && !"+-*/(".includes(lastChar) && openCount > closeCount) {
          setInput(input + "+");
      } else {
          console.log("Invalid placement of operator");
      }
  }
    else if(input.includes("e+")){
      console.log("This ncluded e+")
      if(input.includes("e+"))
        {
          console.log("e+ is included here");
          const parts=input.split("e+");
          console.log(parts,"splittinggggggg")
          const base=parts[0];
          let exponent=parts[1]
          exponent+=value;
          exponent = parseInt(exponent, 10);
          console.log(parts[0],parts[1],exponent);
          setInput(`${base}e+${exponent}`)
        }
    }
    else if(input.includes("^")){
      console.log("^ is included");
      setInput(`${input}${value}`)
    }
    else if(input.includes("yroot")){
      console.log("yroot is included ");
      const yRootParts=input.split("yroot");
      console.log(yRootParts,"YYYYYYYYYYYYYYYYRRRRRRRRRRPPPPPPPPP");
      const base=yRootParts[0];
      let exponent=yRootParts[1];
      exponent+=value;
      exponent=parseInt(exponent,10);
      console.log(base,exponent,"base and exponentt");
      setInput(`${base}yroot${exponent}`);
    }
    // For any other value (numbers, operators, etc.)
    else {
      setInput(input + value);
    }
  };
 


  const handleClear = () => {
    setInput("");
    setResult("0")
  };
  const handleBackspace = () => {
    // const resultString = result ? result.toString() : "";
    // const updatedResult = resultString.slice(0, -1);
    // setResult(updatedResult)
    const inputString = input ? input.toString() : "";
    const updatedInput = inputString.slice(0, -1);
    setInput(updatedInput);
    console.log(input, "This is the input after clicking backspace")
  }
  // const handleSqrt = () => {
  //   try {
  //     setResult(Math.sqrt(math.evaluate(input)));
  //   } catch (error) {
  //     setResult("Error");
  //   }
  // };
  const handleSqrt = () => {
    try {
        // Evaluate the input to get the numerical value
        const evaluatedValue = math.evaluate(input); 
        if (evaluatedValue < 0) {
            setResult("Error: Negative input for square root");
            return;
        }
        // Calculate the square root
        const sqrtResult = Math.sqrt(evaluatedValue);
        const expression = `sqrt(${input})`;
        setInput(expression); 
        setResult(sqrtResult); 
    } catch (error) {
        console.error("Error in handleSqrt:", error);
        setResult("Error: Invalid input");
    }
};
  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

const handleNestedTrigFunction = (fun, currentInput) => {
  console.log(fun, currentInput, result, "this is the function, currentInput that is being sent");
  const updatedInput = `${fun}(${currentInput})`;

  setInput(updatedInput);  

  const parsedResult = parseFloat(result);

  if (isNaN(parsedResult)) {
      console.error("Parsed result is NaN. Please check the result state.");
      return;  
  }
  console.log(parsedResult, "parsedResult");
console.log(fun,"this is fun value");
const asinRadians=Math[fun](parsedResult);
console.log(asinRadians);
const finalCurrentModeAns= mode==='Deg'?asinRadians*(180/ Math.PI):asinRadians
setResult(finalCurrentModeAns)
  return;
};
  const 
  handleTrigFunction = (func) => {
    let evaluatedValue;
    try {
          let angle;
          if(mode==="Deg"){
            angle=Math.PI/180 *parseFloat(input);
            console.log(angle,"this is the angle in deg for which we r calculating");
          }
          else{
            angle=parseFloat(input);
            console.log(angle,"This is the angel in rad");
          }
      switch (func) {
        case "sin":
          try {
            const sinCalculatedValue = Math.sin(mode === 'Deg' ? input * (Math.PI / 180) : input);
            const calculatedResult = Math.sin(sinCalculatedValue)
            console.log(angle,"This is the angle");
            console.log(calculatedResult,input,"Sine , angleeeeeeeeee   value");
            setInput(calculatedResult)
            const sinOpResult=extractOperatorInfo(input);
            if (sinOpResult) {
              const { operator, numberAfterOperator, numberBeforeOperator } = sinOpResult;
              setInput(`${numberBeforeOperator}${operator}sin(${numberAfterOperator})`);
              const sinResult = Math.sin(mode === 'Deg' ? numberAfterOperator * (Math.PI / 180) : numberAfterOperator);
              console.log(sinResult, "sinResultsinResult");
              setResult(sinResult);
            }else if (
              input.includes("asin") ||
              input.includes("acos") ||
              input.includes("atan") ||
              input.includes("sin") ||
              input.includes("cos") ||
              input.includes("tan")
            ){
              handleNestedTrigFunction("sin",input)
              setIsNested(true);
              return;
             }
             else {
              const angleToUse = mode === 'Deg' ? input * (Math.PI / 180) : input;
              setInput(`sin(${input})`);
              setResult(Math.sin(angleToUse));
            }  
          } catch (error) {
            console.log("Error happened",error)
            setResult("Error in sin")
          }    
          break;
          
          case "cos":
            const cosCalculatedValue = Math.cos(mode === 'Deg' ? input * (Math.PI / 180) : input);
            console.log(cosCalculatedValue)
            const calculatedResultCos = Math.cos(cosCalculatedValue)
            console.log(angle,"This is the angle");
            console.log(calculatedResultCos,input,"coSine,angleeeeeeeeee value");
           setInput(calculatedResultCos)
               const cosOpResult=extractOperatorInfo(input);
               console.log("Cos operator result",cosOpResult);
               if (cosOpResult) {
                 const { operator, numberAfterOperator, numberBeforeOperator } = cosOpResult;
                 setInput(`${numberBeforeOperator}${operator}cos(${numberAfterOperator})`);
                 const sinResult = Math.cos(mode === 'Deg' ? numberAfterOperator * (Math.PI / 180) : numberAfterOperator);
                 console.log(sinResult, "sinResultsinResult");
                 setResult(sinResult);
               }
               else if (
                input.includes("asin") ||
                input.includes("acos") ||
                input.includes("atan") ||
                input.includes("sin") ||
                input.includes("cos") ||
                input.includes("tan")
              ){
                handleNestedTrigFunction("cos",input)
                setIsNested(true);
                return;
               } else {
                 const angleToUse = mode === 'Deg' ? input * (Math.PI / 180) : input;
                 setInput(`cos(${input})`);
                 setResult(Math.cos(angleToUse));
                }
          break;
          case "tan":
  // Extract the current mode angle
  const tanCurrentModeAngle = Math.tan(mode === 'Deg' ? input * (Math.PI / 180) : input);
  console.log(tanCurrentModeAngle);
  const calculatedResultTan = Math.tan(tanCurrentModeAngle);
  console.log(angle, "This is the angle");
  console.log(calculatedResultTan, input, "Tangent value of the angle");

  // Check if the input is an expression with operators
  const tanOpResult = extractOperatorInfo(input);
  console.log("tan operator result", tanOpResult);

  if (tanOpResult) {
    const { operator, numberAfterOperator, numberBeforeOperator } = tanOpResult;
    setInput(`${numberBeforeOperator}${operator}tan(${numberAfterOperator})`);

    // Check for undefined tan values (like tan(90°), tan(270°) in degrees mode)
    if (mode === 'Deg' && (numberAfterOperator % 180 === 90)) {
      // Return undefined because tan(90°) is undefined (or Infinity)
      console.log("Tangent is undefined at", numberAfterOperator, "degrees.");
      setResult("undefined");
    } else {
      // Normal tan calculation
      const tanResult = Math.tan(mode === 'Deg' ? numberAfterOperator * (Math.PI / 180) : numberAfterOperator);
      console.log(tanResult, "tan result");
      setResult(tanResult);
    }
  }
  else if (
    input.includes("asin") ||
    input.includes("acos") ||
    input.includes("atan") ||
    input.includes("sin") ||
    input.includes("cos") ||
    input.includes("tan")
  ){
    handleNestedTrigFunction("tan",input)
    setIsNested(true);
    return;
   }
   else {
    // Normal single tan operation (e.g., tan(90))
    const degrees = input;
    
    // Check if tan is undefined at 90°, 270°, etc. in degrees mode
    if (mode === 'Deg' && (degrees % 180 === 90)) {
      console.log("Tangent is undefined at", degrees, "degrees.");
      setResult("undefined");
      setInput(`tan(${input})`);
    } else {
      // Normal calculation for tan
      const angleToUse = mode === 'Deg' ? input * (Math.PI / 180) : input;
      const tanResult = Math.tan(angleToUse);

      console.log(angleToUse, "This is the angle in radians for which we are calculating");
      console.log(tanResult, "Tangent value of the angle");

      // Update the input display to show tan(input)
      setInput(`tan(${input})`);
      // Set the result to the calculated tangent value
      setResult(tanResult);
    }
  }
  break;
          case "asin":
            let asinInputValue2;
            const asinOpResult = extractOperatorInfo(input);
            if (asinOpResult) {
                const { operator, numberAfterOperator, numberBeforeOperator } = asinOpResult;
                setInput(`${numberBeforeOperator}${operator}asin(${numberAfterOperator})`);
                asinInputValue2 = parseFloat(numberAfterOperator);
                 const currentAsinModeVal=mode==='Deg'?asinInputValue2*(180/ Math.PI):asinInputValue2;
            const asinCalculatedValue=Math.asin(currentAsinModeVal);
                setResult(asinCalculatedValue);
                // return
             } 
             else if (
              input.includes("asin") ||
              input.includes("acos") ||
              input.includes("atan") ||
              input.includes("sin") ||
              input.includes("cos") ||
              input.includes("tan")
            ){
              setIsNested(true);
              // console.log("i think this might be a nested function");
              // console.log(input,"this is the input in the nested function");
              // console.log(result);
              // setInput(`asin(${input})`);
              // const nestedAnswer=Math.asin(result);
              // console.log(nestedAnswer);
              // setResult(nestedAnswer);
              // return
              handleNestedTrigFunction("asin",input)
              return;
             }
             else {
              asinInputValue2 = parseFloat(input);
              if (asinInputValue2 < -1 || asinInputValue2 > 1) {
                  console.error("Input for arcsine is out of range [-1, 1].");
                  setInput(`asin(${input})`)
                  setResult(NaN);
                  return;
              }
              setInput(`asin(${input})`);
          }
          
          const asinCalculatedValue = Math.asin(asinInputValue2);
          const asinResult = mode === 'Deg' ? asinCalculatedValue * (180 / Math.PI) : asinCalculatedValue;
          // Set the result
          setResult(asinResult);
          console.log(asinCalculatedValue, "This is asin calculated value");
          break;
              
          case "acos":
              let aCosInputValue;
              const aCosOpResult = extractOperatorInfo(input);
              
              if (aCosOpResult) {
                const { operator, numberAfterOperator, numberBeforeOperator } = aCosOpResult;
                setInput(`${numberBeforeOperator}${operator}acos(${numberAfterOperator})`);
                
                aCosInputValue = parseFloat(numberAfterOperator);
                console.log(aCosInputValue, "acos input value after operator");
                // Check if value is in range [-1, 1]
                if (aCosInputValue < -1 || aCosInputValue > 1) {
                  console.error("Input for acos is out of range [-1, 1]");
                  setResult(NaN);
                  return;
                }
                const aCosCalculatedValue = Math.acos(aCosInputValue);
                const finalACosValue = mode === 'Deg' 
                  ? aCosCalculatedValue * (180 / Math.PI) 
                  : aCosCalculatedValue;
                setResult(finalACosValue); 
              }
              else if (
                input.includes("asin") ||
                input.includes("acos") ||
                input.includes("atan") ||
                input.includes("sin") ||
                input.includes("cos") ||
                input.includes("tan")
              ){
              setIsNested(true);
                handleNestedTrigFunction("acos",input)
                return;
               }
              else {
                aCosInputValue = parseFloat(input);
                console.log(aCosInputValue, "acos input value in else block");

                // Check if value is in range [-1, 1]
                if (aCosInputValue < -1 || aCosInputValue > 1) {
                  console.error("Input for acos is out of range [-1, 1]");
                  setInput(`acos(${input})`);
                  setResult(NaN);
                  return;
                }

                setInput(`acos(${input})`);
                const aCosCalculatedValue = Math.acos(aCosInputValue); 
                // Convert back to degrees if in 'Deg' mode for the final result
                const finalACosValue = mode === 'Deg' 
                  ? aCosCalculatedValue * (180 / Math.PI) 
                  : aCosCalculatedValue;
                setResult(finalACosValue);
                console.log(finalACosValue, "This is acos calculated value");
              }
              break;

          case "atan":
          let aTanFinalValue;
          const aTanOpResult=extractOperatorInfo(input);
          if(aTanOpResult){
            const{operator,numberAfterOperator,numberBeforeOperator}=aTanOpResult;
            setInput(`${numberBeforeOperator}${operator}atan(${numberAfterOperator})`);
            aTanFinalValue=parseFloat(numberAfterOperator)
            const currenATanModeVal= mode==='Deg'? aTanFinalValue*(180 /Math.PI): aTanFinalValue;
            console.log(currenATanModeVal);
            setResult(currenATanModeVal);
          } else if (
            input.includes("asin") ||
            input.includes("acos") ||
            input.includes("atan") ||
            input.includes("sin") ||
            input.includes("cos") ||
            input.includes("tan")
          ){
            handleNestedTrigFunction("atan",input)
            setIsNested(true);
            return;
           }

          else{
            aTanFinalValue=parseFloat(input);
            if(aTanFinalValue< -1 || aTanFinalValue>1){
              console.log("input for atan is out of range[-1,1]");
              setInput(`atan(${input})`)
              setResult(NaN);;
              return
            }
            setInput(`atan(${input})`);
          }
          const atanCalcVal=Math.atan(aTanFinalValue);
          const atanResult=mode==='Deg'?atanCalcVal*(180 /Math.PI):atanCalcVal;
          setResult(atanResult);
          break;

          case "sinh":
            const parsedInput = parseFloat(input);
            let  sinhInputVal;
            console.log("Input:", parsedInput);
            console.log("Mode:", mode);
            const sinhOp=extractOperatorInfo(input);
            if(sinhOp){
              const { operator, numberAfterOperator, numberBeforeOperator } =sinhOp;
              console.log(operator, numberAfterOperator, numberBeforeOperator);
              sinhInputVal= parseFloat(numberAfterOperator);
          if (!isNaN(sinhInputVal) && numberBeforeOperator.trim() !== "") {
            // Update the input expression
            setInput(`${numberBeforeOperator}${operator}sinh(${numberAfterOperator})`);
            const asinHCalculatedValue = Math.sinh(sinhInputVal);
            setResult(asinHCalculatedValue);
        } else {
            console.warn("Invalid number after operator.");
            setResult(NaN);
        }
              // const asinHCalculatedValue=Math.sinh(numberAfterOperator)
              // setResult(asinHCalculatedValue)
              return;
            }
            else{
              setInput(`sinh(${input})`);
              const asinHCalculatedValue2=Math.sinh(input);
              setResult(asinHCalculatedValue2)
                    }
            break;
            case "cosh":
              let coshInputVal;
              console.log(input,"parsedCoshInputtttt");
             const coshOp=extractOperatorInfo(input);
             if(coshOp){
              const{ operator, numberAfterOperator, numberBeforeOperator }=coshOp;
              console.log( operator, numberAfterOperator, numberBeforeOperator );
              coshInputVal=parseFloat(numberAfterOperator);
           
                setInput(`${numberBeforeOperator}${operator}cosh(${numberAfterOperator})`);
                const acosHCalculatedValue=math.cosh(coshInputVal);
                setResult(acosHCalculatedValue);
              // return
             }
             else{
              setInput(`cosh(${input})`);
              const coshInputVal2=math.cosh(input)
              setResult(coshInputVal2)
             }
              break;
              case "tanh":
                let tanhInputVal;
                const parsedInputTanh = parseFloat(input.trim()); // Trim any whitespace 
                const tanhOp=extractOperatorInfo(input);
                if(tanhOp){
                  const{ operator, numberAfterOperator, numberBeforeOperator }=tanhOp;
                  console.log( operator, numberAfterOperator, numberBeforeOperator );
                  tanhInputVal=parseFloat(numberAfterOperator);
               
                    setInput(`${numberBeforeOperator}${operator}tanh(${numberAfterOperator})`);
                    const atanHCalculatedValue=math.tanh(tanhInputVal);
                    setResult(atanHCalculatedValue);
                  return
                 }
                 else{
                  setInput(`tanh(${input})`);
                  const tanhInputVal2=math.tanh(input)
                  setResult(tanhInputVal2);
                 }
                //  i think below code is not needed 
                // if (isNaN(parsedInputTanh)) {
                //     // If there's no valid input, default to tanh(0)
                //     setInput("tanh(0)");
                //     evaluatedValue = Math.tanh(0); // Calculate tanh(0)
                //     console.warn("No valid input provided. Defaulting to tanh(0).");
                // } else {
                //     // If valid input is provided
                //     evaluatedValue = Math.tanh(parsedInputTanh);
                //     setInput(`tanh(${parsedInputTanh})`); // Show the input value
                // }
           
                // Set the result
                // setResult(evaluatedValue);
                break;
         // ******************************************************************************************************
          
          case "asinh":
            const asinhOp = extractOperatorInfo(input);
            if (asinhOp) {
                const { operator, numberAfterOperator, numberBeforeOperator } = asinhOp;
                console.log(operator, numberAfterOperator, numberBeforeOperator);
                const asinhInputVal = parseFloat(numberAfterOperator);
                if (!isNaN(asinhInputVal) && numberBeforeOperator.trim() !== "") {
                    setInput(`${numberBeforeOperator}${operator}asinh(${numberAfterOperator})`);
                    const asinhCalculatedValue = Math.asinh(asinhInputVal);
                    setResult(asinhCalculatedValue);
                } else {
                    console.warn("Invalid number after operator.");
                    setResult(NaN);
                }
            }
            else{
              setInput(`asinh(${input})`);
              const sinhEvalVal=math.asinh(input)
              setResult(sinhEvalVal);
            }
            break;
              case "acosh":
                const acoshOp=extractOperatorInfo(input)
                if(acoshOp){
                const { operator, numberAfterOperator, numberBeforeOperator } = acoshOp;
                setInput(`${numberBeforeOperator}${operator}acosh(${numberAfterOperator})`);
                const acoshInputVal = parseFloat(numberAfterOperator);
                const acoshCalculatedValue = Math.acosh(acoshInputVal);
                setResult(acoshCalculatedValue);
                }
                else{
                  setInput(`acosh(${input})`);
                  const acoshEvalVal=math.acosh(input)
                  setResult(acoshEvalVal);
                }
              break;
          // case "atanh":
          //   const atanhOp=extractOperatorInfo(input);
          //   let atanhFinalResult;
          //   if(atanhOp){
          //     const{ operator, numberAfterOperator, numberBeforeOperator}=atanhOp;
          //     setInput(`${numberBeforeOperator}${operator}atanh(${numberAfterOperator})`);
          //     atanhFinalResult=math.atanh(numberAfterOperator);
          //     setResult(atanhFinalResult);
          //   }
          //   else{
          //     atanhFinalResult=math.atanh(input)
          //     setInput(`atanh(${input})`)
          //     setResult(atanhFinalResult)
          //   }
          //   break;
          case "atanh":
    const atanhOp = extractOperatorInfo(input);
    let atanhFinalResult;
    let numberToEvaluate;

    if (atanhOp) {
        const { operator, numberAfterOperator, numberBeforeOperator } = atanhOp;
        setInput(`${numberBeforeOperator}${operator}atanh(${numberAfterOperator})`);
        numberToEvaluate = parseFloat(numberAfterOperator); // Extract the number for evaluation
    } else {
        numberToEvaluate = parseFloat(input);
        setInput(`atanh(${input})`);
    }
    if (numberToEvaluate <= -1 || numberToEvaluate >= 1) {
        setResult(NaN); 
    } else {
        try {
            atanhFinalResult = math.atanh(numberToEvaluate);
            setResult(atanhFinalResult);
        } catch (error) {
            console.error("Error in atanh function", error);
            setResult("Error");
        }
    }
    break;
        // *****************************************************************
          default:
          break;
      }

    } catch (error) {
      setResult("Error");
    }
  };
 
  const extractOperatorInfo = (input) => {
    const hasOperator = /[\+\-\*\/]/.test(input);
    if (hasOperator) {
      const operatorMatch = input.match(/([\d\.]+)\s*([\+\-\*\/])\s*([\d\.]+)/);
      if (operatorMatch) {
        let numberBeforeOperator = operatorMatch[1].trim();
        const operator = operatorMatch[2].trim();
        const numberAfterOperator = operatorMatch[3].trim();
        // if (isOpenParenthesis) {
        //   numberBeforeOperator += "("; // Append '(' to numberBeforeOperator
        // }
        return { hasOperator, numberBeforeOperator, operator, numberAfterOperator };
      }
    }
    return null;
  };
  // const 

  const handleTrigFunctionForOperator = (inputTrigStr, mode, trigOp) => {
    const trigMatch = inputTrigStr.match(new RegExp(`${trigOp}\\(([^)]+)\\)`));
    console.log("Came into handle trig for sine cosine funciton");
    console.log(trigMatch, "This is the trig match");
    if (trigMatch){
        // Extract the matched value
        const trigValue = parseFloat(trigMatch[1]);
        console.log(trigMatch[1], trigMatch[0], "This is the trig Value");
        // Convert angle if in degrees
        const convertedValue = mode === 'Deg' ? trigValue * (Math.PI / 180) : trigValue;
        // Evaluate the trigonometric function
        const evaluatedTrig = Math[trigOp](convertedValue);
        const newInput = inputTrigStr.replace(trigMatch[0], evaluatedTrig);
        const evaluatedResult = math.evaluate(newInput);
        // Update the input and result
        setInput(evaluatedResult.toString());
        setResult(evaluatedResult);
        console.log(evaluatedResult, "result is being set");
    }
};


//   const handleArcTrigFunctionForOperator = (inputTrigStr, mode, trigOp) => {
//     const arcTrigMatch = inputTrigStr.match(new RegExp(`${trigOp}\\(([^)]+)\\)`));
//     console.log(mode, inputTrigStr, trigOp);
//     console.log(arcTrigMatch, "This is the arc trig match");

//     if (arcTrigMatch) {
//         console.log(arcTrigMatch, "inside the arcTrigMatch");
//         const arcTrigValue = parseFloat(arcTrigMatch[1]);
//         console.log(arcTrigMatch[1], arcTrigMatch[0], "This is the arc trig Value");

//         // Check if the value is in the range [-1, 1]
//         if (arcTrigValue < -1 || arcTrigValue > 1) {
//             console.error("Input for arcsine is out of range [-1, 1].");
//             setResult(NaN); // Or set a specific error message
//             return;
//         }

//         // Calculate the arcsine in radians
//         const evaluatedArcTrig = Math[trigOp](arcTrigValue);

//         // Convert to degrees if needed
//         const resultInDegrees = mode === 'Deg' ? evaluatedArcTrig * (180 / Math.PI) : evaluatedArcTrig;

//         const newInput = inputTrigStr.replace(arcTrigMatch[0], resultInDegrees);
//         const evaluatedResult = math.evaluate(newInput);

//         // Update the input and result
//         setInput(evaluatedResult.toString());
//         setResult(evaluatedResult);
//         console.log(evaluatedResult, "result is being set");
//     } else {
//         console.error("No valid arcsine match found in the input.");
//     }
// };


const handleArcTrigFunctionForOperator = (inputTrigStr, mode, trigOp) => {
  const arcTrigMatch = inputTrigStr.match(new RegExp(`${trigOp}\\(([^)]+)\\)`));
  console.log(mode, inputTrigStr, trigOp);
  console.log(arcTrigMatch, "This is the arc trig match");

  if (arcTrigMatch) {
      console.log(arcTrigMatch, "inside the arcTrigMatch");
      const arcTrigValue = parseFloat(arcTrigMatch[1]);
      console.log(arcTrigMatch[1], arcTrigMatch[0], "This is the arc trig Value");

      // Check if the value is in the range [-1, 1]
      if (arcTrigValue < -1 || arcTrigValue > 1) {
          console.error("Input for arcsine is out of range [-1, 1].");
          setResult(NaN); // Or set a specific error message
          return;
      }

      // Calculate the arcsine in radians
      const evaluatedArcTrig = Math[trigOp](arcTrigValue);

      // Convert to degrees if needed
      const resultInDegrees = mode === 'Deg' ? evaluatedArcTrig * (180 / Math.PI) : evaluatedArcTrig;

      // Replace the arcTrig match in the input string with the evaluated value
      const newInput = inputTrigStr.replace(arcTrigMatch[0], resultInDegrees.toString());

      // Log the new input to debug
      console.log("New input after replacement:", newInput);

      try {
          // Evaluate the new input safely
          const evaluatedResult = math.evaluate(newInput);

          // Check if the result is valid
          if (isNaN(evaluatedResult)) {
              console.error("Evaluation resulted in NaN.");
              setResult(NaN); // Handle NaN as needed
          } else {
              // Update the input and result
              setInput(evaluatedResult.toString());
              setResult(evaluatedResult);
              console.log(evaluatedResult, "result is being set");
          }
      } catch (error) {
          console.error("Error evaluating new input:", error);
          setResult(NaN); // Handle any errors in evaluation
      }
  } else {
      console.error("No valid arcsine match found in the input.");
  }
};

const extractNumberBeforeLogXBase2 = (inputLogX) => {
  console.log(inputLogX);
  
  // Updated regex to match the number and operator before 'logXbase2'
  const regex = /([-+]?\d*\.?\d+)\s*([\+\-\*\/]?)\s*logXbase2/;
  
  const match = inputLogX.match(regex); // Execute the regex against the input
  console.log(match); // Log the match to see if it captures correctly

  if (match) {
    const numberBeforeLogXbase2 = parseFloat(match[1]); // Extract and parse the number
    const operatorBeforeLogXbase2 = match[2]; // Extract the operator (if any)
    console.log("Number before logXbase2:", numberBeforeLogXbase2);
    console.log("Operator before logXbase2:", operatorBeforeLogXbase2);
    
    return { numberBeforeLogXbase2, operatorBeforeLogXbase2 }; // Return both the number and operator
  }

  console.log("No number found before logXbase2.");
  return null; // Return null if no match is found
};
const handleHyperbolicFunction = (inputStr, operator, funcName) => {
  try {
    console.log(`Processing ${funcName} function`);
    console.log(inputStr, `These are inputStr, mode for ${funcName}`);
    // setInput(prev => prev + operator);
    const evalAns = math.evaluate(inputStr); 
    console.log(evalAns);
    setResult(evalAns);
    setInput(evalAns+operator)
  } catch (error) {
    console.error(`Error in ${funcName} function`, error);
    setResult("Error");
  }
};

  const handleLogFunction = (func) => {
    let calculatedLogValue, operatorMatch, hasOperator, operator;
    let inputOrResult = input || result;
    try {
      // Calculate log based on the input
      switch (func) {
        case "log":
          calculatedLogValue = math.log(math.evaluate(inputOrResult));
          setResult(calculatedLogValue);
          console.log("This is in the log function, the input is", input);
          calculatedLogValue = math.log10(math.evaluate(inputOrResult));
          setResult(calculatedLogValue)
          hasOperator = /[\+\-\*\/]/.test(inputOrResult);
          operatorMatch = inputOrResult.match(/([\d\.]+)\s*([\+\-\*\/])\s*([\d\.]+)/);
          if (hasOperator) {
            operator = operatorMatch[2].trim(); 
            console.log(operator, "Te operator issss");
            const numberBeforeOperator = operatorMatch[1].trim();
            console.log(numberBeforeOperator, "numberBeforeOperatornumberBeforeOperator")
            console.log("Operators found in the input.");
            const numberAfterOperator = operatorMatch[3].trim();
            setInput(`${numberBeforeOperator}${operator}log(${numberAfterOperator})`)
            console.log(numberAfterOperator, "this is the number after operator");
            const logInputValue = math.log10(numberAfterOperator);
            setResult(logInputValue);
          }
          else {
            console.log("this is in the else part, it do not have any operators");
            setInput(`log(${input})`)
            console.log("No operators found. Proceeding with log single only.");
            const evaluatedValue = math.evaluate(inputOrResult);
            calculatedLogValue = math.log10(evaluatedValue);
            setResult(calculatedLogValue);
            // setInput(`ln(${inputOrResult})`)
          }
          break;
        case "log2":
          // calculatedLogValue = math.log2(inputOrResult);
          const log2OperatorInfo = extractOperatorInfo(input);
          console.log(log2OperatorInfo,"This is the operatorinfo ");
          if (log2OperatorInfo){
            console.log(log2OperatorInfo,"This is the operatorinfo ");
            const { numberBeforeOperator, numberAfterOperator, operator } = log2OperatorInfo;
            console.log(numberBeforeOperator, numberAfterOperator, operator, "After exevuting the function, numberBeforeOperator,numberAfterOperator,operator");
            setInput(`${numberBeforeOperator}${operator}logXbase2(${numberAfterOperator})`);
            const log2ValForNAO=math.log2(numberAfterOperator);
            setResult(log2ValForNAO);
            console.log(log2ValForNAO);
          }
          else{
            setInput(`logXbase2(${input})`);
          calculatedLogValue = math.log2(inputOrResult);
          setResult(calculatedLogValue);
          }
          break;
          case "loge":
          console.log(input, "This is the input");
          console.log("This is in the ln function, the input is", input);
          if (input.trim().startsWith('-')) {
            console.log("Negative number detected");
            const negativeNumber = input.trim().substring(1);
            console.log("Negative number is", negativeNumber);
            setInput(`0-ln(${negativeNumber})`)
            const calculatedNegLnVal = math.log(math.evaluate(negativeNumber))
            setResult(calculatedNegLnVal)
            return;
          }
          calculatedLogValue = math.log(math.evaluate(inputOrResult));
          setResult(calculatedLogValue)
          hasOperator = /[\+\-\*\/]/.test(inputOrResult);
          operatorMatch = inputOrResult.match(/([\d\.]+)\s*([\+\-\*\/])\s*([\d\.]+)/);
          if (hasOperator) {
            const operator = operatorMatch[2].trim();
            console.log(operator, "Te operator issss");
            const numberBeforeOperator = operatorMatch[1].trim();
            console.log(numberBeforeOperator, "numberBeforeOperatornumberBeforeOperator")
            console.log("Operators found in the input.");
            const numberAfterOperator = operatorMatch[3].trim();
            console.log(numberAfterOperator, "this is the number after operator");
            setInput(`${numberBeforeOperator}${operator}ln(${numberAfterOperator})`)
            const lnInputValue = math.log(numberAfterOperator);
            setResult(lnInputValue);
          } else {
            console.log("No operators found. Proceeding with ln only.");
            const evaluatedValue = math.evaluate(inputOrResult);
            calculatedLogValue = math.log(evaluatedValue);
            setResult(calculatedLogValue);
            setInput(`ln(${inputOrResult})`)
          }
          break;
        case "logxy":
          const [x, y] = inputOrResult.split(",").map(val => math.evaluate(val.trim()));
          if (x <= 0 || x === 1 || y <= 0) throw new Error("Base must be > 0 and not 1, and argument must be > 0.");
          calculatedLogValue = math.log(y) / math.log(x);
          setResult(calculatedLogValue);
          setInput(calculatedLogValue);
          break;
        default:
          return;
      }
    } catch (error) {
      setResult("Error");
      console.error("Error occurred:", error);
    }
  };

// this is used while evaluating
// in this we also added logic for knowing the operator

const handleEvaluateForTrigValues=(paramTrigOp,trigInputExp)=>{
  console.log(paramTrigOp,trigInputExp);
  try { 
    const trigMatch=input.match(new RegExp(`${paramTrigOp}\\(([^(]+)\\)`))
    // Using regex to match numbers followed by an operator, allowing for decimals
    const match = input.match(/(\d+\.?\d*[+\-*/]?)?/);
     if (match) {
         const extractedValue = match[0]; 
         console.log(extractedValue, "extracted value");
         const valueBeforeTrig = parseFloat(extractedValue);
         console.log(valueBeforeTrig, "value before param ");
    if(trigMatch){
      const angleValueFromInput=trigMatch[1];
      console.log(angleValueFromInput,"angleValue");
      const currentModeInput=mode==='Deg'? angleValueFromInput*(Math.PI/180): angleValueFromInput;
      console.log(currentModeInput,"currentModeInput");
      const currentModeTrigValue= math[paramTrigOp](currentModeInput);
        const operatorBeforeTrig = input.match(/[\+\-\*\/]/)?.[0] || "*";  
        let resultF;
        switch (operatorBeforeTrig) {
          case "*":
            resultF = valueBeforeTrig * currentModeTrigValue;
            break;
          case "/":
            resultF = valueBeforeTrig / currentModeTrigValue;
            break;
          case "+":
            resultF = valueBeforeTrig + currentModeTrigValue;
            break;
          case "-":
            resultF = valueBeforeTrig - currentModeTrigValue;
            break;
          default:
            resultF = currentModeTrigValue; 
            break;
        }
        setResult(resultF); 
        console.log(resultF, "final result after combining");
        return;
      }
    }
  
  } catch (error) {
    setResult("Error");
    return;
  }  
}
const sqrtOpInfo=extractOperatorInfo();

const handleArcTrigValues = (paramTrigOp, trigInputExp) => {
  console.log(`ArcTrigOp: ${paramTrigOp}`, trigInputExp);
  
  try {
    // Extract trigonometric part (asin, acos, atan)
    const trigMatch = trigInputExp.match(new RegExp(`${paramTrigOp}\\(([^(]+)\\)`));

    if (trigMatch) {
      const angleValueFromInput = parseFloat(trigMatch[1]);
      console.log(angleValueFromInput, "angleValue");

      // Check for valid range [-1, 1] for asin and acos
      if (paramTrigOp === 'asin' || paramTrigOp === 'acos') {
        if (angleValueFromInput < -1 || angleValueFromInput > 1) {
          console.error("Invalid input for asin/acos: out of range [-1, 1]");
          setResult("Error: Input out of range");
          return;
        }
      }

      let arcResult;
      if (paramTrigOp === 'asin') {
        arcResult = Math.asin(angleValueFromInput); // No conversion needed
      } else if (paramTrigOp === 'acos') {
        arcResult = Math.acos(angleValueFromInput); // No conversion needed
      } else if (paramTrigOp === 'atan') {
        arcResult = Math.atan(angleValueFromInput); // No conversion needed
      }

      // Convert back to degrees if in degree mode
      const finalArcValue = mode === 'Deg' 
        ? arcResult * (180 / Math.PI) 
        : arcResult;

      console.log(finalArcValue, "arc function final result");
      // Replace the trigonometric function in the expression with the evaluated value
      const evaluatedExpression = trigInputExp.replace(trigMatch[0], finalArcValue);
      console.log(evaluatedExpression, "Expression after substituting arc function result");
      // Use eval to evaluate the full expression (25 + asin(0.2))
      // Make sure the expression is safe or sanitized if necessary
      const finalResult = eval(evaluatedExpression);
      console.log(finalResult, "Final result after evaluating full expression");

      setResult(finalResult);
    }
  } catch (error) {
    console.error("Error in handling arc function:", error);
    setResult("Error");
  }
};
const evaluateLogXYExpression = (input) => {
  // Regular expression to find 'logxBasey'
  const logRegex = /(\d+)\s*logxBasey\s*(\d+)/;
  const match = input.match(logRegex);
  
  if (match) {
    const valueX = parseFloat(match[1].trim()); // Extract x (before logxBasey)
    const valueY = parseFloat(match[2].trim()); // Extract y (after logxBasey)
    // Validate the values
    if (!isNaN(valueX) && !isNaN(valueY) && valueY !== 1 && valueY > 0) {
      const logValue = Math.log(valueX) / Math.log(valueY); // Compute log base y of x
      console.log("logxBasey result:", logValue);
      
      // Replace 'logxBasey' with its computed value in the expression
      const newInput = input.replace(logRegex, logValue.toString());
      return newInput; // Return the updated input
    }
  }
  
  return null; // Return null if no valid log expression found
};
const extractDetails = (input) => {
  // Regular expression to find the last operator
  const operatorRegex = /[\+\-\*\/]([^0-9]*$)/;
  
  // Regular expression to find all numbers
  const numberRegex = /(\d+(\.\d+)?)/g; // Match integers and decimals

  // Find all numbers in the input
  const numbers = input.match(numberRegex);
  const lastNumber = numbers ? numbers[numbers.length - 1] : null; // Last number (decimal)
  
  // Find the last operator in the expression
  const lastOperatorMatch = input.match(operatorRegex);
  const lastOperator = lastOperatorMatch ? lastOperatorMatch[0].trim() : null; // Last operator

  // Get the previous expression by removing the last number and last operator
  let previousExpression = input;
  if (lastOperator && lastNumber) {
      const lastOperatorIndex = input.lastIndexOf(lastOperator);
      const lastNumberIndex = input.lastIndexOf(lastNumber);
      previousExpression = input.slice(0, lastOperatorIndex).trim(); // Extract everything before the last operator
  }

  return {
      previousExpression,
      lastOperator,
      lastDecimal: lastNumber,
  };
};

const handleOperator = (operator) => {
  // Check if "ln" is included in the expression
  // First check if the input ends with an operator using isOperatorAtEnd
  if (typeof input !== "string") {
    console.error("Input is not a string:", input);
    return;
}
if (isOperatorAtEnd(input)) {
  setInput(input.slice(0, -1) + operator);
  console.log(`Replaced last operator with: ${operator}`);
  return; 
}
if(isNested){
  setInput(result+operator);
  console.log(result,"this is the result ");
  setIsNested(false)
  return;
}

if(input.includes("log2")){
  console.log("log2 is included in the input");
  // numberBeforeOp , operator, result
  //  ihave to setInV to = numberBeforeOp${operator}${result}
  return;
}
 if (islogXY) {
  console.log("Handling logxBasey");
  // Call the function to evaluate the log expression
  const updatedInput = evaluateLogXYExpression(input);
  if (updatedInput !== null) {
    // If valid log expression was found, evaluate the entire expression
    try {
      const result = math.evaluate(updatedInput); // WARNING: Avoid eval in production, use a math library instead
      setResult(result);
      setInput(result.toString()+operator);
    } catch (error) {
      setResult("Error");
    }
  } else {
    setResult("Error"); // Handle case where log expression is invalid
  }
  setIsLogXY(false);
  return;
}

//****************************************************************** */
//****************************************************************** */


if (input.includes("yroot")) {
  console.log("Handling y-th root expression in evaluation");
  try {
    const yRootMatch = input.match(/(\d+)yroot(\d+)/);

    if (yRootMatch) {
      const numberValue = parseFloat(yRootMatch[1].trim());
      const yValue = parseFloat(yRootMatch[2].trim());

      if (isNaN(numberValue) || isNaN(yValue) || yValue <= 0) {
        console.error("Invalid values for y-root: numberValue =", numberValue, ", yValue =", yValue);
        setResult("Error");
        return;
      }

      console.log(numberValue, "numberValue for evaluation");
      console.log(yValue, "yValue for evaluation");

      const evaluatedYthRoot = Math.pow(numberValue, 1 / yValue);
      console.log(evaluatedYthRoot, "result of y-th root evaluation");

      // Use a variable to hold the last evaluated result
      let finalResult = result !== undefined ? parseFloat(result) : 0; // Ensure it's a number

      switch (operator) {
        case '+':
          finalResult += evaluatedYthRoot;
          break;
        case '-':
          finalResult -= evaluatedYthRoot;
          break;
        case '*':
          finalResult *= evaluatedYthRoot;
          break;
        case '/':
          if (evaluatedYthRoot !== 0) {
            finalResult /= evaluatedYthRoot;
          } else {
            console.error("Division by zero.");
            setResult("Error: Division by zero");
            return;
          }
          break;
        default:
          console.error("Unknown operator:", operator);
          setResult("Error: Unknown operator");
          return;
      }

      console.log(finalResult, "final result after applying operator");

      // Update the result and input
      setResult(finalResult);
      setInput(`${finalResult} ${operator}`); // Keep the operator for next operations
      return;
    } else {
      console.error("yroot format not recognized.");
      setResult("Error: Invalid yroot format");
    }
  } catch (error) {
    setResult("Error");
    console.error("Error evaluating y-th root expression:", error);
  }
}


//****************************************************************** */
//****************************************************************** */

if(input.includes("^")){
  console.log(" ^ is included in the input");
}
if(input.includes("logXbase2")){
  console.log("logXbase2 is included")
  const numberBeforeLogXbase2OP= extractNumberBeforeLogXBase2(input);
  console.log(numberBeforeLogXbase2OP,"numberBeforeLogXbase2");
  if(numberBeforeLogXbase2OP){
    const{numberBeforeLogXbase2,operatorBeforeLogXbase2}=numberBeforeLogXbase2OP;
    console.log("operatorBeforeLogXbase2",operatorBeforeLogXbase2,numberBeforeLogXbase2);
    const intermediateLogXExp=`${numberBeforeLogXbase2}${operatorBeforeLogXbase2}${result}`;
    console.log(intermediateLogXExp);
    const finalLogXBase2Val=math.evaluate(intermediateLogXExp);
    setResult(finalLogXBase2Val);
    setInput(finalLogXBase2Val+operator)
  }
  else{
    console.log("entered into the else block where operators are not present");
    setInput(result+operator)
  }
  return;
}
const inputStr=String(input || "")
// ***************************************Arc HyperBolic functions***************************************************
if(inputStr.includes("asinh")){
console.log("in arc sinh function");
handleHyperbolicFunction(inputStr, operator, "asinh");
return
}
if(inputStr.includes("acosh")){
  console.log("in arc cosh function");
  handleHyperbolicFunction(inputStr, operator, "acosh");
  return
  }
  if(inputStr.includes("atanh")){
    console.log("in arc tanh function");
    handleHyperbolicFunction(inputStr, operator, "atanh");
    return
    }
      


// ***************************************End of Arc HyperBolic functions****************************************************

// ********************************HyperbolicFunctions***********************************
if (inputStr.includes("sinh")) {
  console.log("in sinh handleOperator function")
  handleHyperbolicFunction(inputStr, operator, "sinh");
  return;
}
if (inputStr.includes("cosh")) {
console.log("in cosh handleOperator function")

handleHyperbolicFunction(inputStr, operator, "cosh");
return;
}
if (inputStr.includes("tanh")) {
console.log("in tanh handleOperator function")
handleHyperbolicFunction(inputStr, operator, "tanh");
return;
}

// *******************************Trignometric functions************************************
if (inputStr.includes("asin")) {
  console.log("Processing arcsine function");
  handleArcTrigFunctionForOperator(inputStr, mode, "asin");
  setInput(prev=>prev+operator);
  console.log(inputStr,mode,"These are inputStr,mode");
  return;
}
if (inputStr.includes("acos")) {
  console.log("Processing arcCosine function");
  handleArcTrigFunctionForOperator(inputStr, mode, "acos");
  setInput(prev=>prev+operator);
  console.log(inputStr,mode,"These are inputStr,mode");
  return;
}
if (inputStr.includes("atan")) {
  console.log("Processing arcTan function");
  handleArcTrigFunctionForOperator(inputStr, mode, "atan");
  setInput(prev=>prev+operator);
  console.log(inputStr,mode,"These are inputStr,mode");
  return;
}
if (inputStr.includes("sin")) {
  console.log("came into sin included function")
  handleTrigFunctionForOperator(inputStr,mode,"sin");
  setInput(prev=>prev+operator)
  return;
}
if(inputStr.includes("cos")){
console.log("came into cos included function")
handleTrigFunctionForOperator(inputStr,mode,"cos");
setInput(prev=>prev+operator)
return;
}
if(inputStr.includes("tan")){
// const tanMatch = inputStr.match(/tan\(([^)]+)\)/);
// if (tanMatch) {
    // const angle = parseFloat(tanMatch[1]);
    // if (mode === 'Deg' && (angle % 180 === 90)) {
    //     console.log("Tangent is undefined at", angle, "degrees.");
    //     setResult("undefined");
    //     setInput(prev => prev + operator); 
    //     return;
    // }
// }
handleTrigFunctionForOperator(inputStr, mode, "tan");
setInput(prev => prev + operator);
return;
}
// ***************************End of Trignometric functions**********************************************

  if (inputStr.includes("ln")) {
    console.log("Yes this expression included ln herrreeeeeee");
    console.log(inputStr, "this is the input strig");
    setInput(`${result}${operator}`);
    try {
      // Use regex to find the ln(...) pattern
      const lnMatch = inputStr.match(/ln\(([^)]+)\)/);
      if (lnMatch) {
        const lnValue = lnMatch[1];
        console.log(lnValue, "lnValue");
        const evaluatedLn = Math.log(lnValue);
        const newInput = inputStr.replace(lnMatch[0], evaluatedLn);
        const evaluatedResult = math.evaluate(newInput);
        setInput(evaluatedResult.toString() + operator);
        setResult(evaluatedResult);
        console.log(result, "result is being set");
      }
    } catch (error) {
      setResult("Error");
      console.error("Error evaluating ln expression:", error);
    }
    return;
  }
  if (inputStr.includes("log")) {
    console.log("Yes this expression included logg in the input");
    console.log(inputStr, "this is the input strig");
    setInput(`${result}${operator}`);
    try {
      // Use regex to find the ln(...) pattern
      const lnMatch = inputStr.match(/log\(([^)]+)\)/);
      if (lnMatch) {
        const lnValue = lnMatch[1];
        console.log(lnValue, "lnValue");
        const evaluatedLn = Math.log10(lnValue);
        const newInput = inputStr.replace(lnMatch[0], evaluatedLn);
        const evaluatedResult = math.evaluate(newInput);
        setInput(evaluatedResult.toString() + operator);
        setResult(evaluatedResult);
        console.log(result, "result is being set");
      }
    } catch (error) {
      setResult("Error");
      console.error("Error evaluating ln expression:", error);
    }
    
    return;
  }
  if(inputStr.includes("powe")){
    console.log("powe is included");
    const poweMatch = inputStr.match(/powe\(([^)]+)\)/);
    console.log(poweMatch,"This is the powerMatch");
    if (poweMatch) {
      const lnValue = poweMatch[1];
      console.log(lnValue, "lnValue");
      const evaluatedLn = Math.exp(lnValue);
      const newInput = inputStr.replace(poweMatch[0], evaluatedLn);
      const evaluatedResult = math.evaluate(newInput);
      setInput(evaluatedResult.toString()+operator);
      setResult(evaluatedResult);
      console.log(result, "result is being set");
      return;
    }
    // setInput(result);
  }
  if(inputStr.includes("powTen")){
    console.log("powTen included in inputString in handleOperator function");
    if(input.includes("ln")){
      console.log(input,"this is the input");
      console.log("ln is included in the input vvvvvvvvvvvvvvv");
      setInput(result);
    }
    try {
      const poweMatch = inputStr.match(/powTen\(([^)]+)\)/); 
      if (poweMatch) {
        const poweValue = poweMatch[1]; 
        console.log(poweValue, "poweValue for evaluation");
        const evaluatedLn = Math.pow(10,poweValue);
        const newInput = input.replace(poweMatch[0], evaluatedLn); 
        const evaluatedResult = math.evaluate(newInput); 
        setResult(evaluatedResult);
        setInput(evaluatedResult.toString()+operator);
        console.log(evaluatedResult, "result of ln evaluation");
        return;
      }
    } catch (error) {
      setResult("Error");
      console.error("Error evaluating ln expression:", error);
      return;
    }
  }
  if(inputStr.includes("sqr")){
    console.log("SQR included");
    setInput(prev=>prev+operator);
    try {
      const sqrMatch=inputStr.match(/sqr\(([^)]+)\)/);
      if(sqrMatch){
        const sqrValue=sqrMatch[1];
        console.log(sqrValue,"sqrValue");
        const evaluatedSqr=math.square(sqrValue);
        console.log(evaluatedSqr,"This is evaluated sqrt value");
        const newInputSqr=inputStr.replace(sqrMatch[0],evaluatedSqr);
        const evaluatedResult=math.evaluate(newInputSqr);
        setInput(evaluatedResult.toString()+operator);
        setResult(evaluatedResult);
        console.log("res is being set",result);
      }
    } catch (error) {
      setInput("Error");

    }
    return;
  }
 
  if (input.includes("mod")) {
    console.log("input includes mod");
    console.log(isMod, "the value of isMod");
    try {
      const preprocessedInput = input
        .replace(/mod/g, "%") 
        .replace(/(\d+)%(\d+)/g, "$1 % $2");
      // Log the preprocessed input for debugging
      console.log("Preprocessed Input:", preprocessedInput);
      // Evaluate the modified expression
      const evalResult = math.evaluate(preprocessedInput);
      setResult(evalResult);
      setInput(evalResult.toString() + operator);
    } catch (error) {
      setResult("Error");
      console.error("Error evaluating input:", error);
      return;
    }
  }
  if(isOpenParenthesis){
    console.log("isOpenParenthesis",isOpenParenthesis);
    setInput(prev=>prev+operator)
    return;
  }
  else if (input){
    console.log(input,"this is the input that is being evaluated in if(input) block ");
    console.log(input,"This is the inputttt")
    const evaluatedResult=math.evaluate(input);
    console.log("Entered into input else statement");
    setInput(evaluatedResult.toString()+operator);
    setResult(evaluatedResult);
    return;
  }
  else {
    setInput((prev) => prev + operator);
  }

};

  const handleEvaluate = (operator) => {
    try {
      if (isEvaluated) {
        console.log("Using pre-calculated result");
        setResult(evaluatedResult);
        setInput(evaluatedResult.toString());
        setIsEvaluated(false); 
        return;
      }
      else if (islogXY) {
        console.log("Handling logxBasey");
        
        // Call the function to evaluate the log expression
        const updatedInput = evaluateLogXYExpression(input);
        
        if (updatedInput !== null) {
          // If valid log expression was found, evaluate the entire expression
          try {
            const result = math.evaluate(updatedInput); // WARNING: Avoid eval in production, use a math library instead
            setResult(result);
            setInput(result.toString());
          } catch (error) {
            setResult("Error");
          }
        } else {
          setResult("Error"); // Handle case where log expression is invalid
        }
      
        setIsLogXY(false);
        return;
      }
  
      if (input.includes("ln")) {
        console.log("Handling ln expression in evaluation");
        try {
          const lnMatch = input.match(/ln\(([^)]+)\)/); 
          if (lnMatch) {
            const lnValue = lnMatch[1]; 
            console.log(lnValue, "lnValue for evaluation");
            const evaluatedLn = Math.log(lnValue); 
            const newInput = input.replace(lnMatch[0], evaluatedLn); 
            const evaluatedResult = math.evaluate(newInput); 
            setResult(evaluatedResult);
            setInput(evaluatedResult.toString());
            console.log(evaluatedResult, "result of ln evaluation");
            return;
          }
        } catch (error) {
          setResult("Error");
          console.error("Error evaluating ln expression:", error);
          return;
        }
      }
        
      if(input.includes("log")){
        console.log("log is included in the input of handleEvaluate function");
          console.log("Handling ln expression in evaluation");
          try {
            const logMatch = input.match(/log\(([^)]+)\)/); 
            if (logMatch) {
              const lnValue = logMatch[1]; 
              console.log(lnValue, "lnValue for evaluation");
              const evaluatedLog = Math.log10(lnValue); 
              const newInput = input.replace(logMatch[0], evaluatedLog); 
              const evaluatedResult = math.evaluate(newInput); 
              setResult(evaluatedResult);
              setInput(evaluatedResult.toString());
              console.log(evaluatedResult, "result of ln evaluation");
              return;
            }
          } catch (error) {
            setResult("Error");
            console.error("Error evaluating ln expression:", error);
            return;
          }
      }
      if (input.includes("powe")) {
        console.log("Handling powe expression in evaluation");
        try {
         
          const poweMatch = input.match(/powe\(([^)]+)\)/); 
          if (poweMatch) {
            const poweValue = poweMatch[1]; 
            console.log(poweValue, "poweValue for evaluation");
            const evaluatedLn = Math.exp(poweValue);
            const newInput = input.replace(poweMatch[0], evaluatedLn); 
            const evaluatedResult = math.evaluate(newInput); 
            setResult(evaluatedResult);
            setInput(evaluatedResult.toString());
            console.log(evaluatedResult, "result of ln evaluation");
            return;
          }
        } catch (error) {
          setResult("Error");
          console.error("Error evaluating ln expression:", error);
          return;
        }
      }
    
    
      if (input.includes("powTen")) {
        console.log("powTen included in this");
        try {
          const powTenMatch=input.match(/powTen\(([^)]+)\)/)
          if(powTenMatch){
            const powTenValue= powTenMatch[1];
            const evaluatedPowTen=math.pow(10,powTenValue);
            const newInput=input.replace(powTenMatch[0],evaluatedPowTen);
            //I think there is no need to replace the newInput 
            const evaluatedPTResult=math.evaluate(newInput);
            setResult(evaluatedPTResult);
            setInput(evaluatedPTResult.toString());
            console.log(evaluatedPTResult,"evaluatedPTResult");
            return;
          }
          return
        } catch (error) {
          setResult("Error");
          console.log("Error while evaluation");
          return;
        }
      }
      if(input.includes("sqr")){
        console.log("sqr included");
        try { 
          const sqrMatch=input.match(/sqr\(([^(]+)\)/);
          if(sqrMatch){
            const sqrValue=sqrMatch[1];
            const evaluatedSqrValue=math.square(sqrValue);
            //  In order to extract the input and set it with the expression value
            const newInput=input.replace(sqrMatch[0],evaluatedSqrValue);
            const evaluatedResult=math.evaluate(newInput);
            setInput(evaluatedResult.toString());
            console.log(evaluatedResult,"");
            setResult(evaluatedResult);
            console.log(evaluatedResult,"evaluatedResult");
            return;
          }
        } catch (error) {
          setResult("Error");
          return;
        }
        return;
      }
      console.log("General expression evaluation:", input);
      if (isMod&&input.includes("mod")) {
        console.log("Entered into Mod preprocessed function");
        const evalResult = handleModulusOperation(input);
        setResult(evalResult);
        setInput(evalResult.toString())
        return;
      }
      if(input.includes("asinh")){
        console.log("Entered into arcc sinh functi")
        const mathEvalValue=math.evaluate(input)
        console.log(mathEvalValue);
        setResult(mathEvalValue)
        return
      }
      if(input.includes("acosh")){
        console.log("Entered into arcc acosh functi")
        const mathEvalValue=math.evaluate(input)
        console.log(mathEvalValue);
        setResult(mathEvalValue)
        return
      }
      if(input.includes("atanh")){
        console.log("Entered into arcc atanh functinnnn")
        const mathEvalValue=math.evaluate(input)
        console.log(mathEvalValue);
        setResult(mathEvalValue)
        return
      }
      if(input.includes("sinh")){
        console.log("Entered into sinh functi")
        const mathEvalValue=math.evaluate(input)
        console.log(mathEvalValue);
        setResult(mathEvalValue)
        return
      }
      if(input.includes("cosh")){
        console.log("Entered into cosh functi")
        const mathEvalValue=math.evaluate(input)
        console.log(mathEvalValue);
        setResult(mathEvalValue)
        return
      }
      if(input.includes("tanh")){
        console.log("Entered into tanh function");
        // console.log(/)
        const mathEvalValue=math.evaluate(input)
        console.log(mathEvalValue);
        setResult(mathEvalValue)
        return
      }
      if(input.includes("asin")){
        console.log("asin is included in this");
        // handleArcTrigValues("asin",input)
        console.log(input,"This is the inuputt")
        const mathEvalValue=math.evaluate(input)
        console.log(mathEvalValue);
        setResult(mathEvalValue)
        // this is another approach or we can use handleArcTrigValues which is used in below acos function
        return;
      }
      if(input.includes("acos")){
        console.log("acos is included in this");
        handleArcTrigValues("acos",input)
        return;
      }
      if(input.includes("atan")){
        console.log("atan is included in this");
        handleArcTrigValues("atan",input)
        return;
      }

      if(input.includes("sin")){
        console.log("sin included");
      handleEvaluateForTrigValues("sin",input)
      return;  
      }
      if(input.includes("cos")){
      console.log("cos included");
      handleEvaluateForTrigValues("cos",input)
      return
      }
      if(input.includes("tan")){
        handleEvaluateForTrigValues("tan",input)
        return
      }
// *********************************************************************************
// *********************************************************************************



// if (input.includes("yroot")) {
//   console.log("Handling y-th root expression in evaluation");
//   try {
//     // Match number followed by yroot and an optional second number
//     const yRootMatch = input.match(/(\d+)yroot(\d+)?/);

//     if (yRootMatch) {
//       // Extract the number and the degree
//       const numberValue = parseFloat(yRootMatch[1].trim());
//       let yValue = yRootMatch[2] ? parseFloat(yRootMatch[2].trim()) : numberValue; // Default to numberValue if not provided

//       // If yValue is NaN, use numberValue
//       if (isNaN(yValue)) {
//         console.log(`Using ${numberValue} for both base and degree.`);
//         yValue = numberValue; // Set yValue to numberValue
//       }

//       // Check for NaN or invalid y value
//       if (isNaN(numberValue) || yValue <= 0) {
//         console.error("Invalid values for y-root: numberValue =", numberValue, ", yValue =", yValue);
//         setResult("Error");
//         return;
//       }

//       console.log(numberValue, "numberValue for evaluation");
//       console.log(yValue, "yValue for evaluation");

//       // Calculate the y-th root
//       const evaluatedYthRoot = Math.pow(numberValue, 1 / yValue);
//       console.log(evaluatedYthRoot, "result of y-th root evaluation");

//       // Update result and input with the evaluated value
//       setResult(evaluatedYthRoot);
//       // Show the complete expression without any zeros
//       setInput(`${numberValue}yroot${yValue}`); 
//       return;
//     } else {
//       console.error("yroot format not recognized.");
//       setResult("Error: Invalid yroot format");
//     }
//   } catch (error) {
//     setResult("Error");
//     console.error("Error evaluating y-th root expression:", error);
//   }
// }

if (input.includes("yroot")) {
  console.log("Handling y-th root expression in evaluation");
  try {
    // Match all occurrences of yroot expressions
    const yRootPattern = /(\d+)yroot(\d+)/g;
    let match;
    let modifiedInput = input;

    // Loop to replace all yroot occurrences
    while ((match = yRootPattern.exec(input)) !== null) {
      const numberValue = parseFloat(match[1].trim());
      const yValue = parseFloat(match[2].trim());

      // Validate yValue
      if (isNaN(numberValue) || isNaN(yValue) || yValue <= 0) {
        console.error("Invalid values for y-root: numberValue =", numberValue, ", yValue =", yValue);
        setResult("Error");
        return;
      }

      console.log(numberValue, "numberValue for evaluation");
      console.log(yValue, "yValue for evaluation");

      // Calculate the y-th root
      const evaluatedYthRoot = Math.pow(numberValue, 1 / yValue);
      console.log(evaluatedYthRoot, "result of y-th root evaluation");

      // Replace the yroot expression in modifiedInput
      modifiedInput = modifiedInput.replace(match[0], evaluatedYthRoot);
    }

    // Evaluate the final expression after replacing all yroot
    const finalResult = math.evaluate(modifiedInput);
    console.log(finalResult, "final evaluated result");
    setResult(finalResult);
    setInput(modifiedInput); // You can choose how to handle the input here
    return;

  } catch (error) {
    setResult("Error");
    console.error("Error evaluating y-th root expression:", error);
  }
}





// *********************************************************************************
// *********************************************************************************

      else {
        console.log("Entered into the else mode");
        console.log(input,"this is the input i have to calculate");
        setResult(math.evaluate(input));
      }
      // if(result){
      //   setResult(result);
      //   console.log(result,"This is the result");
      //   console.log("Entered into result state")
      //   return
      // }
    } catch (error) {
      setResult("Error");
      console.error("Evaluation error:", error);
    }
  };

  const handlePowerFunction = (func) => {
    let calculatedResult;
    let inputOrResult = input || result;
    try {
      switch (func) {
        case "exp":
          if(!input){
            console.log("There is no input here");
            setInput(`powe(${0})`)
            console.log("When clicked alone");
              const resultZero= Math.exp(0);
              console.log(resultZero);
              setResult(resultZero.toString())
              return
        }
          calculatedResult = math.exp(math.evaluate(input))
          console.log("In exp function");
          // if input has some operators, then we need to seperate it and then evaluate
          const operatorResult=extractOperatorInfo(inputOrResult)
          console.log(operatorResult,"operatorResultOperatorResult")
          if(operatorResult){
            const {hasOperator, numberBeforeOperator, operator, numberAfterOperator}=operatorResult;
            console.log(operatorResult,hasOperator, numberBeforeOperator, operator, numberAfterOperator,"hasOperator, numberBeforeOperator, operator, numberAfterOperator");
            setInput(`${numberBeforeOperator}${operator}powe(${numberAfterOperator})`)
            const calculatedPoweValue=math.exp(math.evaluate(numberAfterOperator))
            console.log(calculatedPoweValue,"calculatedPoweValue")
            setResult(calculatedPoweValue)
          }
          //  if no operators are present, we need to just set to below
          else{
            setInput(`powe(${inputOrResult})`)
          }
          break;
          case "10^x":
          if(input.includes("ln")){
            console.log(result,"this is the input");
            try {
              setInput(`powTen(${input})`)
              const evaluatedResult=
             math.pow(10,result);
              setResult(evaluatedResult);
              setIsEvaluated(true)
              return;
            } catch (error) {
              setResult("Error");
              console.log("error",error)
            }
            setInput(result.toString());
            calculatedResult = math.pow(10, math.evaluate(input))
            setResult(calculatedResult)
            return;
          }
          calculatedResult = math.pow(10, math.evaluate(input))
          console.log("In 10 pow x function");
          console.log(input,"This is the input state");
          const powTenOpResult=extractOperatorInfo(input) //in place of input, inputOrResult, if it not works 
          console.log(powTenOpResult);
          if(powTenOpResult){
            const{numberBeforeOperator,numberAfterOperator,operator}=powTenOpResult;
            const calcResult=math.pow(10,math.evaluate(numberAfterOperator));
            console.log("Calculation of number after operator",calcResult);
            setResult(calcResult);
            setInput(`${numberBeforeOperator}${operator}powTen(${numberAfterOperator})`)
          }
          else{
            setInput(`powTen(${input})`)
            setResult(calculatedResult);
          }
          break;
        case "x^2":
          // const inputToEval = input || result
          console.log(result, input,)
          calculatedResult = math.square(math.evaluate(inputOrResult));
          setResult(calculatedResult);
          console.log("This is the calculated result", calculatedResult);
          const sqrOpResult=extractOperatorInfo(input);
          console.log(sqrOpResult);
          if(sqrOpResult){
            const{operator,numberAfterOperator,numberBeforeOperator}=sqrOpResult;
            setInput(`${numberBeforeOperator}${operator}sqr(${numberAfterOperator})`);
            const sqrResult=math.square(math.evaluate(numberAfterOperator));
            console.log(sqrResult);
            setResult(sqrResult);
            
          }
          else{
            setInput(`sqr(${input})`);
            setResult(calculatedResult)
          }
          console.log(result, "this is result");
          console.log(input, "this is the input");
          break;
        case "x^3":
          calculatedResult = math.cube(math.evaluate(input))
          console.log("Cube value");
          const calculatedCubeResult=math.cube(math.evaluate(inputOrResult));
          console.log(calculatedCubeResult);
          setResult(calculatedCubeResult);
          const cubeOpResult=extractOperatorInfo(input);
          if(cubeOpResult){
            const{operator,numberAfterOperator,numberBeforeOperator}=cubeOpResult;
            setInput(`${numberBeforeOperator}${operator}cube(${numberAfterOperator})`);
            const cubeResult=math.cube(math.evaluate(numberAfterOperator));
            console.log(cubeResult);
            setResult(cubeResult);
          }
          else{
            setInput(`cube(${input})`);
            setResult(calculatedCubeResult)
          }
          break;
        case "x^y":
          console.log("Entered into x^y")
          setInput(`${input}^`)
          break;
          default:
          break;
      }
    } catch (error) {
      setResult("Error");
    }
  };

  const handleMPlusButton = () => {
    setShowM(true)
    console.log(memory,"This is the memo in MPlus function");
    if(memory!==null && memory!==undefined) {
      setMemory(prev=>prev-parseFloat(input));
      console.log(memory,"This is the memory after clicking M- button");
    }
    else{
      console.log("No memory value to plus");
    }
    setMemory(prev => prev + parseFloat(input))
    console.log(memory, "This is the memory after clicking the M+ button")
  }

  // const handleMPlusButton = () => {
  //   setMemory(prev => (prev || 0) + parseFloat(input));
  //   console.log(memory || 0, "This is the memory after clicking the M+ button");
  // }
  
  // const handleMMinusButton = () => {
  //   setMemory(prev => prev - parseFloat(input));
  //   console.log(memory, "This is the memory after clicking the M- button")
  // }

  const handleMMinusButton = () => {
    setShowM(true);
    console.log(memory,"this is mem value");
    if (memory !== null && memory !== undefined) { // Check if memory has a value
      setMemory(prev => prev - parseFloat(input));
      console.log(memory, "This is the memory after clicking the M- button");
    } else {
      console.log("No memory value to subtract from.");
    }
  }
  
  useEffect(() => {
    console.log("Result has been updated:", result);

  }, [result]);

  const handleLogOfXWithBasey = () => {
    if (input !== null) {
      setIsLogXY(true);
      setInput(prev => prev + "logxBasey")
    }
  }
  const handleMod = () => {
    setIsMod(true);
    console.log(showM,"this is showM value")
    setInput(prev=>prev+"mod")
  };
  const handleModulusOperation = (inputStr) => {
    // Replace 'mod' with '%'
    const modifiedInput = inputStr.replace(/(\d+)\s*mod\s*(\d+)/g, (match, p1, p2) => {
      return `${p1} % ${p2}`; // replace with modulo operator
    });

    try {
      const evalResult =math.evaluate(modifiedInput);
      return evalResult;
    } catch (error) {
      console.error('Error evaluating expression:', error);
      return "Error";
    }
  };
//   const handleFactorial = () => {
//     try {
//         // Match the last number and the preceding operator
//         const lastNumberMatch = input.match(/([-+]?\d+)(?!.*\d)/); // Match the last number
//         const operatorMatch = input.match(/([+\-*/])\s*([-+]?\d+)(?!.*\d)/); // Match the operator before the last number
 
//         if (!lastNumberMatch) {
//             setResult("Error: No number found for factorial");
//             return;
//         }
 
//         const lastNumber = parseFloat(lastNumberMatch[0]);
 
//         // Check if the last number is a non-negative integer
//         if (!Number.isInteger(lastNumber) || lastNumber < 0) {
//             setResult("Error: Factorial of a negative number or non-integer");
//             return;
//         }
 
//         // Calculate the factorial
//         const factorialValue = math.factorial(lastNumber);
// const factOpInfo=extractOperatorInfo(input)
// console.log(factOpInfo)
// const{numberBeforeOperator,operator,numberAfterOperator}=factOpInfo;
//         // Create the factorial expression
//         const factorialExpression = `fact(${lastNumber})`;
//         setInput(`${numberBeforeOperator}${operator}fact(${numberAfterOperator})`)
 
//         // Construct new input, retaining the operator
//         let newInput = input;
 
//         if (operatorMatch) {
//             // If there's an operator, replace the last number with the factorial expression
//             newInput = newInput.replace(lastNumberMatch[0], factorialExpression); // Replace last number with factorial expression
//         } else {
//             // If no operator, just replace the last number
//             newInput = newInput.replace(lastNumberMatch[0], factorialExpression);
//         }
 
//         // Add the operator back if it was present
//         if (operatorMatch) {
//             // Insert the operator before the factorial expression
//             const operator = operatorMatch[1]; // Get the operator
//             newInput = newInput.replace(/([+\-*/])\s*fact\(\d+\)/, `${operator} ${factorialExpression}`);
//         }
 
//         // Update the input and result
//         // setInput(newInput); // Update input to show the factorial expression
//         setInput(`${numberBeforeOperator}${operator}fact(${numberAfterOperator})`)
//         setResult(factorialValue); // Update the result with the calculated factorial
//     } catch (error) {
//         console.error("Error in handleFactorial:", error);
//         setResult("Error: Invalid input");
//     }
// };



const handleFactorial = () => {
  console.log("In handle factorial function", input);
  
  // Regular expression to find the last number or parentheses
  const lastNumberMatch = input.match(/(\d+\.?\d*)\s*$/); // Match the last number at the end of the string
  
  if (lastNumberMatch) {
    const lastNumber = lastNumberMatch[0].trim(); // Get the last matched number

    // Replace the last number or the empty space after it with its factorial representation
    const updatedInput = input.slice(0, -lastNumber.length) + `factorial(${lastNumber})`;

    console.log(`Replacing last number ${lastNumber} with factorial(${lastNumber})`);
    setInput(updatedInput); 
    setResult(math.factorial(lastNumber))
  } else {
    // If the input ends with a space, you might want to handle it
    if (input.endsWith(' ')) {
      // If it ends with a space, we can safely append factorial()
      setInput(input + 'factorial()');
      // setResult()
    } else {
      // If no number found, log an error
      console.log("No number found to apply factorial on.");
      setInput(`factorial(0)`)
      setResult(math.factorial(0))
    }
  }
};


// *********************************************************************************
// *********************************************************************************
const handleYthRoot = () => {
  console.log(input);
  // Assume the first part of the input is the number and the second part is the root
  let var1 = input === "" ? 0 : input;
  let var2 = ""; // Initialize var2 as needed (e.g., you might want to get the y-value)
  setInput(`${var1}yroot${var2}`);
};

// *********************************************************************************
// *********************************************************************************

  
const handlePercentage = () => {
    try {
      setResult(math.evaluate(input) / 100);
    } catch (error) {
      setResult("Error");
    }
  };

  const handleInverse = () => {
    try {
      setResult(1 / math.evaluate(input));
    } catch (error) {
      setResult("Error");
    }
  };

  const handleCubRoot = () => {
    try {
      setInput(`cbrt(${input})`)
      const cubeOpInfo=extractOperatorInfo(input);
      console.log(cubeOpInfo);
      if(cubeOpInfo){
        const{numberAfterOperator,numberBeforeOperator,operator}=cubeOpInfo;
        setInput(`${numberBeforeOperator}${operator}cbrt(${numberAfterOperator})`)
        // setResult(math.evaluate(input))
        setResult(math.cbrt(numberAfterOperator))
      }
      else{
        setResult(math.cbrt(math.evaluate(input)));
      }
    } catch (error) {
      setResult("Error");
    }
  };
  const handleAbs = () => {
    try {
        const evaluatedValue = math.evaluate(input);
        const absResult = Math.abs(evaluatedValue);
        const expression = `abs(${evaluatedValue})`;
        setInput(expression);
        setResult(absResult);
    } catch (error) {
        console.error("Error in handleAbs:", error);
        setResult("Error: Invalid input");
    }
};
// *************************************************
const handlePlusMinus = () => {
  try {
      if (input) {
          const evaluatedValue = math.evaluate(input);
          const newValue = -evaluatedValue;
          setInput(newValue.toString());
      }
  } catch (error) {
      console.error("Error in handlePlusMinus:", error);
      setResult("Error: Invalid input");
  }
};
// *********************************************************
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const closePopup = () => {
    setIsVisible(false);
  };

  const minimizePopup = () => {
    setIsMinimized(prev => !prev);

  };
  const handleHelpClick = ({ onClose }) => {
    setShowHelp(prev => !prev);
  }
  const calculateExpN=()=>{
    console.log(input,"inputt");
    let var1=input===""?0:input;
    let var2=0;
    setInput(`${var1}e+${var2}`);
  }

  
  return (
    <Draggable>
      <div className={isMinimized ? "hideTheCalc Calculatormaindivpopup" : "Calculatormaindiv Calculatormaindivpopup"}>
        <div className="Calculatorheader">
          {" "}
          <h4 className="calcName">Scientific Calculator</h4>{" "}
          <div className={`Calculatorheaderright ${isMinimized ? 'minimized' : ''} ${isVisible ? 'show' : ''}`}>
            <button className="Calculatorhelp" onClick={handleHelpClick} >
              {showHelp ? "Back" : "Help"}
            </button>
            {isMinimized ?
              (<FaRegWindowMaximize style={{fontSize: "28px", cursor: "pointer" }} onClick={minimizePopup} />) :
              (
              // <i className="fa-solid fa-minus minusButton" ></i>
              <FaMinus onClick={minimizePopup} style={{fontSize: "28px", cursor: "pointer" }}/>
              )
            }
            {/* <i className="fa-solid fa-xmark" ></i>
             */}
            <FaXmark onClick={onClose} style={{fontSize: "28px", cursor: "pointer" }}/>
          </div>
        </div>

        {showHelp ? (<>
          <div className="helpDivInCalc">
            <h2 className="instructionsHeading">Calculator Instructions</h2>
            <div>
              <p> You can operate the calculator using the buttons provided on screen with your mouse. </p>
              <p>
                Allows you to perform basic and complex mathematical operations such as modulus, square root, cube root, trigonometric, exponential, logarithmic, hyperbolic functions, etc.</p>
            </div>
            <h2 className="headdingDos">Do's:</h2>
            <ul>
              <li> Be sure to press [C] when beginning a new calculation.</li>
              <li> Simply an equation using parenthesis and other mathematical operators.</li>
              <li> Use the predefined operations such as p (Pi), log, Exp to save time during calculation.</li>
              <li> Use memory function for calculating cumulative totals.</li>
              <strong>
                [M+]: Will add displayed value to memory.
              </strong>
              <br />
              <strong>
                [MR]: Will recall the value stored in memory.
              </strong>
              <br />
              <strong>
                [M-]: Subtracts the displayed value from memory.
              </strong>
              <br />
              <li> Be sure select the angle unit (Deg or Rad) before beginning any calculation.</li>
              <strong>Note: By default angle unit is set as Degree</strong>
            </ul>
            <h2 className="toBeRed"><span>Don'ts:</span></h2>
            <ul>
              <li>"Perform multiple operations together."</li>
              <li>"Leave parenthesis unbalanced."</li>
              <li>"Change the angle unit (Deg or Rad) while performing a calculation.."</li>
            </ul>
            <h2><span>Limitations:</span></h2>
            <ul>
              <li>"Keyboard operation is disabled."</li>
              <li>"The output for a Factorial calculation is precise up to 14 digits."</li>
              <li>"The output for Logarithmic and Hyperbolic calculations is precise up to 5 digits."</li>
              <li>"Modulus (mod) operation performed on decimal numbers with 15 digits would not be precise."</li>
              <br />
              <strong> Use mod operation only if the number comprises of less than 15 digits i.e. mod operation provides best results for smaller numbers.</strong>
              <br />
              <li>The range of value supported by the calculator is 10(-323) to 10(308).</li>
            </ul>

          </div>
        </>
        ) : (
          <>
            <div className="calculator1 ">
              <input type="text" value={input} readOnly className="calculatorinput" />
              {/* <button className="downloadsButton"> 1</button> */}
              <div className="calculatorinput">{result}</div>
              <div className={showM?`MText mDF`:"mDN"}  >M</div>
              <div className="calculatorbuttons">
                <div className="firstcolom">
                  <button className="calculatorbutton" onClick={handleMod}>
                    mod
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("sinh")}
                  >
                    sinh
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("asinh")}
                  >
                    sinh⁻¹
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleButtonClick("π")}
                  >
                    π
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("sin")}
                  >
                    sin
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("asin")}
                  >
                    sin⁻¹
                  </button>
                </div>
                <div className="firstcolom">
                  <div className="mode">
                    <label>
                      <input
                        type="radio"
                        value="Deg"
                        checked={mode === "Deg"}
                        onChange={handleModeChange}
                      />
                      Deg
                    </label>
                  </div>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("cosh")}
                  >
                    cosh
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("acosh")}
                  >
                    cosh⁻¹
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleButtonClick("e")}
                  >
                    e
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("cos")}
                  >
                    cos
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("acos")}
                  >
                    cos⁻¹
                  </button>
                </div>
                <div className="firstcolom">
                  <div className="mode">
                    <label>
                      <input
                        type="radio"
                        value="Rad"
                        checked={mode === "Rad"}
                        onChange={handleModeChange}
                      />
                      Rad
                    </label>
                  </div>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("tanh")}
                  >
                    tanh
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("atanh")}
                  >
                    tanh⁻¹
                  </button>
                  <button className="calculatorbutton" onClick={handleFactorial}>
                    n!
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("tan")}
                  >
                    tan
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleTrigFunction("atan")}
                  >
                    tan⁻¹
                  </button>
                </div>
                <div className="threedcolom">
                  <button
                    className="calculatorbutton"
                    // onClick={() => handlePowerFunction("expN")}
                    onClick={calculateExpN}
                  >
                    Exp
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleLogFunction("log2")}
                  >
                    log₂X
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={
                      handleLogOfXWithBasey
                    }
                  >
                    log<sub>y</sub>x
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handlePowerFunction("x^y")}
                  >
                    xʸ
                  </button>
                  <button className="calculatorbutton" onClick={handleYthRoot}>
                    {/*³√x  */}
                    <sup>y</sup>√x
                  </button>
                </div>
                <div className="threedcolom">
                  <button
                    className="calculatorbutton"
                    onClick={() => handleButtonClick("(")}
                  >
                    (
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleLogFunction("loge")}
                  >
                    ln
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handlePowerFunction("exp")}
                  >
                    eˣ
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handlePowerFunction("x^3")}
                  >
                    x³
                  </button>
                  <button className="calculatorbutton" onClick={handleCubRoot}>

                    ∛
                  </button>
                </div>
                <div className="threedcolom">
                  <button
                    className="calculatorbutton"
                    onClick={() => handleButtonClick(")")}
                  >
                    )
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handleLogFunction("log")}
                  >
                    log
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handlePowerFunction("10^x")}
                  >
                    10ˣ
                  </button>
                  <button
                    className="calculatorbutton"
                    onClick={() => handlePowerFunction("x^2")}
                  >
                    x²
                  </button>
                  <button className="calculatorbutton" onClick={handleAbs}>
                    |X|
                  </button>
                </div>
                <div className="calculatortoplines">
                  <div className="firstlineright">
                    <button className="calculatorbutton" onClick={handleMemoryClear}>MC</button>
                    <button className="calculatorbutton" onClick={handleMemoryRecall}>MR</button>
                    <button className="calculatorbutton" onClick={handleMemoryStore} >MS</button>
                    <button className="calculatorbutton" onClick={handleMPlusButton} >M+</button>
                    <button className="calculatorbutton" onClick={handleMMinusButton} >M-</button>
                  </div>
                  <div className="firstlineright">
                    <button
                      className="calculatorbutton calculatorBackspace"
                      onClick={handleBackspace}
                    >
                      <FaArrowLeftLong />
                    </button>
                    <button
                      className="calculatorbutton calculatorClear"
                      onClick={handleClear}
                    >
                      C
                    </button>
                    <button className="calculatorbutton" onClick={handlePlusMinus}>+/-</button>
                    <button className="calculatorbutton" onClick={handleSqrt}>
                      √
                    </button>
                  </div>
                  <div className="firstlineright">
                    <button
                      className="calculatorbutton"
                      onClick={() => handleButtonClick("7")}
                    >
                      7
                    </button>
                    <button
                      className="calculatorbutton"
                      onClick={() => handleButtonClick("8")}
                    >
                      8
                    </button>
                    <button
                      className="calculatorbutton"
                      onClick={() => handleButtonClick("9")}
                    >
                      9
                    </button>
                    <button
                      className="calculatorbutton"
                      onClick={() => handleOperator("/")}
                    >
                      /
                    </button>
                    <button className="calculatorbutton" onClick={handlePercentage}>
                      %
                    </button>
                  </div>
                  <div className="firstlineright">
                    <button
                      className="calculatorbutton"
                      onClick={() => handleButtonClick("4")}
                    >
                      4
                    </button>
                    <button
                      className="calculatorbutton"
                      onClick={() => handleButtonClick("5")}
                    >
                      5
                    </button>
                    <button
                      className="calculatorbutton"
                      onClick={() => handleButtonClick("6")}
                    >
                      6
                    </button>
                    <button
                      className="calculatorbutton"
                      onClick={() => handleOperator("*")}
                    >
                      *
                    </button>
                    <button className="calculatorbutton" onClick={handleInverse}>
                      1/x
                    </button>
                  </div>
                  <div className="secondlineright">
                    <button
                      className="calculatorbutton"
                      onClick={() => handleButtonClick("1")}
                    >
                      1
                    </button>
                    <button
                      className="calculatorbutton"
                      onClick={() => handleButtonClick("2")}
                    >
                      2
                    </button>
                    <button
                      className="calculatorbutton"
                      onClick={() => handleButtonClick("3")}
                    >
                      3
                    </button>
                    <button
                      className="calculatorbutton"
                      onClick={() => handleOperator("-")}
                    >
                      -
                    </button>
                  </div>
                  <div className="calculatorequalto" >
                    <button
                      className="calculatorbutton calculatorequalto1"
                      onClick={handleEvaluate}
                    >
                      =
                    </button>
                  </div>
                  <div className="secondlineright secondlineright11 ">
                    <button
                      className="calculatorbutton calculatorzero"
                      onClick={() => handleButtonClick("0")}
                    >
                      0
                    </button>
                    <button
                      className="calculatorbutton"
                      onClick={() => handleButtonClick(".")}
                    >
                      .
                    </button>
                    <button
                      className="calculatorbutton"
                      onClick={() => handleOperator("+")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
        }
      </div>
  </Draggable>
  );
};

export default ScientificCalculator;
