import logo from './logo.svg';
import './App.css';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import React, { useState, useEffect } from 'react';
import globalGraph from './cash_graph/main.js';

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

function get_graph() {
  let mydata = { 
    "nodes": get_displayable_nodes(globalGraph.get_nodes()),
    "links": get_displayable_edges(globalGraph.get_edges())
  }
  return mydata;
}


function App() {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    var dataset = get_graph();
    setData(dataset);
    setLoading(false);
  }, []);

  function handleClick(node) {
    console.log(node);
  };

  if (isLoading) {
    return <div className="App">Loading..</div>
  }
  return (
    <>
      <ForceGraph2D
        graphData= {data}
        onNodeClick={handleClick}
      /> 
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
  // return fetch(test_dataset).then(res => res.json())
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

var data_1 = {
  "nodes": [
      {id: "Myriel", group: 1},
      {id: "Napoleon", group: 1},
  ],
  "links": [
    {source: "Napoleon", target: "Myriel", value: 1},

  ]
}

*/
