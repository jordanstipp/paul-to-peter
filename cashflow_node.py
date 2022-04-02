import math
from collections import defaultdict

def _get_whitespaces(edges_name_str):
    whitespaces = []
    while len(edges_name_str) > 0:
        index = edges_name_str.find(' ')
        if index not in [-1, 0]:
            whitespaces.append(index)
            edges_name_str = edges_name_str[index:]
        else:
            break
    return whitespaces

def _compute_offsets(white_spaces):
    indices_of_edge_line = []
    for i, whitespace_index in enumerate(white_spaces):
        if i == 0:
            continue
        prev = white_spaces[i-1]

        index = math.floor((whitespace_index - prev)/2) + prev
        indices_of_edge_line.append(index)
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
                return int(self.start_amount)
            return sum(edge.amount for edge in incoming_cashflows)

        def get_expenses(self):
            outgoing_cashflows = self.parent_graph.get_outflows(self.name)
            return sum(edge.amount for edge in outgoing_cashflows)

        def get_differential(self):
            return  self.get_income() - self.get_expenses()

        def _print_edges(self, edges, inflow_bool, edge_height = 3):
            edges_visualized_str = ''
            edges_name_str = ' '.join([edge.source if inflow_bool else edge.target for edge in edges])
            whitespaces = _get_whitespaces(edges_name_str)
            whitespaces.extend([0, len(edges_name_str)-1])
            whitespaces.sort()
            index_of_edge_in_str = _compute_offsets(whitespaces)

            def _aligned_line(indices_of_char, char='|', amounts=None):
                """Prints the char at indices with whitespace in between."""
                line = ''
                for i, char_index in enumerate(indices_of_char):
                    char_to_place = char
                    if amounts:
                        char_to_place = str(amounts[i])
                    blanks = char_index-1
                    blanks -= 0 if i == 0 else indices_of_char[i-1] + math.floor(len(char_to_place)/2) - 1

                    line += ' ' * blanks + char_to_place
                return line

            edge_arrow_str = ''
            for _ in range(edge_height):
                edge_line = _aligned_line(index_of_edge_in_str, '|')
                edge_arrow_str +=  edge_line + '\n'

            amount_line = _aligned_line(index_of_edge_in_str, amounts=[edge.amount for edge in edges])
            edge_arrow_str += amount_line + '\n'

            arrow_char = 'V'
            arrow_line_str = _aligned_line(index_of_edge_in_str, arrow_char)
            if inflow_bool:
                return edges_name_str + '\n' + edge_arrow_str + arrow_line_str
            return edge_arrow_str + arrow_line_str + '\n' + edges_name_str

        def __str__(self):
            income = self.get_income()
            expenses = self.get_expenses()
            diff = income - expenses
            inflows = self.parent_graph.get_inflows(self.name)
            inflows_str = self._print_edges(inflows, inflow_bool=True) if inflows else ''
            outflows = self.parent_graph.get_outflows(self.name)
            outflows_str = self._print_edges(outflows, inflow_bool=False) if outflows else ''

            node_summary_view = self.name + '| ' \
            + ' Income: ' + str(income) \
            + ' Expenses: ' + str(expenses) \
            + ' Differential: ' + str(diff)

            width = max(len(inflows_str), len(outflows_str), len(node_summary_view))
            return  inflows_str + '\n' \
                    + '.'* width + '\n' \
                    + node_summary_view + '\n' \
                    + '.'* width + '\n' \
                    + outflows_str



    def create_node(self, name, start_amount=0):
        """Adds a new participant to the cash flow graph."""
        new_node = self.CashFlowNode(name, self, start_amount)
        self.nodes[name] = new_node
        return new_node

    def create_edge(self, source_name, target_name, amount):
        """Adds a new cashflow edge to the graph."""

        if source_name not in self.nodes:
            print('Node ' + source_name + ' not in graph -  will create')
            self.create_node(source_name, start_amount=amount)
        elif target_name not in self.nodes:
            print('Node ' + target_name + ' not in graph - will create.')
            self.create_node(target_name)
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
