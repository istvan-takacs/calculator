// -------------------------------
// Global variables
// -------------------------------
const operationFunctions = {
    plus: (a, b) => a + b,
    minus: (a, b) => a - b,
    multiplication: (a, b) => a * b,
    division: (a, b) => b === 0 ? "Dividing by 0, huh...?" : a / b // Displays error if division with 0
};
const operators = {
    "+": "plus",
    "-": "minus",
    "*": "multiplication",
    "/": "division"
};
const display = document.querySelector(".display-number");

let firstNumber = null;
let currentOperation = null;
let shouldClearDisplay = false; 

// -------------------------------
// Calculator functions
// -------------------------------

function operate(operation, a, b) {
    return operationFunctions[operation](a, b);
}

function handleDigitClick(digit) {
    // Clear display if we should (after operator or equals)
    if (shouldClearDisplay) {
        display.textContent = "";
        shouldClearDisplay = false;
    }
    if (!(display.textContent.includes(".") && digit === ".")) {
        display.textContent += digit;
    }
}

function handleOperatorClick(operation) {
    // Do not execute if have not been any digits pressed or the last pressed  button/key was an operator
    if (display.textContent === "" || display.textContent.slice(-1) in operators) return;
    
    const currentNumber = parseFloat(display.textContent);
    
    // If we already have a pending operation, evaluate it first
    if (firstNumber !== null && currentOperation !== null) {
        const result = operate(currentOperation, firstNumber, currentNumber);
        display.textContent = result;
        firstNumber = result;
    } else {
        // First number in the chain
        firstNumber = currentNumber;
    }
    
    // Set new operation and flag to clear on next digit
    currentOperation = operation;
    shouldClearDisplay = true;
    // Append the current operation at the end of the display
    const operatorButton = document.getElementById(currentOperation);
    display.textContent += operatorButton.textContent;
}

function handleEquals() {
    if (firstNumber === null || currentOperation === null || display.textContent === "") return;
    
    const secondNumber = parseFloat(display.textContent);
    const result = operate(currentOperation, firstNumber, secondNumber);
    
    display.textContent = result;
    firstNumber = null;
    currentOperation = null;
    shouldClearDisplay = true;
}

function handleClear() {
    display.textContent = "";
    firstNumber = null;
    currentOperation = null;
    shouldClearDisplay = false;
}

function handleKeyboard(key) {
    if (Number.isInteger(+key)|| key === ".") {
        handleDigitClick(key);
    } else if (key in operators) {
        handleOperatorClick(operators[key]);
    } else if (key === "=" || key === "Enter") {
        handleEquals();
    } else if (key === "Backspace") {
        let deletedKey = display.textContent.slice(-1);
        display.textContent = display.textContent.slice(0, -1);
        if (deletedKey in operators) currentOperation = null;
    }
}

// -------------------------------
// Event listeners
// -------------------------------
document.querySelectorAll(".digit").forEach(btn => {
    btn.addEventListener("click", () => handleDigitClick(btn.textContent));
});
document.querySelectorAll(".operator").forEach(btn => {
    btn.addEventListener("click", () => handleOperatorClick(btn.id));
});
document.addEventListener("keydown", (e) => handleKeyboard(e.key)); // Add keyboard support for operators, digits and floating points

document.querySelector("#equals").addEventListener("click", handleEquals);
document.querySelector("#clear").addEventListener("click", handleClear);