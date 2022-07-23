import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import globalGraph from './cash_graph/main.js';
import Button from '@mui/material/Button';

import NodeQuickView from './components/NodeQuickView';
import NodeInspectView from './components/NodeInspectView';
import CashGraphView from './components/CashGraphView';

const graphDisplayStyle = {
  display: "flex",
  flexDirection: "row"
};
const GraphDisplay = (props) => {
  return(
    <div>
      <CashGraphView 
          handleNodeFocusClick={props.handleNodeFocusClick}
          nodes={props.data.get_nodes()}
          edges={props.data.get_edges()}
      />
      <NodeInspectView
          node={props.focusNode}
          nodes={props.data.get_nodes()}
          incoming_edges={props.incoming_edges}
          outgoing_edges={props.outgoing_edges}
          newEdgeFunction={props.newEdgeFunction}
          displayFullInfo={false}
        />
    </div>
  );
};

function App() {
  const [data, setData] = useState({});
  /**
   * Data Graph changes won't trigger a change of state re-rendering
   * because of the function supporting it. Toggle a boolean instead
   * to trigger the sub-component refresh when necessary.
  */
  const [refreshGraphToggle, setRefreshGraphToggle] = useState(true);
  const [focusNode, setFocusNode] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [showGraph, seeGraphView] = useState(false);

  /**Loads the data from backend (which doesnt exist today) */
  useEffect(() => {
    console.log('Effect Executing');
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
    setRefreshGraphToggle(!refreshGraphToggle);
  }

  /**Updates an existing edge in the grap\h */
  function updateEdgeAmountInGraph(edge_id, amount) {
    console.log(edge_id);
    console.log(amount);
    data.update_edge(edge_id, amount);
    setRefreshGraphToggle(!refreshGraphToggle);
  }

  /**Removes an edge form the graph */
  function removeEdgeFromGraphFunction(edge_id) {
    data.remove_edge(edge_id);
    setData(data);
    setRefreshGraphToggle(!refreshGraphToggle);
  }

  /**Render the app. */
  if (isLoading) {
    return <div className="App">Loading..</div>
  }
  console.log(data.get_incoming_edges(focusNode.id));
  return (
    <>
    <h1>Welcome to your financial health</h1>
    <div className="dev-area">
      <div className="info-side">
        <NodeQuickView
          nodes={data.get_nodes()}
          handleClick={handleNodeFocusClick}
          categories={data.node_types}
        />
      </div>
      <div className="inspect-side">
        <Button
          onClick={()=>{
            seeGraphView(!showGraph)}
          }
          variant="outlined"
        >Toggle Graph</Button>
        {showGraph ? 
           <GraphDisplay 
            data={data}
            focusNode={focusNode}
            incoming_edges={data.get_incoming_edges(focusNode.id)}
            outgoing_edges={data.get_outgoing_edges(focusNode.id)}
            newEdgeFunction={newEdgeFunction}
            handleNodeFocusClick={handleNodeFocusClick}
           />:
          <NodeInspectView
            data={data}
            node={focusNode}
            nodes={data.get_nodes()}
            incoming_edges={data.get_incoming_edges(focusNode.id)}
            outgoing_edges={data.get_outgoing_edges(focusNode.id)}
            newEdgeFunction={newEdgeFunction}
            updateEdgeAmountInGraph={updateEdgeAmountInGraph}
            removeEdgeFromGraphFunction={removeEdgeFromGraphFunction}
            displayFullInfo={true}
          />
        }
      </div>
    </div>
    </>

  );
  
}

export default App;
