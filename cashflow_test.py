from cashflow_node import PeToPi
import unittest

_PERSON_NODE_NAME = 'unittest_person'
_EXPENSES_NODE_NAME = 'unittest_expenses'
_INCOME_NODE_NAME = 'unittest_income'
_INCOME_AMOUNT = 100
_EXPENSE_AMOUNT = 50
_DIFFERENTIAL_AMOUNT= _INCOME_AMOUNT- _EXPENSE_AMOUNT

class TestSum(unittest.TestCase):

    def setUp(self):
        self.graph = PeToPi()

    def test_graph_creation(self):
        self.assertFalse(self.graph.edges_source_index)
        self.assertFalse(self.graph.edges_target_index)
        self.assertFalse(self.graph.nodes)

    def test_add_node(self):
        new_node = self.graph.create_node(_PERSON_NODE_NAME)
        self.assertEqual(_PERSON_NODE_NAME, new_node.name)

    def test_add_node_with_start_amount(self):
        income_node = self.graph.create_node(_INCOME_NODE_NAME, start_amount=_INCOME_AMOUNT)
        self.assertEqual(_INCOME_AMOUNT, income_node.get_income())

    def test_add_edge_non_existing_nodes(self):
        try:
            self.graph.create_edge(
                _PERSON_NODE_NAME, _EXPENSES_NODE_NAME, _EXPENSE_AMOUNT)
        except:
            pass
        else:
            self.fail('No exception was raised.')

    def test_add_edge_success(self):
        person_node = self.graph.create_node(_PERSON_NODE_NAME)
        income_node = self.graph.create_node(_INCOME_NODE_NAME, start_amount=_INCOME_AMOUNT)
        self.assertTrue(self.graph.create_edge(
            _INCOME_NODE_NAME, _PERSON_NODE_NAME, _INCOME_AMOUNT))
        self.assertEqual(_INCOME_AMOUNT,
            person_node.get_income())
        self.assertEqual(_INCOME_AMOUNT, income_node.get_expenses())
        self.assertEqual(0, income_node.get_differential())

    def test_print_edge(self):
        """assert Visually"""
        person_node = self.graph.create_node(_PERSON_NODE_NAME)
        income_node = self.graph.create_node(_INCOME_NODE_NAME, start_amount=_INCOME_AMOUNT)
        income2_node = self.graph.create_node('another one', start_amount=_INCOME_AMOUNT)
        self.graph.create_edge(
            _INCOME_NODE_NAME, _PERSON_NODE_NAME, _INCOME_AMOUNT)
        self.graph.create_edge(
            'another one', _PERSON_NODE_NAME, _INCOME_AMOUNT)
        edges = self.graph.get_inflows(_PERSON_NODE_NAME)
        print(person_node._print_edges(edges, inflow_bool=False))

if __name__ == '__main__':
    unittest.main()
