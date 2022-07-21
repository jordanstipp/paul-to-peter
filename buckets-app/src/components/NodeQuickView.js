import Card from '@mui/material/Card';
import { CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';



const cardStyle = {
  width: "90%",
  maxHeight: "15%",
  alignContent: "center",
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

const SearchBar = (props) => {
  return (
    <form style={{width: "100%", height: "10%", display: "flex", flexDirection: "row"}}>
      <TextField 
        id="search-bar"
        className='text'
        onInput={(e)=>{}}
        label="Node name"
        variant="outlined"
        placeholder="Search"
        size="large"
        style={{minHeight: "100%", flex: 1}}
      />
      <IconButton  type="submit" aria-label="search">
        {/* <SearchIcon style={{fill: "blue"}} /> */}
      </IconButton>
      <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value=""
          label="Node Category"
          onChange={(e)=>{}}
          style={{width: "30%", minHeight: "100%"}}
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
        <Button variant="contained" type='submit' size="small">+</Button>
    </form>
  )
}

const quickViewStyle = {
  height: "95%",
  border: "1px solid black",
  display: "flex",
  flexDirection: "column"
}

class NodeQuickView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={quickViewStyle}>
        <SearchBar categories={["Income Source", "Investment", "Expense"]}/>
        <NodeList nodes={this.props.nodes} handleClick={this.props.handleClick}></NodeList>
      </div>
    )
  }

}

export default NodeQuickView;