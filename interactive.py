from PyInquirer import prompt
from cashflow_node import PeToPi


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

def main():
    money_graph = PeToPi()
    while True:
        action_answers = prompt(_ACTIONS_QUESTION)
        action_chosen = action_answers.get(_ACTION_PROMPT)
        match action_chosen:
            case ActionsCode._NEW_NODE_ACTION:
                new_node_answers = prompt(_NEW_NODE_QUESTIONS)
                new_node_obj = money_graph.create_node(
                    new_node_answers.get(_NEW_NODE_NAME),
                    new_node_answers.get(_NEW_NODE_START_AMOUNT))
                print(new_node_obj)
            case ActionsCode._NEW_EDGE_ACTION:
                new_edge_answers = prompt(_NEW_EDGE_QUESTIONS)
                try:
                    new_edge = money_graph.create_edge(
                        new_edge_answers.get(_NEW_EDGE_SOURCE),
                        new_edge_answers.get(_NEW_EDGE_TARGET),
                        new_edge_answers.get(_NEW_EDGE_AMOUNT)
                    )
                    print(new_edge)
                except AssertionError as error:
                    print('Edge cannot be added')
                    print(error)
            case ActionsCode._QUIT_ACTION:
                break


if __name__ == "__main__":
    main()
