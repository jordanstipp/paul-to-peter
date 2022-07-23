import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Popup from 'reactjs-popup';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import globalGraph from '../cash_graph/main';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

const formStyle = {
  display: "flex",
  flexDirection: "row",
};

const InputEdgeForm = (props) => {
    const [newEdgeState, setNewEdgeState] = useState({
        targetNode: '',
        amount: '0'
    });
    const [newEdgeBool, setNewEdgeBool] = useState(false);
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
        setNewEdgeBool(false);
        event.preventDefault();
    }

    if (newEdgeBool){
      return(
        <div style={formStyle}>
            <form onSubmit={handleSubmit}>
              <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={newEdgeState.targetNode}
                  label="Income Edge"
                  onChange={handleTargetNodeChange}
                  style={{minWidth: "40%"}}
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
                style={{maxWidth: "20%"}}
              >
              </TextField>
              <Button variant="contained" type='submit' size="small">+</Button>
              <Button variant="outlined" onClick={()=>{setNewEdgeBool(false)}} size="small">Cancel</Button>
            </form>
        </div>
      )
    } else {
      return (
        <div style={{maxHeight: "10%"}}>
          <Button variant="outlined" onClick={()=>{setNewEdgeBool(true)}} size="small">Add new Edge</Button>
        </div>
        
      )
    }

    
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

const EdgeEditableFormDisplay = (props) => {
  const [edgeAmount, setEdgeAmount] = useState(props.edge.amount)
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = event => {
    props.updateEdgeAmountInGraph(props.edge.id, edgeAmount);
    event.preventDefault();
  };
  return(
    <li style={{width: "100%", maxHeight: "50%"}}
      onMouseEnter={()=>setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}
    >
      <form style={{display:"flex", flexDirection:"row"}} onSubmit={handleSubmit}>
        <h4 style={{minWidth: "30%"}}>
          {props.name}
        </h4>
        <TextField 
                  variant="outlined"
                  onChange={(e)=>{setEdgeAmount(e.target.value)}}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  value={edgeAmount}
                  style={{minWidth: "30%", minHeight: "50%"}}
        ></TextField>
        {edgeAmount === props.edge.amount ?
          <></> :
          <Button variant="contained" type='submit' size="small"
            style={{maxWidth:"10%", backgroundColor: "green"}}>✓</Button>
        }
        {isHovered ?
          <Button variant="contained" type='submit' size="small"
            style={{maxWidth:"10%", backgroundColor: "grey"}}
            onClick={(e)=>{
              props.removeEdgeFromGraphFunction(props.edge.id);
              e.preventDefault();
            }}>x</Button> : <></>
        }
        
      </form>
    </li>

  )
};


const BudgetList = (props) => {
  return (
    <div>
      <ul>
      {
        Object.keys(props.edges).map((key, index) => {
          let displayName = props.incoming ? props.edges[key].source_id : props.edges[key].dest_id
          return (
            <EdgeEditableFormDisplay
              key={props.edges[key].id}
              name={displayName}
              edge={props.edges[key]}
              updateEdgeAmountInGraph={props.updateEdgeAmountInGraph}
              removeEdgeFromGraphFunction={props.removeEdgeFromGraphFunction}
            />
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
          <BudgetList
            edges={this.props.incoming_edges}
            updateEdgeAmountInGraph={this.props.updateEdgeAmountInGraph}
            removeEdgeFromGraphFunction={this.props.removeEdgeFromGraphFunction}
            incoming={true}/>
          <InputEdgeForm
            node={this.props.node}
            nodes={this.props.nodes}
            newEdgeFunction={this.props.newEdgeFunction}
            incoming={true}
          />
        </div>
        <div className='budget-column'>
          <h3>Expenses</h3>
          <BudgetList
            edges={this.props.outgoing_edges}
            updateEdgeAmountInGraph={this.props.updateEdgeAmountInGraph}
            removeEdgeFromGraphFunction={this.props.removeEdgeFromGraphFunction}
            incoming={false}/>
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

const QuickInfoView = (props) => {
  return (
    <>
      <h1>{props.node.name}</h1><br/>
      <BalanceView
          current_balance={props.node.current_balance}
          income={props.income}
          expenses={props.expenses}
      />
    </>
  );
};

const FullInfoView = (props) => {
  
  return (
    <>
      <h1>{props.node.name}</h1><br/>
      <BalanceView
          current_balance={props.node.current_balance}
          income={props.income}
          expenses={props.expenses}
      />
      <h2>Budget</h2>
      <BudgetView
          node={props.node}
          nodes={props.nodes}
          incoming_edges={props.incoming_edges}
          outgoing_edges={props.outgoing_edges}
          newEdgeFunction={props.newEdgeFunction}
          updateEdgeAmountInGraph={props.updateEdgeAmountInGraph}
          removeEdgeFromGraphFunction={props.removeEdgeFromGraphFunction}
      />
      <div>
        <h2>Recent Transactions</h2>
        {/* <TransactionList node={props.node.transactions}/>           */}
        <ul>
          <li>Mock Transaction for now</li>
        </ul>
      </div>
    </>
    
  );
};

function calculate_income(incoming_edges) {
  let income = 0
  incoming_edges.forEach(edge => {
    income += parseInt(edge.amount);
  })
  return income
};

function calculate_expenses(outgoing_edges) {
  let expenses = 0;
  outgoing_edges.forEach(edge => {
    expenses += parseInt(edge.amount);
  })
  return expenses;
};

const inspectComponentStyle = {
  height: "100%",
  marginTop: 0,
  border: "1px solid black"
}

class NodeInspectView extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.data)
    this.state = {
      versionGraph: this.props.data
    };
  }

  render() {
    console.log(this.props.incoming_edges)
    let income = calculate_income(this.props.incoming_edges)
    let expenses = calculate_expenses(this.props.outgoing_edges)

    return (
      <div style={inspectComponentStyle}>
        {this.props.displayFullInfo === true ? 
          <FullInfoView
            versionGraph={this.state.versionGraph}
            node={this.props.node}
            nodes={this.props.nodes}
            incoming_edges={this.props.incoming_edges}
            outgoing_edges={this.props.outgoing_edges}
            newEdgeFunction={this.props.newEdgeFunction}
            updateEdgeAmountInGraph={this.props.updateEdgeAmountInGraph}
            removeEdgeFromGraphFunction={this.props.removeEdgeFromGraphFunction}
            income={income}
            expenses={expenses}
          /> :
          <QuickInfoView 
          node={this.props.node}
          income={income}
          expenses={expenses}
          />}
      </div>
    )
  }
};

export default NodeInspectView;

