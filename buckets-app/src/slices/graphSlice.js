import { Satellite } from '@mui/icons-material';
import { getDialogActionsUtilityClass } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit'
import blankGraph from '../cash_graph/blank.js';
import complexUserGraph from '../cash_graph/complex_user.js';
import mockUserGraph from '../cash_graph/mock_user.js';

const DEFAULT_GRAPH = complexUserGraph
const default_user_id = 'DefaultUser';
const DEFAULT_NODE_TYPES = ['User', 'Investment', 'Expense', 'Savings', 'Income Source', 'All']
const AVAILABLE_GRAPHS = {}
AVAILABLE_GRAPHS[blankGraph.graph_id] = blankGraph
AVAILABLE_GRAPHS[mockUserGraph.graph_id] = mockUserGraph
AVAILABLE_GRAPHS[complexUserGraph.graph_id] = complexUserGraph

function get_initial_node(graph){
    return Array.from(graph.get_nodes())[0]
}
function convert_graph_into_state(current_graph) {
    const inital_node = get_initial_node(current_graph)
    return { 
        available_graphs: AVAILABLE_GRAPHS,
        graph: current_graph,
        graph_id: default_user_id,
        node_types: DEFAULT_NODE_TYPES,
        nodes: current_graph.get_nodes(),
        edges: current_graph.get_edges(),
        
        displayed_nodes: current_graph.nodes,
        focusNode: inital_node,
        focusIncomingEdges: current_graph.get_incoming_edges(inital_node.id),
        focusOutgoingEdges: current_graph.get_outgoing_edges(inital_node.id),
        
        edges_incoming_index: current_graph.edges_incoming_index,
        edges_outgoing_index: current_graph.edges_outgoing_index,
    }
}

function remove_edge_id_from_array(edge_id, edge_array) {
    let foundIndex = -1;
    for (let i = 0; i < edge_array.length; i++) {
        console.log(edge_array[i].id)
        if (edge_array[i].id == edge_id){
            foundIndex = i;
            break;
        }
    }
    if (foundIndex > -1) {
        edge_array.splice(foundIndex, 1);
    }
    return edge_array;
}

export const graphSlice = createSlice({
    name: 'graph',
    initialState: convert_graph_into_state(DEFAULT_GRAPH),
    reducers: {
        setGraph: (state, action) =>{
            const graph_id = action.payload
            const newstate = Object.assign(
                {}, state, convert_graph_into_state(AVAILABLE_GRAPHS[graph_id]))
            console.log(newstate)
            state = newstate
        },
        filterNodesByStr: (state, action)=>{
            const substr = action.payload
            state.displayed_nodes = Object.fromEntries(
                Object.entries(state.nodes).filter(([key, node]) => 
                    node.name.toLowerCase().indexOf(substr.toLowerCase()) !== -1))
        },
        filterNodesByCategory: (state, action)=>{
            const category = action.payload
            state.displayed_nodes = Object.fromEntries(
                Object.entries(state.nodes).filter(
                    ([key, node]) => node.type === category || category === 'All'))
        },
        setFocusNode: (state, action) => {
            const node_id = action.payload
            state.focusNode = state.graph.nodes[node_id]
            state.focusIncomingEdges = state.edges_incoming_index[state.focusNode.id]
            state.focusOutgoingEdges = state.edges_outgoing_index[state.focusNode.id]
        },

        addNode: (state, action) =>{
            const node = action.payload
            const newNodes = {...state.nodes}
            newNodes[node.id] = node
            state.nodes = newNodes
            state.displayed_nodes = state.nodes
        },

        removeNode: (state) => {
            console.log('Remove not implemented yet.')
        },

        addEdge: (state, action) =>{
            // Copies of each state object must be made before modifying within redux.
            const edge = JSON.parse(action.payload)
            console.log(edge)
            const newEdges = {...state.edges}
            newEdges[edge.id] = edge;
            state.edges = newEdges;
    
            const edges_incoming_index_copy = state.edges_incoming_index
            edges_incoming_index_copy[edge.dest_id].push(edge);
            state.edges_incoming_index = edges_incoming_index_copy

            const edges_outgoing_index_copy = state.edges_outgoing_index
            edges_outgoing_index_copy[edge.source_id].push(edge);
            state.edges_outgoing_index = edges_outgoing_index_copy
            
            // Update focus node values.
            state.focusIncomingEdges = edges_incoming_index_copy[state.focusNode.id]
            state.focusOutgoingEdges = edges_outgoing_index_copy[state.focusNode.id]
        },

        removeEdge: (state, action) => {
            console.log('Reduce RemoveEdge')
            const edge_id = action.payload;
            if (state.edges[edge_id]){
                const edge = state.edges[edge_id]
                // Remove from the indexed array maps for source/destinations
                let source_node_outgoing_edges_copy_rm = state.edges_outgoing_index[edge.source_id]
                source_node_outgoing_edges_copy_rm = remove_edge_id_from_array(edge_id, source_node_outgoing_edges_copy_rm)
                // make copy and place in redux store
                let edges_outgoing_index_copy = state.edges_outgoing_index
                edges_outgoing_index_copy[edge.source_id] = source_node_outgoing_edges_copy_rm
                state.edges_outgoing_index = edges_outgoing_index_copy
                
                let edges_incoming_index_copy_rm = state.edges_incoming_index[edge.dest_id]
                edges_incoming_index_copy_rm = remove_edge_id_from_array(edge_id, edges_incoming_index_copy_rm)
                // make copy and place in redux store
                let edges_incoming_index_copy = state.edges_incoming_index
                edges_incoming_index_copy[edge.dest_id] = edges_incoming_index_copy_rm
                state.edges_incoming_index = edges_incoming_index_copy
        
                // Remove Edge object from graph.
                delete state.edges[edge_id];
                console.log('Deleted')
                // Update focus node values.
                state.focusIncomingEdges = edges_incoming_index_copy[state.focusNode.id]
                state.focusOutgoingEdges = edges_outgoing_index_copy[state.focusNode.id]
            }

        },

        updateEdge: (state, action)  => {
            const edge_id = action.payload.id
            const newAmount = action.payload.amount
            let updated_edge = state.graph.edges[edge_id];
            updated_edge.amount = newAmount;

            let newEdges = state.graph.edges
            newEdges[edge_id] = updated_edge
            state.edges = newEdges
        },
    },
})

export const {
    setGraph,
    setFocusNode, addNode, removeNode,
    filterNodesByStr, filterNodesByCategory,
    addEdge, removeEdge, updateEdge
} = graphSlice.actions
export default graphSlice.reducer