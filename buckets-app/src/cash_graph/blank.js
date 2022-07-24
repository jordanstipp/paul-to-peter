import {Graph, User, IncomeSource, Investment, Edge, Expense} from './main.js';

let userGraph = new Graph('New Start');
let user = new User('You', 0);
userGraph.add_node(user);
export default userGraph;