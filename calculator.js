const operationFunctions = {
    plus: (a, b) => a + b,
    minus: (a, b) => a - b,
    multiplication: (a, b) => a * b,
    division: (a, b) => b === 0 ? 'Error' : a / b
};

let firstNumber = null;
let currentOperation = null;
let shouldClearDisplay = false;  // New flag
const display = document.querySelector(".display-number");

function operate(operation, a, b) {
    return operationFunctions[operation](a, b);
}

function handleDigitClick(digit) {
    // Clear display if we should (after operator or equals)
    if (shouldClearDisplay) {
        display.textContent = '';
        shouldClearDisplay = false;
    }
    display.textContent += digit;
}

function handleOperatorClick(operation) {
    if (display.textContent === '') return;
    
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
}

function handleEquals() {
    if (firstNumber === null || currentOperation === null || display.textContent === '') return;
    
    const secondNumber = parseFloat(display.textContent);
    const result = operate(currentOperation, firstNumber, secondNumber);
    
    display.textContent = result;
    firstNumber = null;
    currentOperation = null;
    shouldClearDisplay = true;
}

function handleClear() {
    display.textContent = '';
    firstNumber = null;
    currentOperation = null;
    shouldClearDisplay = false;
}

// Event listeners
document.querySelectorAll(".digit").forEach(btn => {
    btn.addEventListener("click", () => handleDigitClick(btn.textContent));
});

document.querySelectorAll(".operator").forEach(btn => {
    btn.addEventListener("click", () => handleOperatorClick(btn.id));
});

document.querySelector("#equals").addEventListener("click", handleEquals);
document.querySelector("#clear").addEventListener("click", handleClear);