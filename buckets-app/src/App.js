import logo from './logo.svg';
import './App.css';
import { ForceGraph2D } from 'react-force-graph';
import React, { useState, useEffect } from 'react';


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

function App() {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    var dataset = get_dataset();
    console.log(dataset);
    setData(dataset);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <div className="App">Loading..</div>
  }
  return (
    <>
    <ForceGraph2D
          graphData={data}
        />
    </>
  );
  
}

export default App;
