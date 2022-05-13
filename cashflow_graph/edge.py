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