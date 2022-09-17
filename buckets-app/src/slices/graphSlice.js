import { createSlice } from '@reduxjs/toolkit'
import blankGraph from '../cash_graph/blank.js';
import complexUserGraph from '../cash_graph/complex_user.js';
import mockUserGraph from '../cash_graph/mock_user.js';

const default_user_id = 'DefaultUser';
const DEFAULT_NODE_TYPES = ['User', 'Investment', 'Expense', 'Savings', 'Income Source', 'All']


export const graphSlice = createSlice({
    name: 'graph',
    initialState: {
        graph: complexUserGraph,
        nodes: complexUserGraph.nodes,
        displayed_nodes: complexUserGraph.nodes,
        edges: [],
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
        addNode: (state, action) =>{
            state.nodes = state.nodes.concat(action.payload)
            console.log('maade in store')
        },
        removeNode: (state) => {

        },
    },
})

export const { setGraph, addNode, removeNode, filterNodesByStr, filterNodesByCategory } = graphSlice.actions
export default graphSlice.reducer