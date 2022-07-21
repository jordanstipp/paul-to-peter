import {Graph, User, IncomeSource, Investment, Edge, Expense} from './main.js';
let globalGraph = new Graph();

let user = new User(globalGraph, 'Self_User', 'User', 0);

let nuro = new IncomeSource(globalGraph, 'Nuro', user.id, 1000000);


let retirement = new Investment(globalGraph, '401k', 10000);
let retirment_contribution = new Edge(globalGraph, user.id, retirement.id, 10000);

let bmw_expense = new Expense(globalGraph, 'BMW i3');
let bmw_cost = new Edge(globalGraph, user.id, bmw_expense.id, 9600);


console.log(globalGraph);
export default globalGraph;