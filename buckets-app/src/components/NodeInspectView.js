import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Popup from 'reactjs-popup';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import globalGraph from '../cash_graph/main';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from 'react-redux';





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
            <li>Margin: ${props.income - props.expenses}</li>
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
    <li style={{width: "100%", maxHeight: "50%", borderBottom: "1px solid black"}}
      onMouseEnter={()=>setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}
    >
      <form style={{display:"flex", flexDirection:"row"}} onSubmit={handleSubmit}>
        <h4 style={{minWidth: "30%"}}>
          {props.name}
        </h4>
        <h5>{props.edge.desc}</h5>
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
            style={{maxWidth:"5%", backgroundColor: "grey"}}
            onClick={(e)=>{
              props.removeEdgeFromGraphFunction(props.edge.id);
              e.preventDefault();
            }}>x</Button> : <></>
        }
        
      </form>
    </li>

  )
};

const NestedBudgetListItem = (props) => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  }
  let total = 0;
  props.edge_list.map((edge) => {total += edge.amount});
  return (
    <List>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={props.displayName} />
        {open ?
          <ListItemText primary={"x"}/>
          :<ListItemButton>
              <ListItemText primary={
              "$" + total + " (" + props.edge_list.length + ")"}/>
              <ListItemButton size="small">+</ListItemButton>
          </ListItemButton>
          }
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component ="div" disablePadding>
          {
            props.edge_list.map((edge)=>{
              const sub_edge_name = edge.desc
              return (
                <EdgeEditableFormDisplay
                  key={edge.id}
                  name={''}
                  edge={edge}
                  updateEdgeAmountInGraph={props.updateEdgeAmountInGraph}
                  removeEdgeFromGraphFunction={props.removeEdgeFromGraphFunction}
                />
              );
            })
          }
        </List>
      </Collapse>
    </List>
  );
};

const budgetListStyle= {
  maxHeight: "60%",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  alignContent: "left",
};
const BudgetList = (props) => {
  const node_groups = props.edges.reduce((node_groups, item)=>{
    const grouping_property = props.incoming ? item.source_id : item.dest_id;
    const node_group = (node_groups[grouping_property] || []);
    node_group.push(item);
    node_groups[grouping_property] = node_group;
    return node_groups;
  }, {});
  console.log(node_groups);
  return (
    <List
      style={budgetListStyle}
      aria-labelledby="nested-list-subheader"
    >
    {
      Object.keys(node_groups).map((key, index) => {

        let displayName = key;
        const edge_list = node_groups[key]
        console.log(edge_list);
        
        return (edge_list.length > 1 ?
          <NestedBudgetListItem
            incoming={props.incoming}
            edge_list={edge_list}
            displayName={displayName}
            updateEdgeAmountInGraph={props.updateEdgeAmountInGraph}
            removeEdgeFromGraphFunction={props.removeEdgeFromGraphFunction}
          />:
          <ListItemButton>
            <EdgeEditableFormDisplay
              key={edge_list[0].id}
              name={displayName}
              edge={edge_list[0]}
              updateEdgeAmountInGraph={props.updateEdgeAmountInGraph}
              removeEdgeFromGraphFunction={props.removeEdgeFromGraphFunction}
            />
          </ListItemButton>
        
        )
    
      })
    }
    </List>
  );
}

const BudgetViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  height: "100%"
}

const BudgetViewColumnStyle = {
  height: "100%",
  width: "48%",
  marginRight: "1%"
}
class BudgetView extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return(
      <div style={BudgetViewStyle}>
        <div style={BudgetViewColumnStyle}>
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
        <div style={BudgetViewColumnStyle}>
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

const fullInfoStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column"
};
const FullInfoView = (props) => {
  return (
    <div style={fullInfoStyle}>
      <div style={{maxHeight: "30%", marginBottom:"0", paddingBottom: 0}}>
        <h1>{props.focusNode_redux.name}</h1>
        <BalanceView
            current_balance={props.focusNode_redux.current_balance}
            income={props.income}
            expenses={props.expenses}
        />
      </div>
      <div style={{maxHeight: "50%"}}>
        <h2>Budget</h2>
        <BudgetView
          node={props.focusNode_redux}
          nodes={props.nodes}
          incoming_edges={props.incoming_edges}
          outgoing_edges={props.outgoing_edges}
          newEdgeFunction={props.newEdgeFunction}
          updateEdgeAmountInGraph={props.updateEdgeAmountInGraph}
          removeEdgeFromGraphFunction={props.removeEdgeFromGraphFunction}
        />
      </div>
      
      <div style={{maxHeight: "20%"}}>
        <h2>Recent Transactions</h2>
        {/* <TransactionList node={props.node.transactions}/>           */}
        <ul>
          <li>Mock Transaction for now</li>
        </ul>
      </div>
    </div>
    
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

const NodeInspectView = (props) => {
    const focusNode_redux = useSelector((state)=>state.graph.focusNode)
    // TODO(mjones): fetch from Redux
    const incoming_edges = []
    const outgoing_edges = []
    let income = 0 // calculate_income(focusNode_redux.incoming_edges)
    let expenses = 0 // calculate_expenses(focusNode_redux.outgoing_edges)

    return (
      <div style={inspectComponentStyle}>
        {props.displayFullInfo === true ? 
          <FullInfoView
            focusNode_redux={focusNode_redux}
            nodes={props.nodes}
            incoming_edges={incoming_edges}
            outgoing_edges={outgoing_edges}
            newEdgeFunction={props.newEdgeFunction}
            updateEdgeAmountInGraph={props.updateEdgeAmountInGraph}
            removeEdgeFromGraphFunction={props.removeEdgeFromGraphFunction}
            income={income}
            expenses={expenses}
          /> :
          <QuickInfoView 
          node={focusNode_redux}
          income={income}
          expenses={expenses}
          />}
      </div>
    )
};

export default NodeInspectView;

