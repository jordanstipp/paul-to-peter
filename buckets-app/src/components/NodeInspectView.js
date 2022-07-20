import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Popup from 'reactjs-popup';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import globalGraph from '../cash_graph/main';


const InputEdgeForm = (props) => {
    const [newEdgeState, setNewEdgeState] = useState({
        targetNode: '',
        amount: '0'
    });
    const handleNewEdgeAmountChange = event => {
        setNewEdgeState({
            amount: event.target.value,
            targetNode: newEdgeState.targetNode
        });
      console.log('New Edge value is:', event.target.value);
    };

    const handleTargetNodeChange =  event => {
        setNewEdgeState({
            amount: newEdgeState.amount,
            targetNode: event.target.value
        });
      console.log('target is : ' + event.target.value);
    };

    function handleSubmit(event) {
        console.log('Submitting new edge ' + newEdgeState.targetNode + ' ' + newEdgeState.amount)
        if (props.incoming === true){
            props.newEdgeFunction(newEdgeState.targetNode, props.node.id, newEdgeState.amount)
        } else {
            props.newEdgeFunction(props.node.id, newEdgeState.targetNode, newEdgeState.amount)
        }
        setNewEdgeState({
          amount: '0',
          targetNode: ''
        });
        event.preventDefault();
    }

    return(
      <div>
          <h4>Add New</h4>
          <form onSubmit={handleSubmit}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={newEdgeState.targetNode}
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
            <TextField 
              variant="outlined"
              onChange={handleNewEdgeAmountChange}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={newEdgeState.amount}
            >
            </TextField>
            <Button variant="contained" type='submit'>Submit</Button>
          </form>
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

const BudgetList = (props) => {
  return (
    <div>
      <ul>
      {
        Object.keys(props.edges).map((key, index) => {
          let displayName = props.incoming ? props.edges[key].source_id : props.edges[key].dest_id
          return (
            <li key={index}>{displayName} - {props.edges[key].amount}</li>
          )
        })
      }
      </ul>
    </div>
  );
}

class BudgetView extends React.Component {
  constructor(props){
    super(props)

  }

  render() {
    return(
      <div className='budget-view-box'>
        <div className='budget-column'>
          <h3>Income</h3>
          <BudgetList edges={this.props.incoming_edges} incoming={true}/>
          <InputEdgeForm
            node={this.props.node}
            nodes={this.props.nodes}
            newEdgeFunction={this.props.newEdgeFunction}
            incoming={true}
          />
        </div>
        <div className='budget-column'>
          <h3>Expenses</h3>
          <BudgetList edges={this.props.outgoing_edges} incoming={false}/>
          <InputEdgeForm
            node={this.props.node}
            nodes={this.props.nodes}
            newEdgeFunction={this.props.newEdgeFunction}
            incoming={false}
          />
        </div>
      </div>
  )
  }
}


const TransactionList = (props) => {
  return (
    <div>
      <ul>
      {
        Object.keys(props.transactions).map((key, index) => {
          return (
            <li key={index}>{props.transactions[key]}</li>
          )
        })
      }
      </ul>
    </div>
  )
};


class NodeInspectView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let income = 0
    this.props.incoming_edges.forEach(edge => {
      income += parseInt(edge.amount);
    })

    let expenses = 0;
    this.props.outgoing_edges.forEach(edge => {
      expenses += parseInt(edge.amount);
    })
    return (
      <div>
        <h1>{this.props.node.name}</h1><br/>
        <BalanceView
            current_balance={this.props.node.current_balance}
            income={income}
            expenses={expenses}
        />
        <h2>Budget</h2>
        <BudgetView
            node={this.props.node}
            nodes={this.props.nodes}
            incoming_edges={this.props.incoming_edges}
            outgoing_edges={this.props.outgoing_edges}
            newEdgeFunction={this.props.newEdgeFunction}
        />
        <div>
          <h2>Recent Transactions</h2>
          {/* <TransactionList node={props.node.transactions}/>           */}
          <ul>
            <li>Mock Transaction for now</li>
          </ul>
        </div>
      </div>
    )
  }
};

export default NodeInspectView;
