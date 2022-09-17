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
import { InputLabel } from '@mui/material';
import { Provider, createStore } from 'react-redux'
import store from './store'
import { setGraph, addNode } from './slices/graphSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import blankGraph from './cash_graph/blank.js';
import complexUserGraph from './cash_graph/complex_user.js';
import mockUserGraph from './cash_graph/mock_user.js';
import { Node } from './cash_graph/main.js';

const graphDisplayStyle = {
  display: "flex",
  flexDirection: "row"
};
const GraphDisplay = (props) => {
  return(
    <div>
      <CashGraphView 
          handleNodeFocusClick={props.handleNodeFocusClick}
          nodes={props.graph.get_nodes()}
          edges={props.graph.get_edges()}
      />
      <NodeInspectView
          node={props.focusNode}
          nodes={props.graph.get_nodes()}
          incoming_edges={props.incoming_edges}
          outgoing_edges={props.outgoing_edges}
          newEdgeFunction={props.newEdgeFunction}
          displayFullInfo={false}
        />
    </div>
  );
};

function App() {
  const graph = useSelector((state)=> state.graph.graph)
  const displayedNodes_redux = useSelector((state)=>state.graph.displayed_nodes)
  const dispatch = useDispatch()
  // const [graph, setgraph] = useState({});
  /**
   * graph Graph changes won't trigger a change of state re-rendering
   * because of the function supporting it. Toggle a boolean instead
   * to trigger the sub-component refresh when necessary.
  */
  const [refreshGraphToggle, setRefreshGraphToggle] = useState(true);
  const [focusNode, setFocusNode] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showGraph, seeGraphView] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [displayedNodes, setDisplayedNodes] = useState({});

  function setStatesWithGraph(cashGraph) {
    // dispatch(setGraph(cashGraph));
    const default_display_node_id = Object.keys(cashGraph.nodes)[0]
    setFocusNode(cashGraph.nodes[default_display_node_id]);
    setDisplayedNodes(cashGraph.nodes)
    setRefreshGraphToggle(!refreshGraphToggle);
  };

  useEffect(() => {
    console.log('Effect Executing');
    setStatesWithGraph(graph)
    setLoading(false);
  }, []);

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

  /**Toggle between available graphs */
  function changeDisplayedGraph(e){
    const newGraph = AvailableGraphs[e.target.value];
    console.log(newGraph)
    setStatesWithGraph(newGraph)
  }

  /**Publish Graph to persistent storage */
  function SaveGraph(graph) {
    publishGraph(graph);
    setUnsavedChanges(false);
  };

  /**Handle a node focus event. */
  function handleNodeFocusClick(node) {
    console.log(node);
    let id = node.id;
    setFocusNode(graph.get_node(id));
  };

  /**Adds a new node to the graph */
  function addNodeFunction(name, type, current_balance){
    const node = new Node(name, type, current_balance);
    dispatch(addNode(node))
    setUnsavedChanges(true);
  }

  /**Adds a new edge to the graph. */
  function newEdgeFunction(sourceID, destinationID, amount){
    console.log('New edge being added from ' + sourceID + "->" + destinationID + "of amont: " + amount)
    console.log(sourceID)
    console.log(destinationID)
    graph.add_new_edge_to_graph(sourceID, destinationID, amount)
    setRefreshGraphToggle(!refreshGraphToggle);
    setUnsavedChanges(true);
  }

  /**Updates an existing edge in the graph */
  function updateEdgeAmountInGraph(edge_id, amount) {
    console.log(edge_id);
    console.log(amount);
    graph.update_edge(edge_id, amount);
    setRefreshGraphToggle(!refreshGraphToggle);
    setUnsavedChanges(true);
  }

  /**Removes an edge form the graph */
  function removeEdgeFromGraphFunction(edge_id) {
    graph.remove_edge(edge_id);
    dispatch(setGraph(graph));
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
              Object.keys(AvailableGraphs).map((key, i) => {
                const val = AvailableGraphs[key].graph_id
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
          handleClick={handleNodeFocusClick}
          categories={graph.node_types}
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
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
            focusNode={focusNode}
            incoming_edges={graph.get_incoming_edges(focusNode.id)}
            outgoing_edges={graph.get_outgoing_edges(focusNode.id)}
            newEdgeFunction={newEdgeFunction}
            handleNodeFocusClick={handleNodeFocusClick}
           />:
          <NodeInspectView
            graph={graph}
            node={focusNode}
            nodes={graph.get_nodes()}
            incoming_edges={graph.get_incoming_edges(focusNode.id)}
            outgoing_edges={graph.get_outgoing_edges(focusNode.id)}
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
