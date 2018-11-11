import React, { Component } from 'react';
import { Api, JsonRpc, RpcError, JsSignatureProvider } from 'eosjs'; // https://github.com/EOSIO/eosjs
import { TextDecoder, TextEncoder } from 'text-encoding';

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// eosio endpoint
const endpoint = "http://localhost:7777";

// NEVER store private keys in any source code in your real life development
// This is for demo purposes only!
const accounts = [];
// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  card: {
    margin: 20,
    width: 250,
    display: 'inline-block'
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  },
  pre: {
    background: "#ccc",
    padding: 10,
    marginBottom: 0,
  },
  button: {
    width: 50
  }
});

const StyledButton = withStyles({
  root: {
    padding: 0,
  },
})(Button);


// Index component
class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      noteTable: [] // to store the table rows from smart contract
    };
    this.handleFormEvent = this.handleFormEvent.bind(this);
  }

  /**
   * Construct Course Card 
   */
  generateCard = ({
    course_id, 
    course_desc,
    course_name,
    duration,
    rewards,
    teacher_id,
    total_avail
  }) => {
    const { classes } = this.props;
    return (
      <Card className={classes.card} key={course_id}>
        <CardContent>
          <Typography variant="headline" component="h2">
            {course_id}
          </Typography>
          <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
            {course_name}
          </Typography>
          <Typography component="pre">
            {course_desc}
          </Typography>
          <StyledButton onClick={(event) => this.enroll(event, course_id)}>
            Enroll
          </StyledButton>
        </CardContent>
      </Card>
    );
  }

  /**
   * Enroll Student into the course
   */
  async enroll(event, course_id) {
    console.log('enroll');
        // stop default behaviour
        event.preventDefault();

        // collect form data
        // let account = event.target.account.value;
        // let privateKey = event.target.privateKey.value;
        // let note = event.target.note.value;

        const privateKey = '5KUBosGNs6vBfF47Cqy432tDsjTjfXeEf4KMYb3husVVxDtibPJ';
    
        // eosjs function call: connect to the blockchain
        const rpc = new JsonRpc(endpoint);
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

        try {
          const result = await api.transact({
            actions: [{
              account: "cogneos",
              name: 'enrollcourse',
              authorization: [{
                actor: 'cogneos',
                permission: 'active',
              }],
              data: {
                user: 'cogneos',
                std_id: 0,
                course_id,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
    
          console.log(result);
          this.getTable();
        } catch (e) {
          console.log('Caught exception: ' + e);
          if (e instanceof RpcError) {
            console.log(JSON.stringify(e.json, null, 2));
          }
        }
  }

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    // collect form data
    let account = event.target.account.value;
    let privateKey = event.target.privateKey.value;
    let note = event.target.note.value;

    // prepare variables for the switch below to send transactions
    let actionName = "";
    let actionData = {};

    // define actionName and action according to event type
    switch (event.type) {
      case "submit":
        actionName = "update";
        actionData = {
          user: account,
          note: note,
        };
        break;
      default:
        return;
    }

    // eosjs function call: connect to the blockchain
    const rpc = new JsonRpc(endpoint);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    try {
      const result = await api.transact({
        actions: [{
          account: "notechainacc",
          name: actionName,
          authorization: [{
            actor: account,
            permission: 'active',
          }],
          data: actionData,
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });

      console.log(result);
      this.getTable();
    } catch (e) {
      console.log('Caught exception: ' + e);
      if (e instanceof RpcError) {
        console.log(JSON.stringify(e.json, null, 2));
      }
    }
  }

  // gets table data from the blockchain
  // and saves it into the component state: "noteTable"
  getTable() {
    const rpc = new JsonRpc(endpoint);
    rpc.get_table_rows({
      "json": true,
      "code": "cogneos",   // contract who owns the table
      "scope": "cogneos",  // scope of the table
      "table": "coursestb",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ noteTable: result.rows }));
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    const { noteTable } = this.state;

    let noteCards = noteTable.map((card) => this.generateCard(card));

    console.log(noteTable);

    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              CognEOS
            </Typography>
          </Toolbar>
        </AppBar>
        {noteCards}
      </div>
    );
  }

}

export default withStyles(styles)(Index);
