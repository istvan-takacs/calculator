let numberOne;
let numberTwo;
let operationSign;
let operationFunctions = {
        plus: (a,b) => a+b,
        minus: (a,b) => a-b,
        multiplication: (a,b) => a*b,
        division: (a,b) => a/b
    };
let currentSum = 0;

function operate() {
    return operationFunctions[operationSign](numberOne, numberTwo);
}

function addNumberToDisplay() {
    document.querySelectorAll(".digit").forEach(btn => {
        btn.addEventListener("click", () => {
            const digit = document.querySelector(".display-number");
            digit.textContent += btn.textContent;
            currentSum = digit.textContent;
        })
    })
}

function addOperatorFunctionality() {
    document.querySelectorAll(".operator").forEach(btn => {
        btn.addEventListener("click", () => {
            operationSign = btn.id;
            const digit = document.querySelector(".display-number");
            currentSum, numberOne = +digit.textContent;
            digit.textContent = "";
        })
    })
}

function clearDisplay() {
    const clearBtn = document.querySelector("#clear");
    const digit = document.querySelector(".display-number");
    clearBtn.addEventListener("click", () => digit.textContent = "")
}

function equals(){
    document.querySelector("#equals").addEventListener("click", () => {
        const digit = document.querySelector(".display-number");
        numberTwo = +digit.textContent;
        currentSum = operate();
        numberOne, digit.textContent = currentSum;
    })
}


addNumberToDisplay();
clearDisplay();
addOperatorFunctionality();
equals()