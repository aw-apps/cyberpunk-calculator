'use strict';

const display = document.getElementById('display');
const expression = document.getElementById('expression');
const calcDisplay = document.querySelector('.calc-display');

const state = {
  current: '0',
  operator: null,
  operand: null,
  waitingForOperand: false,
  justEvaluated: false,
};

function updateDisplay(val) {
  display.textContent = val;
  display.classList.remove('error');
}

function showError(msg) {
  display.textContent = msg;
  display.classList.remove('error');
  void display.offsetWidth;
  display.classList.add('error');
  expression.textContent = '';
  Object.assign(state, { current: '0', operator: null, operand: null, waitingForOperand: false, justEvaluated: false });
}

function calculate(a, op, b) {
  switch (op) {
    case 'add':      return a + b;
    case 'subtract': return a - b;
    case 'multiply': return a * b;
    case 'divide':
      if (b === 0) return null;
      return a / b;
    default: return b;
  }
}

function formatResult(n) {
  if (!isFinite(n)) return 'ERROR';
  const s = parseFloat(n.toPrecision(12)).toString();
  return s.length > 14 ? parseFloat(n.toPrecision(9)).toString() : s;
}

function handleNumber(digit) {
  if (state.waitingForOperand || state.justEvaluated) {
    state.current = digit === '.' ? '0.' : digit;
    state.waitingForOperand = false;
    state.justEvaluated = false;
  } else {
    if (digit === '.' && state.current.includes('.')) return;
    state.current = state.current === '0' && digit !== '.' ? digit : state.current + digit;
  }
  updateDisplay(state.current);
}

function handleOperator(op) {
  const current = parseFloat(state.current);
  if (state.operator && !state.waitingForOperand) {
    const result = calculate(state.operand, state.operator, current);
    if (result === null) { showError('DIV/0'); return; }
    const formatted = formatResult(result);
    state.operand = parseFloat(formatted);
    state.current = formatted;
    updateDisplay(formatted);
  } else {
    state.operand = current;
  }
  state.operator = op;
  state.waitingForOperand = true;
  state.justEvaluated = false;
  const symbols = {add:'+', subtract:'-', multiply:'x', divide:'/'};
  expression.textContent = state.current + ' ' + symbols[op];
}

function handleEquals() {
  if (!state.operator || state.waitingForOperand) return;
  const current = parseFloat(state.current);
  const result = calculate(state.operand, state.operator, current);
  if (result === null) { showError('DIV/0'); return; }
  const formatted = formatResult(result);
  expression.textContent = '';
  updateDisplay(formatted);
  state.current = formatted;
  state.operator = null;
  state.operand = null;
  state.waitingForOperand = false;
  state.justEvaluated = true;
  calcDisplay.classList.remove('flash');
  void calcDisplay.offsetWidth;
  calcDisplay.classList.add('flash');
  calcDisplay.addEventListener('animationend', () => calcDisplay.classList.remove('flash'), { once: true });
}

function handleAC() {
  Object.assign(state, { current: '0', operator: null, operand: null, waitingForOperand: false, justEvaluated: false });
  expression.textContent = '';
  updateDisplay('0');
}

function handleSign() {
  const val = parseFloat(state.current) * -1;
  state.current = formatResult(val);
  updateDisplay(state.current);
}

function handlePercent() {
  const val = parseFloat(state.current) / 100;
  state.current = formatResult(val);
  updateDisplay(state.current);
}

function handleBackspace() {
  if (state.justEvaluated || state.waitingForOperand) return;
  state.current = state.current.length > 1 ? state.current.slice(0, -1) : '0';
  updateDisplay(state.current);
}

document.querySelector('.calc-keys').addEventListener('click', function(e) {
  const btn = e.target.closest('.key');
  if (!btn) return;
  btn.classList.remove('pressed');
  void btn.offsetWidth;
  btn.classList.add('pressed');
  btn.addEventListener('animationend', () => btn.classList.remove('pressed'), { once: true });
  const action = btn.dataset.action;
  const value = btn.dataset.value;
  if (value !== undefined) { handleNumber(value); return; }
  switch (action) {
    case 'add': case 'subtract': case 'multiply': case 'divide': handleOperator(action); break;
    case 'equals':  handleEquals();  break;
    case 'ac':      handleAC();      break;
    case 'sign':    handleSign();    break;
    case 'percent': handlePercent(); break;
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9') { handleNumber(e.key); return; }
  if (e.key === '.') { handleNumber('.'); return; }
  if (e.key === '+') { handleOperator('add'); return; }
  if (e.key === '-') { handleOperator('subtract'); return; }
  if (e.key === '*') { handleOperator('multiply'); return; }
  if (e.key === '/') { e.preventDefault(); handleOperator('divide'); return; }
  if (e.key === 'Enter' || e.key === '=') { handleEquals(); return; }
  if (e.key === 'Escape') { handleAC(); return; }
  if (e.key === '%') { handlePercent(); return; }
  if (e.key === 'Backspace') { handleBackspace(); return; }
});