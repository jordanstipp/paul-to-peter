# Buckets App - A financial wellness tool

Every other Saturday I have this little routine - the day after pay day, I check in on my financial life. It a nice time to check that Im not overspending, see if I have all things settled for any upcoming bills, overall stay up to date on my life. Its come into a balance over the years where I once would check my bank account feverently, it used to be because I was broke and didnt know if I had enough for a purchase, later it was checking the stock market or a cryptocurrency. 

What I actually got into was nothing short of a complicated mess. Much like how someone with a messy desk knows where everything is, I moved through a hodge-podge of apps with my secret manager and 2FA app ready to unlock every door to my financial apps from my credit score, account balances, asset values, debts etc. Then over into Google Sheets where I had formulae and data links to rival a Goldman Sachs analyst!

One day as I likely lifted my phone to get a 2FA timed security code for the third time, I thought "there's gotta be a better way for this". And thats the type of pain point I had the software skills to solve, so lo and hold, buckets. (name in the works.. let me know if you have any suggestions)

## Model Money as a Graph
Most of us are familiar and frequently do some form of mental accounting, even without a budget. This "pot of cash" is for X while another is for "Y". We often set these as goals and set aside the cash in specific savings accounts, or keep track of the split in the same. Our investments are kept in separate brokerage accounts, and debts in others for things like a car or home. 

In this way, we can think of the flow of cash to, from, and through you as person into all of these forms as a graph. Where your employer, you, your accounts, and even your landlord are all the nodes and the transactions and transfers between these accounts are the edges that connect them. In this way, you can model your financial budget and transaction history becomes an explorable tree. This data representation is easy to build, maintain, and extend for unique tailoring to the user. 

### Nodes
Nodes can be any account or cohesive bundling of monetary value. All graphs must have at least one node to work. Example nodes are Income Source (Employer), Retirement, Crypto. In the future we will support integrating accounts with Plaid to connect to nodes. This will allow transaction history and sorting in each specific node. 

### Edges
Edges are the transactions between nodes. These are represented by a unique edge_id between the source and destination nodes along with how much the amount is. 

## Usage
### React
Use the react app by simply running npm start in the buckets-app directory. This will launch the app on a port on your machine (localhost).

### CLI Tool
I started off this idea by writing a python CLI version of the tool to model the data structure. Then figured every good backend needs a good frontend so dipped my toe into the React world for the first time. Run the command below for a CLI tool

python cashflow_graph.interactive.py 


## Roadmap
A collection of feature I plan on building and rolling out. If you'd like to lend a hand, feel free to open a pull request.
- [x] Build Frontend.
- [-] Enable node addition and modification.
- [ ] Style Frontend.
- [ ] Enable Persistent Storage.
- [ ] Allows nodes to be categorized as sub-nodes.
- [ ] Host on Firebase for web access.
- [ ] Enable Profile Authentication.
- [ ] Enable Accounts attaching to nodes.
- [ ] Enable share accounts across users.
- [ ] Schedule transactions between accounts.
- [ ] Integrate Plaid for Transaction history.
- [ ] Track historical data and show trends.
- [ ] Share accounts with other users.
