// -------------------------------
// Global variables
// -------------------------------
const operationFunctions = {
    plus: (a, b) => a + b,
    minus: (a, b) => a - b,
    multiplication: (a, b) => a * b,
    division: (a, b) => b === 0 ? "Dividing by 0, huh...?" : a / b
};

const operators = {
    "+": "plus",
    "-": "minus",
    "*": "multiplication",
    "/": "division"
};

const display = document.querySelector(".current-operation-display");
const lastOperation = document.querySelector(".last-operation-display");

let firstNumber = null;
let currentOperation = null;
let shouldClearDisplay = false; 

// -------------------------------
// Calculator functions
// -------------------------------

function operate(operation, a, b) {
    const result = operationFunctions[operation](a, b);
    return typeof result === 'number' ? Math.round(result * 100000000) / 100000000 : result;
}

function handleDigitClick(digit) {
    // Clear display if we should (after operator or equals)
    if (shouldClearDisplay) {
        display.textContent = "";
        lastOperation.textContent = "";
        shouldClearDisplay = false;
    }
    
    // Clear initial "0" when starting to type (unless typing decimal point)
    if (display.textContent === "0" && digit !== ".") {
        display.textContent = digit;
        return;
    }
    
    // Prevent multiple decimal points
    if (digit === "." && display.textContent.includes(".")) return;
    
    display.textContent += digit;
}

function handleOperatorClick(operation) {
    // Don't execute if display is empty
    if (display.textContent === "") return;
    
    // Strip any existing operator before parsing
    let displayValue = display.textContent;
    for (let op in operators) {
        if (displayValue.endsWith(op)) {
            displayValue = displayValue.slice(0, -1);
            break;
        }
    }
    const currentNumber = parseFloat(displayValue);
    
    // If we already have a pending operation, evaluate it first
    if (firstNumber !== null && currentOperation !== null && !shouldClearDisplay) {
        const result = operate(currentOperation, firstNumber, currentNumber);
        lastOperation.textContent = `${firstNumber}${currentOperation}${currentNumber}`
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
    const operatorSign = getKeyByValue(operators, currentOperation)
    lastOperation.textContent = `${firstNumber}${operatorSign}`;
}

function handleEquals() {
    if (firstNumber === null || currentOperation === null || display.textContent === "" || shouldClearDisplay) return;
    
    // Strip operator before parsing
    let displayValue = display.textContent;
    for (let op in operators) {
        if (displayValue.endsWith(op)) {
            displayValue = displayValue.slice(0, -1);
            break;
        }
    }
    const operatorSign = getKeyByValue(operators, currentOperation)
    const secondNumber = parseFloat(displayValue);
    const result = operate(currentOperation, firstNumber, secondNumber);
    
    display.textContent = result;
    lastOperation.textContent = `${firstNumber}${operatorSign}${secondNumber}`;
    firstNumber = result;
    currentOperation = null;
    shouldClearDisplay = true;
}

function handleClear() {
    display.textContent = "";
    lastOperation.textContent = "";
    firstNumber = null;
    currentOperation = null;
    shouldClearDisplay = false;
}

function handleBackspace() {
    if (display.textContent === "") return;
    
    let deletedKey = display.textContent.slice(-1);
    display.textContent = display.textContent.slice(0, -1);
    
    // If we deleted an operator, reset the operation
    if (deletedKey in operators) {
        currentOperation = null;
        shouldClearDisplay = false;
    }
    
    // If display is now empty after backspace
    if (display.textContent === "") {
        shouldClearDisplay = false;
    }
}

function handleKeyboard(key) {
    if (Number.isInteger(+key) || key === ".") {
        handleDigitClick(key);
    } else if (key in operators) {
        handleOperatorClick(operators[key]);
    } else if (key === "=" || key === "Enter") {
        handleEquals();
    } else if (key === "Backspace") {
        handleBackspace();
    } else if (key === "Escape") {
        handleClear();
    }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}


// -------------------------------
// Event listeners
// TODO: IMPLEMENT +/- button!, Text keeps slipping between displays,
// -------------------------------
document.querySelectorAll(".digit").forEach(btn => {
    btn.addEventListener("click", () => handleDigitClick(btn.textContent));
});

document.querySelectorAll(".operator").forEach(btn => {
    btn.addEventListener("click", () => handleOperatorClick(btn.id));
});

document.querySelector("#delete-last").addEventListener("click", handleBackspace);

document.addEventListener("keydown", (e) => {
    // Prevent default for slash to avoid browser search
    if (e.key === "/") e.preventDefault();
    handleKeyboard(e.key);
});

document.querySelector("#equals").addEventListener("click", handleEquals);
document.querySelector("#clear").addEventListener("click", handleClear);