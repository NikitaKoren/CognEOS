import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Api, JsonRpc, RpcError, JsSignatureProvider } from 'eosjs'; // https://github.com/EOSIO/eosjs
import { TextDecoder, TextEncoder } from 'text-encoding';

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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


const StyledTypography = withStyles({
  root: {
    textAlign: 'center',
    margin: 20
  }
})(Typography)


// StudentComponent
class StudentComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      courseTable: []
    };
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
    }).then(result => this.setState({ courseTable: result.rows }));
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    const { courseTable } = this.state;

    let courses = courseTable.map((card) => this.generateCard(card));

    console.log(courses);

    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              CognEOS Student Portal
            </Typography>
            <Typography style={{'margin-left': 800}} component="pre">
              <Link to="/student/account">200 EOS</Link>
            </Typography>
          </Toolbar>
        </AppBar>
        <StyledTypography variant="title" color="inherit">
          Courses
        </StyledTypography>
        {courses}
      </div>
    );
  }

}

export default withStyles(styles)(StudentComponent);
