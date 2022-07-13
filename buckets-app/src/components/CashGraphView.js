import { ForceGraph2D } from 'react-force-graph';


function get_displayable_nodes(nodes){
    let graph_nodes = []
    nodes.forEach(node=> {
      graph_nodes.push({
        'id': node.id,
        'group': 1
      })
    })
    return graph_nodes;
  }
  
  function get_displayable_edges(edges){
    let graph_edges = []
    edges.forEach(edge=> {
      graph_edges.push({
        source: edge.source_id,
        target: edge.dest_id,
        value: edge.amount
      })
    })
    return graph_edges;
  }

function get_force_graph_data(nodes, edges){
      let mydata = { 
        "nodes": get_displayable_nodes(nodes),
        "links": get_displayable_edges(edges())
      };
      return mydata;
  }

const CashGraphView = (props) => {
    const data = get_force_graph_data(props.nodes, props.edges)
    return <ForceGraph2D
          graphData={data}
          ref={fgRef}
          onNodeClick={handleNodeFocusClick}
          onEngineStop={() => fgRef.current.zoomToFit(400)}
        /> 
}

export default CashGraphView;