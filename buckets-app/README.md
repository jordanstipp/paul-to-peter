# Buckets React App

Every great backend needs a good frontend, so here we are. 

Some ground rules for organization
- Follow your typical design rules 
    - Keep complex logic as high as possible. Components should have few data transformation functions, only inner component state changes. 
- Style  each file component (larger and composed of many smaller components) with a const style defined outside. Only use inline styling for few (<=3 properties)

## Architecture
Currently this app has two main components

### Backend and State Data Handling 
Today, the backend is simply object files defined in cash_graph/. These will one day will GraphQL data fetches associated with userProfiles. 

When data is loaded, we use an in-memory graph class to the the relate the data without continual fetches. This graph has the list of nodes and edges, as well as two in-memory indexed maps for the destination and source nodes. This is useful only until the GraphQL database is implemented. 

The API layer and class definition to the Graph can be found in cash_graph/main.js.

### FrontEnd Components
MaterialUi components are mainly leaned on here. You may find some demo references around during the initial bringup here. Please mind the ramp up. 