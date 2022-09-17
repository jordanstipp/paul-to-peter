import Card from '@mui/material/Card';
import { CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import { filterNodesByStr, filterNodesByCategory } from '../slices/graphSlice';
import { useDispatch } from 'react-redux';
import { setFocusNode } from '../slices/graphSlice';



const FormStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
};
const NewNodeForm = (props) => {
    const [nodeName, setNodeName] = useState('');
    const [currentCategory, setCurrentCategory] = useState(props.categories[0]);
    const [currentBalance, setCurrentBalance] = useState(0);

    return(
        <form style={FormStyle} onSubmit={()=>{}}>
            <h2>
              Add a new node to the graph
            </h2>
            <TextField
                id="node-name"
                className="text"
                onInput={(e)=>{
                    console.log(e.target.value)
                    setNodeName(e.target.value)
                }}
                label="Node name"
                variant="outlined"
                value={nodeName}
                placeholder="Node name"
                size="medium"
            />
            <NodeCategorySelect 
              currentCategory={currentCategory}
              setCategory={setCurrentCategory}
              onChange={(e)=>{
                console.log(e.target.value)
                setCurrentCategory(e.target.value)
              }}
              categories={props.categories}
            />
            <div style={{display:"flex", flexDirection:"row", justifyContent: "space-between", maxHeight: "15%"}}>
              <InputLabel style={{height: "50px", lineHeight: "50px", textAlign:"center"}}>Current Balance</InputLabel>
              <TextField
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                value={currentBalance}
                onInput={(e)=>{
                  console.log(e.target.value)
                  setCurrentBalance(e.target.value)
              }}
              />
            </div>
            <Button onClick={(e)=>{
              console.log('submit new node')
              props.addNodeFunction(nodeName, currentCategory, currentBalance)
              props.toggleNodeForm()
              e.preventDefault()
            }}>
                Add new Node
            </Button>
        </form>
    );
};

const NodeCategorySelect = (props) => {
  return (
    <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.currentCategory}
          label="Category"
          onChange={props.onChange}
          style={props.style}
      >
        {
          Object.keys(props.categories).map((key, i) => {
            const val = props.categories[key]
            return (
              <MenuItem key={val} value={val}>{val}</MenuItem>
            )
          })
        }
    </Select>
  )
}


const cardStyle = {
  width: "90%",
  maxHeight: "8%",
  alignContent: "center",
};

const NodeViewCard = (props) => {
    return (<Card variant="outlined" sx={cardStyle}>
          <CardContent>
            <Typography variant="h10" gutterBottom>
              Type: {props.node.type}
            </Typography>
            <Typography variant="h5">
              {props.node.name}
            </Typography> 
          </CardContent>
          <CardActions>
            <Button size="small" onClick={()=>{
              props.dispatch(setFocusNode(props.node.id))
            }}>
                Inspect Node
              </Button>
        </CardActions>
        </Card>)
};

const listStyle = {
  width: "100%",
  height: "100%",
  alignContent: "left",
  maxHeight: "100%", 
  overflow: "auto",
  flex: "1"
};

const NodeList = (props) => {
    const dispatch = useDispatch()
    return (
      <List style={listStyle}>
        {
          Object.keys(props.nodes).map((key, index) => {
              const node = props.nodes[key]
              return (
                <ListItem key={index}><NodeViewCard node={node} dispatch={dispatch}/></ListItem>
              )
            })
        }
      </List>
    )
}

const searchStyle = {
  width: "100%",
  minHeight: "15%",
  display: "flex",
  flexDirection: "row"
};

const SearchBar = (props) => {
  const dispatch = useDispatch()
  return (
    <form style={searchStyle}>
        <TextField 
          id="search-bar"
          className='text'
          onInput={(e)=>{
            console.log(e.target.value)
            dispatch(filterNodesByStr(e.target.value))
          }}
          label="Node name"
          variant="outlined"
          placeholder="Search"
          size="large"
          style={{minHeight: "100%", flex: 1}}
        />
        <IconButton  type="submit" aria-label="search" />
        <NodeCategorySelect 
          currentCategory={props.currentCategory}
          setCategory={props.setCategory}
          categories={props.categories}
          onChange={(e)=>{
            console.log(e.target.value)
            props.setCategory(e.target.value)
            dispatch(filterNodesByCategory(e.target.value))
          }}
          style={{width: "30%", minHeight: "100%"}}
        />
    </form>
  )
}

const quickViewStyle = {
  height: "95%",
  border: "1px solid black",
  display: "flex",
  flexDirection: "column"
}

const NodeQuickView = (props) => {
  const [newNodeMode, toggleNewNodeMode] = useState(false);
  function toggleNodeForm(){
    toggleNewNodeMode(!newNodeMode);
  }
  return (
    <div style={quickViewStyle}>
      <div style={{display: "flex", flexDirection: "row", minHeight: "10%", justifyContent: "space-between"}}>
        {newNodeMode ? <div style={{width: "60%"}}></div>:
          <SearchBar 
            allNodes={props.displayedNodes} 
            categories={props.categories}
            setCategory={props.setCurrentCategory}
            currentCategory={props.currentCategory}
            newNodeMode={newNodeMode}
          />
        }
        <Button variant="contained" type='submit' size="small"
            onClick={(e)=>{
              toggleNodeForm();
              e.preventDefault();}}
        >+</Button>
      </div>
      {newNodeMode ?
        <NewNodeForm
          addNodeFunction={props.addNodeFunction}
          currentCategory={props.currentCategory}
          setCategory={props.setCategory}
          categories={props.categories}
          toggleNodeForm={toggleNodeForm}
        /> :
        <NodeList nodes={props.displayedNodes} handleClick={props.handleClick}></NodeList>}
    </div>
  )


}

export default NodeQuickView;