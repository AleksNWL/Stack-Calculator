const display = document.querySelector('.calculator__input');
let stack = [];

function append(input) {
    if (!isNaN(input)) {
        if (stack.length > 0 && !isNaN(stack[stack.length - 1])) {
            stack[stack.length - 1] += input;
        } else {
            stack.push(input);
        }
    } else {
        stack.push(input);
    }
    updateDisplay();
}

function clearAll() {
    stack.length = 0;
    updateDisplay();
}

function clearLast() {
    stack.pop();
    updateDisplay();
}

function updateDisplay() {
    display.value = stack.join('');
    console.log(stack);
}

function result () {
    let operators = [];
    for (let i = 0; i < stack.length; i++) {
        if(isNaN(stack[i])) {
            operators.push(stack[i]);
            console.log(operators);
        }
    }
}