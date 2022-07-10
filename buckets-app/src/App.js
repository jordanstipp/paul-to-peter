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
    let income = 500;
    let outgoing_edges  = globalGraph.get_outgoing_edges(focusNode);
    let expenses = 200;

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
    return (
      <div>
        <h1>{focusNode.name}</h1><br/>
        <h4><i>Accounts Attached : 1</i></h4>
        <ul>
          <li>Balance: {focusNode.current_balance}</li>
          <li>Income: {income}</li>
          <li>Expenses: {expenses}</li>
        </ul>
        <h2>Budget</h2>
        <div className='budget-view-box'>
          <div className='budget-column'>
            <h3>Income</h3>
            <ul>
            <BudgetItem edges={incoming_edges}/>
            </ul>
          </div>
          <div className='budget-column'>
            <h3>Expenses</h3>
            <ul>
            <ul>
              <BudgetItem edges={outgoing_edges}/>
            </ul>
            </ul>
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
