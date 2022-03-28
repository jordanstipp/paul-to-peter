import math
from collections import defaultdict

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

    class CashFlowNode:
        """Base class that represents a node (i.e. person, account, entity.)"""
        def __init__(self, account_name, graph, start_amount=0):
            self.name = account_name
            self.history = []   # Feature not implemented
            self.parent_graph = graph
            self.start_amount = start_amount

        def get_income(self):
            return self.parent_graph.sum_inflows(self.name)

        def get_expenses(self):
            return self.parent_graph.sum_outflows(self.name)

        def get_differential(self):
            return self.get_income() - self.get_expenses()

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

    def sum_inflows(self, target_name):
        if target_name not in self.edges_target_index:
            return self.nodes[target_name].start_amount
        incoming_cashflows = self.edges_target_index[target_name]
        return sum(edge.amount for edge in incoming_cashflows)

    def sum_outflows(self, source_name):
        if source_name not in self.edges_source_index:
            return 0
        outgoing_cashflows = self.edges_source_index[source_name]
        return sum(edge.amount for edge in outgoing_cashflows)
