from cashflow_node import PeToPi
from collections import namedtuple
from interactive import console_interact_with_graph

_MONTHS_IN_YEAR = 12
cached_account = namedtuple('cached_account', 'name monthly_amount')

class Profile():

    def __init__(self, name):
        """Creates a the graph object to represent a person."""
        self.graph = PeToPi()
        self.me = name
        self.setupProfile()

    def setupProfile(self):
        """Stable starter data for a personal profile."""
        self.graph.create_node(name=self.me, start_amount=0)
        # Employment Income
        employer_name = 'Nuro'
        salary = 150000
        self.graph.create_node(name=employer_name, start_amount=1000000)
        self.graph.create_edge(employer_name, self.me, amount=salary)
        # Investments
        investing = [
            cached_account('Vanguard Retirement', 500),
            cached_account('Speculative - Stock Market', 200),
            cached_account('Crypto Holdings', 600),
            cached_account('MMAD Holdings', 700)
        ]
        self.add_grouping_to_graph(investing)
        # Savings
        savings = [
            cached_account('Emergency Savings', 600),
            cached_account('Motorcyle', 200)
        ]
        self.add_grouping_to_graph(savings)
        # Expenses
        expenses = [
            cached_account('Subscriptions', 200),
            cached_account('Constant Bills', 200)
        ]
        self.add_grouping_to_graph(expenses)


    def add_grouping_to_graph(self, edge_groupings):
        """Creates the nodes and edges in graph from the cached results."""
        for edge_group in edge_groupings:
            self.graph.create_node(name=edge_group.name)
            self.graph.create_edge(
                self.me, edge_group.name, amount=edge_group.monthly_amount * _MONTHS_IN_YEAR)





def main():
    me = Profile(name = 'Mekhi')
    console_interact_with_graph(me.graph)


if __name__ == '__main__':
    main()
