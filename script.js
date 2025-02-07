const display = document.querySelector('.calculator__input');
let stack = [];

function loadFromLocalStorage() {
    const savedStack = localStorage.getItem('calculatorStack');
    if (savedStack) {
        stack = JSON.parse(savedStack);
        updateDisplay();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('calculatorStack', JSON.stringify(stack));
}

function append(input) {
    if (!isNaN(input) || input === '.') {
        if (stack.length > 0 && (!isNaN(stack[stack.length - 1]) || stack[stack.length - 1].includes('.'))) {
            stack[stack.length - 1] += input;
        } else {
            stack.push(input);
        }
    } else {
        stack.push(input);
    }
    saveToLocalStorage();
    updateDisplay();
}

function clearAll() {
    stack = [];
    saveToLocalStorage();
    updateDisplay();
}

function clearLast() {
    stack.pop();
    saveToLocalStorage();
    updateDisplay();
}

function updateDisplay() {
    display.value = stack.join(' ');
    console.log(stack);
}

function result() {
    if (stack.length === 0) return;
    let postfix = infixToPostfix(stack);
    let res = evaluatePostfix(postfix);
    stack = [res.toString()];
    saveToLocalStorage();
    updateDisplay();
}

function infixToPostfix(infix) {
    let prec = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3};
    let out = [];
    let ops = [];

    for (let i = 0; i < infix.length; i++) {
        let token = infix[i];
        if (!isNaN(token)) {
            out.push(token);
        } else {
            while (ops.length && prec[ops[ops.length - 1]] >= prec[token]) {
                out.push(ops.pop());
            }
            ops.push(token);
        }
    }
    while (ops.length) {
        out.push(ops.pop());
    }
    return out;
}

function evaluatePostfix(postfix) {
    let s = [];
    for (let i = 0; i < postfix.length; i++) {
        let token = postfix[i];
        if (!isNaN(token)) {
            s.push(parseFloat(token));
        } else {
            let b = s.pop();
            let a = s.pop();
            if (token === '+') s.push(a + b);
            else if (token === '-') s.push(a - b);
            else if (token === '*') s.push(a * b);
            else if (token === '/') s.push(a / b);
            else if (token === '^') s.push(Math.pow(a, b));
        }
    }
    return s.pop();
}

window.onload = loadFromLocalStorage;
