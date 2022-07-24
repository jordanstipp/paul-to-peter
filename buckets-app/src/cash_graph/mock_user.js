import {Graph, User, IncomeSource, Investment, Edge, Expense} from './main.js';
let userGraph = new Graph('Simple Demo User');

let user = new User('Self_User', 'User', 0);
userGraph.add_node(user);

let nuro = new IncomeSource('Nuro', user.id, 1000000);
userGraph.add_node(nuro);


let retirement = new Investment('401k', 10000);
userGraph.add_node(retirement);
userGraph.add_new_edge_to_graph(user.id, retirement.id, 10000);

let bmw_expense = new Expense('BMW i3');
userGraph.add_node(bmw_expense);
userGraph.add_new_edge_to_graph(user.id, bmw_expense.id, 9600);


console.log(userGraph);
export default userGraph;