import logo from './logo.svg';
import './App.css';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import React, { useState, useEffect } from 'react';
import globalGraph from './cash_graph/main.js';
import Card from '@mui/material/Card';
import { CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Popup from 'reactjs-popup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';




function get_displayable_nodes(nodes){
  let graph_nodes = []
  nodes.forEach(node=> {
    graph_nodes.push({
      'id': node.id,
      'group': 1
    })
  })
  return graph_nodes;
}

function get_displayable_edges(edges){
  let graph_edges = []
  edges.forEach(edge=> {
    graph_edges.push({
      source: edge.source_id,
      target: edge.dest_id,
      value: edge.amount
    })
  })
  return graph_edges;
}

const { useRef } = React;

function App() {
  const [data, setData] = useState({});
  const [focusNode, setFocusNode] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    var dataset = get_graph();
    setData(dataset);
    setLoading(false);
  }, []);

  function get_graph() {
    let nodes = globalGraph.get_nodes();
    let mydata = { 
      "nodes": get_displayable_nodes(nodes),
      "links": get_displayable_edges(globalGraph.get_edges())
    };
    setFocusNode(nodes[0]);
    return mydata;
  }

  function handleClick(node) {
    // When Nodes are clicked set the focus node to the chose.
    let id = node.id;
    setFocusNode(globalGraph.get_node(id));
  };

  const NodeFocusForm = () => {
    return <>
      <Card variant="outlined" sx={{maxWidth: 400, maxHeight: 200, alignContent: "center"}}>
        <CardContent>
          <Typography variant="h9" gutterBottom>
            Type: {focusNode.type}
          </Typography>
          <Typography variant="h3">
            {focusNode.name}
          </Typography> 
          <Typography variant="h5">
            Current balance: ${focusNode.current_balance}
          </Typography>       
        </CardContent>
        <CardActions>
          <Button size="small">Inspect Node</Button>
      </CardActions>
      </Card>
    </>
  }

  {/* TODO(mjones): Toggle between node detail view and the graph */}
  const Graph = () => {
    const fgRef = useRef();
    return <ForceGraph2D
          graphData={data}
          ref={fgRef}
          onNodeClick={handleClick}
          onEngineStop={() => fgRef.current.zoomToFit(400)}
        /> 
  }

  const NodeDetail = () => {
    let incoming_edges = globalGraph.get_incoming_edges(focusNode);
    let income = 0
    incoming_edges.forEach(edge => {
      console.log(edge);
      income += edge.amount;
    })

    let outgoing_edges  = globalGraph.get_outgoing_edges(focusNode);
    let expenses = 0;
    outgoing_edges.forEach(edge => {
      console.log(edge);
      expenses += edge.amount;
    })

    const BudgetItem = (edges, incoming=false) => {
      edges = edges.edges
      return (
        <div>
          {
            Object.keys(edges).map((key, index) => {
              let displayName = edges[key].sourceId ? incoming : edges[key].dest_id
              return (
                <li key={index}>{displayName} - {edges[key].amount}</li>
              )
            })
          }
        </div>
      );
    }

    const InputEdgeForm = () => {
      console.log(data.nodes);
      const [amount, setAmount] = useState();
      const handleNewEdgeAmountChange = event => {
        setAmount(event.target.value);
        console.log('value is:', event.target.value);
      };

      const [targetNode, setTarget] = useState();
      const handleTargetNodeChange =  event => {
        setTarget(event.target.value);
        console.log('target is : ' + event.target.value);
      };

      function newEdge () {
        console.log(amount + ' being added to edge to ' + targetNode);
      };

      return(
        <div>
          <h4>New Edge</h4>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={data.nodes[0].id}
            label="Income Edge"
            onChange={handleTargetNodeChange}
          >
            {
              Object.keys(data.nodes).map((key, i) => {
                const val = data.nodes[key].id
                return (
                  <MenuItem key={val} value={val}>{val}</MenuItem>
                )
              })
            }
          </Select>
          <TextField variant="outlined" onChange={handleNewEdgeAmountChange}>
            Amount
          </TextField>
          <Button variant="contained" onClick={()=>newEdge()}>Submit</Button>
        </div>
    )}
    return (
      <div>
        <h1>{focusNode.name}</h1><br/>
        <h4><i>Accounts Attached : 1</i></h4>
        <ul>
          <li>Balance: ${focusNode.current_balance}</li>
          <li>Income: ${income}</li>
          <li>Expenses: ${expenses}</li>
        </ul>
        <h2>Budget</h2>
        <div className='budget-view-box'>
          <div className='budget-column'>
            <h3>Income</h3>
            <ul>
            <BudgetItem edges={incoming_edges}/>
            </ul>
            <ul>
              
            </ul>
            <Popup trigger={<button> Add edge</button>} position="right center">
              <InputEdgeForm />
            </Popup>
          </div>
          <div className='budget-column'>
            <h3>Expenses</h3>
            <ul>
              <BudgetItem edges={outgoing_edges}/>
            </ul>
            <Popup trigger={<button> Add edge</button>} position="right center">
              <InputEdgeForm />
            </Popup>
          </div>
        </div>
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

  if (isLoading) {
    return <div className="App">Loading..</div>
  }
  return (
    <>
    <h1>Welcome to your financial health</h1>
    <div className="dev-area">
      <div className="info-side workbench">
        <NodeFocusForm />
      </div>
      <div className="inspect-side workbench">
        {/* <Graph /> */}
        <NodeDetail node={focusNode}/>
      </div>
    </div>

    </>

  );
  
}

export default App;

/*
const test_dataset = '../../cashflow_graph/datasets/brokeboy.json'

function get_dataset(){
  return {
    "nodes": [{
			id: "Brokey",
			group: 1
		},
		{
			id: "Employer",
			group: 1
		},
    {
			id: "Another Boy",
			group: 1
		}
	],
	"links": [{
		source: "Employer",
		target: "Brokey",
		value: 200
	}]
  }
}

function genRandomTree(N = 300, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map(i => ({ id: i })),
      links: [...Array(N).keys()]
    .filter(id => id)
    .map(id => ({
      [reverse ? 'target' : 'source']: id,
      [reverse ? 'source' : 'target']: Math.round(Math.random() * (id-1))
    }))
  };
}

*/
