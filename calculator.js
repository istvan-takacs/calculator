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
        shouldClearDisplay = false;
    }
    
    // Prevent multiple decimal points
    if (digit === "." && display.textContent.includes(".")) return;

    if (display.textContent === "0") display.textContent = "";

    // Display operation in top screen
    if (currentOperation) {
        lastOperation.textContent += digit
    }
    display.textContent += digit;
}

function handleOperatorClick(operation) {
    // Allow negative signs
    if (operation === "minus" && isDisplayEmpty()) {
        display.textContent = "-";
        return;
    }    
    
    // Don't execute if display is empty or just a minus
    if (isDisplayEmpty() || display.textContent === "-") return;

    // Strip any existing operator before parsing
    const currentNumber = parseFloat(stripOperatorFromDisplay());
    
    // If we already have a pending operation, evaluate it first
    if (firstNumber !== null && currentOperation !== null && !shouldClearDisplay) {
        const result = operate(currentOperation, firstNumber, currentNumber);
        updateLastOperationDisplay(firstNumber, currentOperation, currentNumber, true);
        display.textContent = result;
        firstNumber = result;
    } else {
        // First number in the chain
        firstNumber = currentNumber;
    }
    
    // Set new operation and flag to clear on next digit
    currentOperation = operation;
    shouldClearDisplay = true;
    
    updateLastOperationDisplay(firstNumber, currentOperation);
}

function handleEquals() {
    if (firstNumber === null || currentOperation === null || isDisplayEmpty() || shouldClearDisplay) return;

    const secondNumber = parseFloat(stripOperatorFromDisplay());
    const result = operate(currentOperation, firstNumber, secondNumber);
    
    display.textContent = result;
    updateLastOperationDisplay(firstNumber, currentOperation, secondNumber, true);
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
    if (isDisplayEmpty()) return;
    
    // Handle backspace on main display
    let deletedKey = display.textContent.slice(-1);
    display.textContent = display.textContent.slice(0, -1);

    // Handle backspace on the last operation display
    deletedKey = lastOperation.textContent.slice(-1);
    if (deletedKey != "=" && !(deletedKey in operators)) {
        lastOperation.textContent = lastOperation.textContent.slice(0, -1);
    }
    
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

function handleSignChange() {
    if (isDisplayEmpty()) return;

    if (display.textContent.startsWith("-")) {
        display.textContent = display.textContent.slice(1);
    } else {
        display.textContent = "-" + display.textContent;
    }

}

function handleKeyboard(key) {
    // Find the corresponding button element
    let button = null;
    
    if (Number.isInteger(+key) || key === ".") {
        handleDigitClick(key);
        // Find digit button by ID or text content
        button = key === "." 
            ? document.querySelector("#floating-point")
            : document.querySelector(`#digit-${key}`);
    } else if (key in operators) {
        handleOperatorClick(operators[key]);
        button = document.querySelector(`#${operators[key]}`);
    } else if (key === "=" || key === "Enter") {
        handleEquals();
        button = document.querySelector("#equals");
    } else if (key === "Backspace") {
        handleBackspace();
        button = document.querySelector("#delete-last");
    } else if (key === "Escape") {
        handleClear();
        button = document.querySelector("#clear");
    }
    
    // Add visual feedback if button was found
    if (button) {
        button.classList.add("pressed");
        setTimeout(() => button.classList.remove("pressed"), 120);
    }
}

// -------------------------------
// Utility functions 
// -------------------------------
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function stripOperatorFromDisplay() {
    let displayValue = display.textContent;
    for (let op in operators) {
        if (displayValue.endsWith(op)) {
            return displayValue.slice(0, -1);
        }
    }
    return displayValue;
}

function updateLastOperationDisplay(first, operator, second = "", equals = false) {
    const symbol = getKeyByValue(operators, operator);
    lastOperation.textContent = `${first} ${symbol} ${second}${equals ? " =" : ""}`;
}

function isDisplayEmpty() {
    return (display.textContent === "");
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

document.querySelector("#delete-last").addEventListener("click", handleBackspace);

document.querySelector("#plus-minus").addEventListener("click", handleSignChange);

document.addEventListener("keydown", (e) => {
    // Prevent default for slash to avoid browser search
    if (e.key === "/") e.preventDefault();
    handleKeyboard(e.key);
});

document.querySelector("#equals").addEventListener("click", handleEquals);
document.querySelector("#clear").addEventListener("click", handleClear);