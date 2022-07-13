import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Popup from 'reactjs-popup';
import Button from '@mui/material/Button';
import { useState } from 'react';




const InputEdgeForm = (props) => {
    console.log(props.nodes);
    const [newEdgeState, setNewEdgeState] = useState({
        targetNode: null,
        amount: '0'
    });
    const handleNewEdgeAmountChange = event => {
        setNewEdgeState({
            amount: event.target.value
        });
      console.log('value is:', event.target.value);
    };

    const handleTargetNodeChange =  event => {
        setNewEdgeState({
            targetNode: event.target.value
        });
      console.log('target is : ' + event.target.value);
    };

    function handleSubmit() {
        if (props.incoming === true){
            this.props.newEdgeFunction(newEdgeState.targetNode, props.thisNode, newEdgeState.amount)
        } else {
            this.props.newEdgeFunction(props.thisNode, newEdgeState.targetNode, newEdgeState.amount)
        }
    }

    return(
      <div>
        <h4>New Edge</h4>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.nodes[0].id}
          label="Income Edge"
          onChange={handleTargetNodeChange}
        >
          {
            Object.keys(props.nodes).map((key, i) => {
              const val = props.nodes[key].id
              return (
                <MenuItem key={val} value={val}>{val}</MenuItem>
              )
            })
          }
        </Select>
        <TextField variant="outlined" onChange={handleNewEdgeAmountChange}>
          Amount
        </TextField>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </div>
    )
}

const BalanceView = (props) => {
    return (
        <>
            <h4><i>Accounts Attached : 1</i></h4>
            <ul>
            <li>Balance: ${props.current_balance}</li>
            <li>Income: ${props.income}</li>
            <li>Expenses: ${props.expenses}</li>
            </ul>
        </>
    )
}

const BudgetView = (props) => {
    const BudgetList = (props) => {
        return (
          <div>
            <ul>
            {
              Object.keys(props.edges).map((key, index) => {
                let displayName = props.edges[key].sourceId ? props.incoming : props.edges[key].dest_id
                return (
                  <li key={index}>{displayName} - {props.edges[key].amount}</li>
                )
              })
            }
            </ul>
          </div>
        );
    }
    
    return(
        <div className='budget-view-box'>
          <div className='budget-column'>
            <h3>Income</h3>
            <BudgetList edges={props.incoming_edges} incoming={true}/>
            <Popup trigger={<button> Add edge</button>} position="right center">
              <InputEdgeForm nodes={props.nodes}/>
            </Popup>
          </div>
          <div className='budget-column'>
            <h3>Expenses</h3>
            <BudgetList edges={props.outgoing_edges}/>
            <Popup trigger={<button> Add edge</button>} position="right center">
              <InputEdgeForm
                nodes={props.nodes}
                newEdgeFunction={props.newEdgeFunction}
              />
            </Popup>
          </div>
        </div>
    )
}


const NodeInspectView = (props) => {
    let income = 0
    props.incoming_edges.forEach(edge => {
      income += edge.amount;
    })

    let expenses = 0;
    props.outgoing_edges.forEach(edge => {
      expenses += edge.amount;
    })

    return (
      <div>
        <h1>{props.node.name}</h1><br/>
        <BalanceView
            current_balance={props.node.current_balance}
            income={income}
            expenses={expenses}
        />
        <h2>Budget</h2>
        <BudgetView
            nodes={props.nodes}
            incoming_edges={props.incoming_edges}
            outgoing_edges={props.outgoing_edges}
            newEdgeFunction={props.newEdgeFunction}
        />
        <div>
          <h2>Recent Transactions</h2>
          <ul>
            <li>Mock Transaction for now</li>
            <li>Mock Transaction for now</li>
            <li>Mock Transaction for now</li>
            <li>Mock Transaction for now</li>
          </ul>
        </div>
      </div>
    )
  }

export default NodeInspectView;
