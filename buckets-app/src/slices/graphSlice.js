import { getDialogActionsUtilityClass } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit'
import blankGraph from '../cash_graph/blank.js';
import complexUserGraph from '../cash_graph/complex_user.js';
import mockUserGraph from '../cash_graph/mock_user.js';

const LOADED_GRAPH = complexUserGraph

const default_user_id = 'DefaultUser';
const DEFAULT_NODE_TYPES = ['User', 'Investment', 'Expense', 'Savings', 'Income Source', 'All']


export const graphSlice = createSlice({
    name: 'graph',
    initialState: {
        graph: LOADED_GRAPH,
        nodes: LOADED_GRAPH.get_nodes(),
        focusNode: Array.from(LOADED_GRAPH.get_nodes())[0],
        displayed_nodes: LOADED_GRAPH.nodes,
        edges: LOADED_GRAPH.edges,
        edges_incoming_index: {},
        edges_outgoing_index: {},
        node_types: DEFAULT_NODE_TYPES,
        graph_id: default_user_id
    },
    reducers: {
        setGraph: (state, action) =>{
            state.graph = action.graph
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
        },

        addNode: (state, action) =>{
            const node = action.payload
            const newNodes = {...state.nodes}
            newNodes[node.id] = node
            state.nodes = newNodes
            state.displayed_nodes = state.nodes
        },
        removeNode: (state) => {

        },
        addEdge: (state, action) =>{
            const edge = action.payload
            state.edges = state.edges.concat(edge)
        },
    },
})

export const {
    setGraph,
    setFocusNode, addNode, removeNode,
    filterNodesByStr, filterNodesByCategory,
    addEdge
} = graphSlice.actions
export default graphSlice.reducer