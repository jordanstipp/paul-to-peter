import math
from collections import defaultdict

def _get_whitespaces(edges_name_str):
    whitespaces = []
    while edges_name_str:
        index = edges_name_str.find(' ')
        if index != -1:
            whitespaces.append(index)
            edges_name_str = edges_name_str[index:]
        else:
            break
    return whitespaces

def _compute_offsets(white_spaces):
    indices_of_edge_line = []
    for i, whitespace_index in enumerate(white_spaces):
        if i == 0:
            prev = 0
        else:
            prev = white_spaces[i-1]
        indices_of_edge_line.append(math.floor((whitespace_index - white_spaces[prev])/2))
    return indices_of_edge_line


class PeToPi:
    def __init__(self):
        self.edges_source_index = defaultdict(list)
        self.edges_target_index = defaultdict(list)
        self.nodes = {}

    class CashFlowEdge:
        """Represents a cashflow from one node to another."""
        def __init__(self, source_name, target_name, amount):
            self.source = source_name
            self.target = target_name
            self.amount = amount
        def __str__(self):
            return self.name \
                    + 'Source: ' + self.source \
                    + 'Target: ' + self.target \
                    + 'Amount: ' + str(self.amount)
    class CashFlowNode:
        """Base class that represents a node (i.e. person, account, entity.)"""
        def __init__(self, account_name, graph, start_amount=0):
            self.name = account_name
            self.history = []   # Feature not implemented
            self.parent_graph = graph
            self.start_amount = start_amount


        def get_income(self):
            incoming_cashflows = self.parent_graph.get_inflows(self.name)
            if not incoming_cashflows:
                return self.start_amount
            return sum(edge.amount for edge in incoming_cashflows)

        def get_expenses(self):
            outgoing_cashflows = self.parent_graph.get_outflows(self.name)
            return sum(edge.amount for edge in outgoing_cashflows)

        def get_differential(self):
            return self.get_income() - self.get_expenses()

        def _print_edges(self, edges, inflow_bool, edge_height = 3):
            edges_visualized_str = ''
            edges_name_str = ' '.join([edge.source if inflow_bool else edge.target for edge in edges])
            whitespaces = _get_whitespaces(edges_name_str)
            whitespaces.extend([0, len(edges_name_str)-1])
            index_of_edge_in_str = _compute_offsets(whitespaces)
            edge_arrow_str = ''
            for _ in range(edge_height):
                for i, edge_index in enumerate(index_of_edge_in_str):
                    blanks = 0 if i == 0 else edge_index - index_of_edge_in_str[i-1]
                    edge_line = ' ' * blanks + '|'
                edge_arrow_str +=  edge_line + '\n'

            arrow_line = ' ' * len(edges_name_str)
            arrow_char = 'V' if inflow_bool else '\/'
            for i, edge_index in enumerate(index_of_edge_in_str):
                blanks = 0 if i == 0 else edge_index - index_of_edge_in_str[i-1]
                arrow_line = ' ' * blanks + arrow_char

            if inflow_bool:
                return edges_name_str + '\n' + edge_arrow_str + arrow_line
            return edge_arrow_str + arrow_line + '\n' + edges_name_str

        def __str__(self):
            income = self.get_income()
            expenses = self.get_expenses()
            diff = income - expenses
            return self._print_edges(self.parent_graph.get_outflows(self.name), inflow_bool=True) \
                    + '/'* 10 + '\n' \
                    + self.name \
                    + ' Income: ' + str(income) \
                    + ' Expenses: ' + str(expenses) \
                    + ' Differential: ' + str(diff) + '\n'\
                    + '/'* 10 + '\n' \
                    + self._print_edges(self.parent_graph.get_outflows(self.name), inflow_bool=False)


    def create_node(self, name, start_amount=0):
        """Adds a new participant to the cash flow graph."""
        new_node = self.CashFlowNode(name, self, start_amount)
        self.nodes[name] = new_node
        return new_node

    def create_edge(self, source_name, target_name, amount):
        """Adds a new cashflow edge to the graph."""
        if not self._enforce_node(source_name, amount):
            print(source_name + ' cannot afford new expense of ' + str(amount))
            return False
        new_edge = self.CashFlowEdge(source_name, target_name, amount)
        self.edges_source_index[source_name].append(new_edge)
        self.edges_target_index[target_name].append(new_edge)
        return True

    # Consider raising Exceptions instead of returning Boolean values
    def _enforce_node(self, source_name, amount):
        """enforces that a new edges don't overdraw the balance."""
        if source_name not in self.nodes:
            raise AssertionError(source_name + ' does not exists in graph.')
        source_node = self.nodes[source_name]
        diff = source_node.get_differential()
        return True if \
            diff - amount >= 0 else False

    def get_node(self, node_name):
        if node_name not in self.nodes:
            raise AssertionError(source_name + ' does not exists in graph.')
        return self.nodes[node_name]


    # Prefer to retrieve cashflow values through the graph instead of Node only.

    def get_inflows(self, node_name)->list:
        if node_name not in self.edges_target_index:
            return []
        return self.edges_target_index[node_name]

    def get_outflows(self, node_name):
        if node_name not in self.edges_source_index:
            return []
        return self.edges_source_index[node_name]
