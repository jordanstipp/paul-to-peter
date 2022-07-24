import {Graph, User, IncomeSource, Investment, Edge, Expense} from './main.js';

let userGraph = new Graph('New Start');
let user = new User('You', 'User', 800);
userGraph.add_node(user);
export default userGraph;