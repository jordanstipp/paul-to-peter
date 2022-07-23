import { ForceGraph2D } from 'react-force-graph';
import React, { useState } from 'react';



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
        "links": get_displayable_edges(edges)
      };
      return mydata;
  }

const { useRef } = React;
const graphStyle = {
  backgroundColor: "grey",
  showNavInfo: true,
  marginTop: 0,
  border: "1px solid black"
}
const CashGraphView = (props) => {

    const data = get_force_graph_data(props.nodes, props.edges)
    console.log(props.edges)
    console.log(data);
    const fgRef = useRef();

    function handleClick (node) {
      // Aim at node from outside it
      const distance = 40;
      const distRatio = 1 + distance/Math.hypot(node.x, node.y);

      fgRef.current.centerAt(
        { x: node.x * distRatio, y: node.y * distRatio}, // new position
        node, // lookAt ({ x, y, z })
        3000  // ms transition duration
      );
      props.handleNodeFocusClick(node);
    };
  
    return (
      <div style={graphStyle}>
        <ForceGraph2D
            ref={fgRef}
            width={850}
            height={400}
            backgroundColor={'white'}
            graphData={data}
            nodeLabel="id"
            onNodeClick={handleClick}
            onNodeHover={()=>{}}
            cooldownTicks={100}
            minZoom={3}
            maxZoom={10}
            centerAt={(0,0)}
            onEngineStop={() => {
              console.log(fgRef)
              fgRef.current.zoomToFit(400)
            }}
          /> 
      </div>
    )
    
}

export default CashGraphView;