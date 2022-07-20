import Card from '@mui/material/Card';
import { CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';


const cardStyle = {
  width: "90%",
  maxHeight: "15%",
  alignContent: "center",
  color: "grey"
};

const NodeViewCard = (props) => {
    return (<Card variant="outlined" sx={cardStyle}>
          <CardContent>
            <Typography variant="h9" gutterBottom>
              Type: {props.node.type}
            </Typography>
            <Typography variant="h3">
              {props.node.name}
            </Typography> 
            <Typography variant="h5">
              Current balance: ${props.node.current_balance}
            </Typography>       
          </CardContent>
          <CardActions>
            <Button size="small" onClick={()=>{
              props.handleClick(props.node);
            }}>
                Inspect Node
              </Button>
        </CardActions>
        </Card>)
};

const listStyle = {
  width: "100%",
  height: "100%",
  border: "3px solid black",
  alignContent: "left",
  maxHeight: "100%", 
  overflow: "auto"
};

const NodeList = (props) => {
    return (
      <List style={listStyle}>
        {
          Object.keys(props.nodes).map((content, index) => {
              const node = props.nodes[index]
              return (
                <ListItem key={index}><NodeViewCard node={node} handleClick={props.handleClick}/></ListItem>
              )
            })
        }
      </List>
    )
}

const quickViewStyle = {
  height: "95%"
}
function NodeQuickView (props) {
    return (
        <div style={quickViewStyle}>
            <NodeList nodes={props.nodes} handleClick={props.handleClick}></NodeList>
        </div>
    )
}

export default NodeQuickView;