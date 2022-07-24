import {Graph, User, IncomeSource, Investment, Edge, Expense} from './main.js';

let userGraph = new Graph('Complex User');

let user = new User('Mekhi', 'User', 800);
userGraph.add_node(user);

// Income 
let nuro = new IncomeSource('Nuro', user.id, 8000);
userGraph.add_node(nuro);
userGraph.add_new_edge_to_graph(nuro.id, user.id, 6000, 'Monthly Contribution');


// Investments
let retirement = new Investment('401k', 18000);
userGraph.add_node(retirement);
userGraph.add_new_edge_to_graph(user.id, retirement.id, 300, 'Monthly Contribution');

let speculative_investment = new Investment('Speculative Investments', 2000);
userGraph.add_node(speculative_investment);
userGraph.add_new_edge_to_graph(user.id, speculative_investment.id, 200, 'Monthly Contribution');


let longterm_investment = new Investment('TDAmeritrade Long Term Portfolio', 4000);
userGraph.add_node(longterm_investment);
userGraph.add_new_edge_to_graph(user.id, longterm_investment.id, 400, 'Monthly Contribution');


let real_estate_investment = new Investment('MMAD Holdings Real Estate', 13000);
userGraph.add_node(real_estate_investment);
userGraph.add_new_edge_to_graph(user.id, real_estate_investment.id, 500, 'contributions');

let crypto_portfolio = new Investment('Crypto Holdings', 4000);
userGraph.add_node(crypto_portfolio);
userGraph.add_new_edge_to_graph(user.id, crypto_portfolio.id, 333.33, 'contribution');

// Savings
let emergency_savings = new Investment('Emergency Savings', 3500);
userGraph.add_node(emergency_savings);
userGraph.add_new_edge_to_graph(user.id, emergency_savings.id, 333.33, 'contributions');

let vacation_savings = new Investment('Vacation Savings', 3500);
userGraph.add_node(vacation_savings);
userGraph.add_new_edge_to_graph(user.id, vacation_savings.id, 500, 'contribution');

// Expenses
let bmw_expense = new Expense('BMW i3');
userGraph.add_node(bmw_expense);
userGraph.add_new_edge_to_graph(user.id, bmw_expense.id, 450, 'Loan Payment');
userGraph.add_new_edge_to_graph(user.id, bmw_expense.id, 300, 'Insurance');
userGraph.add_new_edge_to_graph(user.id, bmw_expense.id, 150, 'Garage Cost');

let apartment = new Expense('Stan Chaban - 2295 California Street');
userGraph.add_node(apartment);
userGraph.add_new_edge_to_graph(user.id, apartment.id, 1750, 'Rent');

let fixed_expenses = new Expense('Fixed Expenses');
userGraph.add_node(fixed_expenses);
userGraph.add_new_edge_to_graph(user.id, fixed_expenses.id, 60, 'Comcast');
userGraph.add_new_edge_to_graph(user.id, fixed_expenses.id, 156.08, 't-mobile');
userGraph.add_new_edge_to_graph(user.id, fixed_expenses.id, 199, 'Equinox');
userGraph.add_new_edge_to_graph(user.id, fixed_expenses.id, 129.65, 'Subscriptions');



export default userGraph;