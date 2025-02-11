const display = document.querySelector('.calculator__input');
let stack = [];

function loadFromLocalStorage() {
    const savedStack = localStorage.getItem('calculatorStack');
    if (savedStack) {
        stack = JSON.parse(savedStack);
    }
    
    updateDisplay();
}

function saveToLocalStorage() {
    localStorage.setItem('calculatorStack', JSON.stringify(stack));
}

function append(input) {
    if (input === 'open-bracket'){
        input = '(';
    } else if (input === 'close-bracket') {
        input = ')';
    }

    let openBracket = stack.filter(x => x  === '(' ).length;
    let closeBracket = stack.filter(x => x === ')').length;
    if (input === ')' && closeBracket >= openBracket) {
        return;
    }


    if (input !== '.' && stack[0] == '0') {
        stack.pop();
    }
    
    if (!isNaN(input) || input === '.') {
        if (stack.length > 0 && (!isNaN(stack[stack.length - 1]) || stack[stack.length - 1].includes('.'))) {
            if (input === '.' && (stack[stack.length - 1].includes('.'))) {
                return;
            }
            stack[stack.length - 1] += input;
        } else {
            stack.push(input);
        }
    } else {
        if (stack[stack.length - 1].includes('(') && (input !== (('(') || (')')))) {
            return;
        } else {
            stack.push(input);
        }
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
    if (stack.length === 0) {
        stack = ['0'];
    }
    display.value = stack.join(' ');
    console.log(stack);
}

function result() {
    saveToLocalStorage();
    let postfix = infixToPostfix(stack);
    let res = evaluatePostfix(postfix);
    stack = [res.toString()];
    updateDisplay();
}

function infixToPostfix(infix) {
    let ops = [];
    let out = [];
    let priority = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3};

    for (let i = 0; i < infix.length; i++) {
        let token = infix[i];
        if (!isNaN(token)) {
            out.push(token);
        } else if (token === '(') {
            ops.push(token);
        } else if (token === ')') {
            while (ops[ops.length - 1] !== '(' ) {
                out.push(ops.pop());
            }
            ops.pop();
        }
        else {
            while(ops.length) {
                if (priority[ops[ops.length - 1]] >= priority[token]) {
                    out.push(ops.pop());
                } else {
                    break;
                }
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
            
            switch (token) {
                case '+': 
                    s.push(a + b);
                    break;
                case '-':
                    s.push(a - b);
                    break;
                case '*':
                    s.push(a * b);
                    break;
                case '/':
                    s.push(a / b);
                    break;
                case '^':
                    s.push(Math.pow(a, b));
                    break;
            }
        }
    }
    return s.pop();
}

window.onload = loadFromLocalStorage;