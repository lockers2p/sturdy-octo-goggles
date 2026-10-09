const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');

let currentValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function inputDigit(digit) {
  if (waitingForSecondOperand) {
    currentValue = digit;
    waitingForSecondOperand = false;
  } else {
    currentValue = currentValue === '0' ? digit : currentValue + digit;
  }

  updateDisplay();
}

function inputDecimal() {
  if (waitingForSecondOperand) {
    currentValue = '0.';
    waitingForSecondOperand = false;
    updateDisplay();
    return;
  }

  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function clearCalculator() {
  currentValue = '0';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

function deleteDigit() {
  if (waitingForSecondOperand) {
    return;
  }

  if (currentValue.length <= 1 || (currentValue.length === 2 && currentValue.startsWith('-'))) {
    currentValue = '0';
  } else {
    currentValue = currentValue.slice(0, -1);
  }

  updateDisplay();
}

function percentage() {
  const numericValue = Number(currentValue);
  currentValue = String(numericValue / 100);
  updateDisplay();
}

function calculate(first, second, op) {
  switch (op) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return second === 0 ? 'Error' : first / second;
    default:
      return second;
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(currentValue);

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);

    if (result === 'Error') {
      currentValue = 'Error';
      firstOperand = null;
      operator = null;
      waitingForSecondOperand = false;
      updateDisplay();
      return;
    }

    currentValue = String(result);
    firstOperand = result;
  }

  waitingForSecondOperand = true;
  operator = nextOperator;
  updateDisplay();
}

function evaluate() {
  if (operator === null || waitingForSecondOperand) {
    return;
  }

  const secondValue = Number(currentValue);
  const result = calculate(firstOperand, secondValue, operator);

  if (result === 'Error') {
    currentValue = 'Error';
  } else {
    currentValue = String(result);
  }

  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { action, value } = button.dataset;

    if (action === 'number') {
      inputDigit(value);
      return;
    }

    if (action === 'decimal') {
      inputDecimal();
      return;
    }

    if (action === 'clear') {
      clearCalculator();
      return;
    }

    if (action === 'delete') {
      deleteDigit();
      return;
    }

    if (action === 'percent') {
      percentage();
      return;
    }

    if (action === 'operator') {
      handleOperator(value);
      return;
    }

    if (action === 'equals') {
      evaluate();
    }
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
    return;
  }

  if (key === '.') {
    inputDecimal();
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    evaluate();
    return;
  }

  if (key === 'Backspace') {
    deleteDigit();
    return;
  }

  if (key === 'Escape') {
    clearCalculator();
  }
});

updateDisplay();
