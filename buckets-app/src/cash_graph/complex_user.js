import {Graph, User, IncomeSource, Investment, Edge, Expense} from './main.js';

let userGraph = new Graph('Complex User');

let user = new User('You', 2200);
userGraph.add_node(user);

// Income 
let employer = new IncomeSource('Employer', user.id, 5000);
userGraph.add_node(employer);
userGraph.add_new_edge_to_graph(employer.id, user.id, 6000, 'Monthly Contribution');


// Investments
let retirement = new Investment('401k', 18000);
userGraph.add_node(retirement);
userGraph.add_new_edge_to_graph(user.id, retirement.id, 300, 'Monthly Contribution');

let speculative_investment = new Investment('Speculative Investments', 2000);
userGraph.add_node(speculative_investment);
userGraph.add_new_edge_to_graph(user.id, speculative_investment.id, 200, 'Monthly Contribution');


let longterm_investment = new Investment('Long Term Portfolio', 4000);
userGraph.add_node(longterm_investment);
userGraph.add_new_edge_to_graph(user.id, longterm_investment.id, 400, 'Monthly Contribution');


let real_estate_investment = new Investment('Real Estate', 13000);
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
let bmw_expense = new Expense('Car');
userGraph.add_node(bmw_expense);
userGraph.add_new_edge_to_graph(user.id, bmw_expense.id, 450, 'Loan Payment');
userGraph.add_new_edge_to_graph(user.id, bmw_expense.id, 300, 'Insurance');
userGraph.add_new_edge_to_graph(user.id, bmw_expense.id, 150, 'Garage Cost');

let apartment = new Expense('Apartment Rent');
userGraph.add_node(apartment);
userGraph.add_new_edge_to_graph(user.id, apartment.id, 1750, 'Rent');

let fixed_expenses = new Expense('Fixed Expenses');
userGraph.add_node(fixed_expenses);
userGraph.add_new_edge_to_graph(user.id, fixed_expenses.id, 60, 'Comcast');
userGraph.add_new_edge_to_graph(user.id, fixed_expenses.id, 110, 't-mobile');
userGraph.add_new_edge_to_graph(user.id, fixed_expenses.id, 50, 'Gym');
userGraph.add_new_edge_to_graph(user.id, fixed_expenses.id, 120, 'Subscriptions');



export default userGraph;