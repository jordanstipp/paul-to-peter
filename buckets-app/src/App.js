import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import {getUpToDateGraph, publishGraph} from './cash_graph/main.js';
import Button from '@mui/material/Button';

import NodeQuickView from './components/NodeQuickView';
import NodeInspectView from './components/NodeInspectView';
import CashGraphView from './components/CashGraphView';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { getDialogActionsUtilityClass, InputLabel } from '@mui/material';
import { Provider, createStore } from 'react-redux'
import store from './store'
import { setGraph, addNode, addEdge, removeEdge, setFocusNode, updateEdge} from './slices/graphSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import blankGraph from './cash_graph/blank.js';
import complexUserGraph from './cash_graph/complex_user.js';
import mockUserGraph from './cash_graph/mock_user.js';
import { Node, Edge } from './cash_graph/main.js';


/** Hard Coded Graph Values.
   *  TODO(mjones): Change to dynamically load these values.
  */
 const AvailableGraphs = {}
 function getUpdatedGraph(graph){
   AvailableGraphs[graph.graph_id] = getUpToDateGraph(graph);
 }
 getUpdatedGraph(mockUserGraph);
 getUpdatedGraph(complexUserGraph);
 getUpdatedGraph(blankGraph);

const graphDisplayStyle = {
  display: "flex",
  flexDirection: "row"
};
const GraphDisplay = (props) => {
  const nodes = Array.from(useSelector((state)=> state.graph.nodes))
  console.log(nodes)
  const edges = Array.from(useSelector((state)=> state.graph.edges))
  console.log(edges)

  return(
    <div>
      <CashGraphView 
          nodes={nodes}
          edges={edges}
      />
      <NodeInspectView
          nodes={props.graph.get_nodes()}
          newEdgeFunction={props.newEdgeFunction}
          displayFullInfo={false}
        />
    </div>
  );
};

function App() {
  // Redux state hooks
  const dispatch = useDispatch()
  const graph = useSelector((state)=> state.graph.graph)
  const available_graphs = useSelector((state)=> state.graph.available_graphs)
  const displayedNodes_redux = useSelector((state)=>state.graph.displayed_nodes)

  // Inner Component display state variables
  const [refreshGraphToggle, setRefreshGraphToggle] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showGraph, seeGraphView] = useState(false);


  useEffect(() => {
    console.log('Effect Executing');
    setLoading(false);
  }, []);

  /**Toggle between available graphs */
  function changeDisplayedGraph(e){
    const graph_id = e.target.value
    console.log(graph_id)
    dispatch(setGraph(graph_id))
  }

  /**Publish Graph to persistent storage */
  function SaveGraph(graph) {
    publishGraph(graph);
    setUnsavedChanges(false);
  };

  /**Handle a node focus event. */
  function handleNodeFocusClick(node) {
    let id = node.id;
    dispatch(setFocusNode(id))
  };

  /**Adds a new node to the graph */
  function addNodeFunction(name, type, current_balance){
    const node = new Node(name, type, current_balance);
    dispatch(addNode(node))
    setUnsavedChanges(true);
  }

  /**Adds a new edge to the graph. */
  function newEdgeFunction(sourceID, destinationID, amount, desc){
    console.log('New edge being added from ' + sourceID + "->" + destinationID + "of amont: " + amount)
    const edge = new Edge(sourceID, destinationID, amount, desc)
    dispatch(addEdge(JSON.stringify(edge)))
    setUnsavedChanges(true);
  }

  /**Updates an existing edge in the graph */
  function updateEdgeAmountInGraph(edge_id, amount) {
    dispatch(updateEdge({
      id: edge_id, 
      amount: amount}))
    setRefreshGraphToggle(!refreshGraphToggle);
    setUnsavedChanges(true);
  }

  /**Removes an edge form the graph */
  function removeEdgeFromGraphFunction(edge_id) {
    dispatch(removeEdge(edge_id));
    setRefreshGraphToggle(!refreshGraphToggle);
    setUnsavedChanges(true);
  }

  /**Render the app. */
  if (isLoading) {
    return <div className="App">Loading..</div>
  }
  return (
    <>
    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
    <h1>Welcome to your financial health</h1>
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">Available Graphs</InputLabel>
      <Select
              labelId="demo-simple-select-label-small"
              id="demo-simple-select-small"
              label="Available Graphs"
              value={graph.graph_id}
              onChange={changeDisplayedGraph}
              style={{minWidth: "40%"}}
          >
            {
              Object.keys(available_graphs).map((key, i) => {
                const val = available_graphs[key].graph_id
                return (
                  <MenuItem key={val} value={val}>{val}</MenuItem>
                )
              })
            }
      </Select>
      {(unsavedChanges) ? 
        <Button variant="outlined" onClick={()=>SaveGraph(graph)}>
          Publish Changes.
        </Button>:
        <></>
      }
    </FormControl>
    </div>

    <div className="dev-area">
      <div className="info-side">
        <NodeQuickView
          displayedNodes={displayedNodes_redux}
          addNodeFunction={addNodeFunction}
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
            graph={graph}
            newEdgeFunction={newEdgeFunction}
            handleNodeFocusClick={handleNodeFocusClick}
           />:
          <NodeInspectView
            graph={graph}
            nodes={graph.get_nodes()}
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


class AppWrapper extends React.Component{
  render() {
    return (
      <Provider store={store}>
        <App/>
      </Provider>
    );
  }
}

export default AppWrapper;
