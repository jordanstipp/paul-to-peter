from collections import defaultdict
from node import CashFlowNode
from edge import CashFlowEdge

class CashGraph:
    def __init__(self):
        self.edges_source_index = defaultdict(list)
        self.edges_target_index = defaultdict(list)
        self.nodes = {}

    def create_node(self, name, start_amount=0):
        """Adds a new participant to the cash flow graph."""
        new_node = CashFlowNode(name, self, start_amount)
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
        new_edge = CashFlowEdge(source_name, target_name, amount)
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
            raise AssertionError(node_name + ' does not exists in graph.')
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