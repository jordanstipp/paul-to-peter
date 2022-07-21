import {Graph, User, IncomeSource, Investment, Edge, Expense} from './main.js';

let userGraph = new Graph();

let user = new User(userGraph, 'Mekhi', 'User', 800);

// Income 
let nuro = new IncomeSource(userGraph, 'Nuro', user.id, 8000);

// Investments
let retirement = new Investment(userGraph, '401k', 18000);
let retirement_contribution = new Edge(userGraph, user.id, retirement.id, 300);

let speculative_investment = new Investment(userGraph, 'Speculative Investments', 2000);
let speculative_contribution = new Edge(userGraph, user.id, speculative_investment.id, 200);


let longterm_investment = new Investment(userGraph, 'TDAmeritrade Long Term Portfolio', 4000);
let longterm_contribution = new Edge(userGraph, user.id, longterm_investment.id, 400);


let real_estate_investment = new Investment(userGraph, 'MMAD Holdings Real Estate', 13000);
let real_estate_contribution = new Edge(userGraph, user.id, real_estate_investment.id, 500);

let crypto_portfolio = new Investment(userGraph, 'Crypto Holdings', 4000);
let crypto_portfolio_contribution = new Edge(userGraph, user.id, crypto_portfolio.id, 333.33);

// Savings
let emergency_savings = new Investment(userGraph, 'Emergency Savings', 3500);
let emergency_savings_contribution = new Edge(userGraph, user.id, emergency_savings.id, 333.33);

let vacation_savings = new Investment(userGraph, 'Vacation Savings', 3500);
let vacation_savings_contribution = new Edge(userGraph, user.id, vacation_savings.id, 500);

// Expenses
let bmw_expense = new Expense(userGraph, 'BMW i3');
let bmw_loan_cost = new Edge(userGraph, user.id, bmw_expense.id, 450);
let bmw_insurance_cost = new Edge(userGraph, user.id, bmw_expense.id, 300);
let bmw_garage_cost = new Edge(userGraph, user.id, bmw_expense.id, 150);

let apartment = new Expense(userGraph, 'Stan Chaban - 2295 California Street');
let rent_cost = new Edge(userGraph, user.id, apartment.id, 1750);

let fixed_expenses = new Expense(userGraph, 'Fixed Expenses (Subscriptions, Bills)');
let comcast = new Edge(userGraph, user.id, fixed_expenses.id, 60);
let tmobile = new Edge(userGraph, user.id, fixed_expenses.id, 156.08);
let equinox = new Edge(userGraph, user.id, fixed_expenses.id, 199);
let subscriptions = new Edge(userGraph, user.id, fixed_expenses.id, 129.65);



export default userGraph;