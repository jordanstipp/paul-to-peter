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
  console.log(nodes);
  let graph_nodes = []
  nodes.forEach(node=> {
    graph_nodes.push({
      'id': node.id,
      'group': 1
    })
  })
  console.log(graph_nodes);
  return graph_nodes;
}

function get_displayable_edges(edges){
  console.log(edges);
  let graph_edges = []
  edges.forEach(edge=> {
    graph_edges.push({
      source: edge.source_id,
      target: edge.dest_id,
      value: edge.amount
    })
  })
  console.log(graph_edges);
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
    console.log(data);
  }, []);

  function get_graph() {
    let nodes = globalGraph.get_nodes();
    let mydata = { 
      "nodes": get_displayable_nodes(nodes),
      "links": get_displayable_edges(globalGraph.get_edges())
    };
    setFocusNode(nodes[0]);
    console.log(nodes[0]);
    return mydata;
  }

  function handleClick(node) {
    // When Nodes are clicked set the focus node to the chose.
    console.log(node);
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
      <div className="graph-side workbench">
        <Graph />
      </div>
    </div>
    <div className="inspect-area">
      <h1>Inspection Area</h1>
      <div className='interactive-inspection'>
        <h2>Interactive</h2>
      </div>
      <div className='display-inspection'>
        <h2>Informational</h2>
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
