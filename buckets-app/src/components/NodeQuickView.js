import Card from '@mui/material/Card';
import { CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';


const NodeViewCard = (props) => {
    return (<Card variant="outlined" sx={{maxWidth: 400, maxHeight: 200, alignContent: "center"}}>
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

const NodeList = (props) => {
    return (
    <div>
      <ul>
        {
          Object.keys(props.nodes).map((content, index) => {
              const node = props.nodes[index]
              return (
                <li key={index}><NodeViewCard node={node} handleClick={props.handleClick}/></li>
              )
            })
        }
      </ul>
    </div>
    )
  }

function NodeQuickView (props) {
    return (
        <>
            <NodeList nodes={props.nodes} handleClick={props.handleClick}></NodeList>
        </>
    )
}

export default NodeQuickView;