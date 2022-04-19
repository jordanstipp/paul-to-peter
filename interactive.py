from PyInquirer import prompt
from cash_graph import CashGraph


_ACTION_PROMPT = ''
class ActionsCode:
    _NEW_NODE_ACTION = 'New Node'
    _NEW_EDGE_ACTION = 'New Edge'
    _PRINT_NODE = 'Explore Node'
    _QUIT_ACTION = 'Quit'

_ACTIONS_QUESTION = [
    {
        'type': 'list',
        'name': _ACTION_PROMPT,
        'message' : 'What you wanna do?',
        'choices' : [ActionsCode._NEW_NODE_ACTION,
                    ActionsCode._NEW_EDGE_ACTION,
                    ActionsCode._PRINT_NODE,
                    ActionsCode._QUIT_ACTION]
    }
]

_NEW_NODE_NAME = 'node_name'
_NEW_NODE_START_AMOUNT = 'start_amount'
_NEW_NODE_QUESTIONS = [
    {
        'type': 'input',
        'name': _NEW_NODE_NAME,
        'message': 'Name of this node'
    },
    {
        'type': 'input',
        'name': _NEW_NODE_START_AMOUNT,
        'message': 'Is there a starting amount here? Untraceable from another node.'
    }
]

_NEW_EDGE_SOURCE = 'source_name'
_NEW_EDGE_TARGET = 'target_name'
_NEW_EDGE_AMOUNT = 'amount'
_NEW_EDGE_QUESTIONS = [
    {
        'type': 'input',
        'name': _NEW_EDGE_SOURCE,
        'message': 'Who is paying the money?'
    },
    {
        'type': 'input',
        'name': _NEW_EDGE_TARGET,
        'message': 'Who is receiving the money?'
    },
    {
        'type': 'input',
        'name': _NEW_EDGE_AMOUNT,
        'message': 'How much is being sent?'
    }
]

_NODE_NAME = 'node_name'
_EXPLORE_NODE_QUESTIONS = [
    {
        'type': 'input',
        'name': _NODE_NAME,
        'message': 'Which node would you like to view?'
    }
]

def console_interact_with_graph(graph: CashGraph):
    """Terminal based interaction with a money graph."""
    while True:
        action_answers = prompt(_ACTIONS_QUESTION)
        action_chosen = action_answers.get(_ACTION_PROMPT)
        match action_chosen:
            case ActionsCode._NEW_NODE_ACTION:
                new_node_answers = prompt(_NEW_NODE_QUESTIONS)
                start_amount = 0 if new_node_answers.get(_NEW_NODE_START_AMOUNT) == '' \
                    else int(new_node_answers.get(_NEW_NODE_START_AMOUNT))
                new_node_obj = graph.create_node(
                    new_node_answers.get(_NEW_NODE_NAME),
                    start_amount)
                print(new_node_obj)
            case ActionsCode._NEW_EDGE_ACTION:
                new_edge_answers = prompt(_NEW_EDGE_QUESTIONS)
                edge_amount = 0 if new_node_answers.get(_NEW_NODE_START_AMOUNT) == '' \
                    else int(new_node_answers.get(_NEW_NODE_START_AMOUNT))
                try:
                    new_edge = graph.create_edge(
                        new_edge_answers.get(_NEW_EDGE_SOURCE),
                        new_edge_answers.get(_NEW_EDGE_TARGET),
                        edge_amount)
                    print(new_edge)
                except AssertionError as error:
                    print('Edge cannot be added')
                    print(error)
            case ActionsCode._PRINT_NODE:
                get_node_answers = prompt(_EXPLORE_NODE_QUESTIONS)
                node =  graph.get_node(
                    get_node_answers.get(_NODE_NAME)
                )
                print(node)

            case ActionsCode._QUIT_ACTION:
                break

def main():
    """Start anew with a fresh graph.

    Only supports terminal console based interactions at this point.
    """
    new_graph = CashGraph()
    console_interact_with_graph(new_graph)



if __name__ == "__main__":
    main()
