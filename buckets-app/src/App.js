import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import globalGraph from './cash_graph/main.js';
import Button from '@mui/material/Button';

import NodeQuickView from './components/NodeQuickView';
import NodeInspectView from './components/NodeInspectView';



function App() {
  const [data, setData] = useState({});
  const [focusNode, setFocusNode] = useState({});
  const [isLoading, setLoading] = useState(true);

  /**Loads the data from backend (which doesnt exist today) */
  useEffect(() => {
    console.log(globalGraph);
    setData(globalGraph);
    const default_display_node_id = Object.keys(globalGraph.nodes)[0]
    setFocusNode(globalGraph.nodes[default_display_node_id]);
    setLoading(false);
  }, []);

  /**Handle a node focus event. */
  function handleNodeFocusClick(node) {
    console.log(node);
    let id = node.id;
    setFocusNode(data.get_node(id));
  };

  /**Adds a new edge to the graph. */
  function newEdgeFunction(sourceID, destinationID, amount){
    console.log('New edge being added from ' + sourceID + "->" + destinationID + "of amont: " + amount)
    console.log(sourceID)
    console.log(destinationID)
    data.add_new_edge_to_graph(sourceID, destinationID, amount)
    setData(data);
  }  

  /**Render the app. */
  if (isLoading) {
    return <div className="App">Loading..</div>
  }
  return (
    <>
    <h1>Welcome to your financial health</h1>
    <div className="dev-area">
      <div className="info-side">
        <NodeQuickView
          nodes={data.get_nodes()}
          handleClick={handleNodeFocusClick}
        />
      </div>
      <div className="inspect-side">
        {/* Toggle onto the <Graph /> when developed*/}
        <NodeInspectView
          node={focusNode}
          nodes={data.get_nodes()}
          incoming_edges={data.get_incoming_edges(focusNode)}
          outgoing_edges={data.get_outgoing_edges(focusNode)}
          newEdgeFunction={newEdgeFunction}
        />
      </div>
    </div>
    </>

  );
  
}

export default App;
