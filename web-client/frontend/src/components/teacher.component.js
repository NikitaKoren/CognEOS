import React, { Component } from 'react';
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
import LinearProgress from '@material-ui/core/LinearProgress';

// eosio endpoint
const endpoint = "http://localhost:7777";

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  card: {
    margin: 'auto',
    marginBottom: 20,
    width: 900,
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

class TeacherComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      courseTable: []
    };
  }

  generateButtonAction = ({stdcourseid}) => {
    const { courseTable } = this.state
    let buttonStatus = 'Approve'

    const courseStatus = (courseTable || []).find((enrolledCourse) => enrolledCourse.stdcourseid === stdcourseid) || {};

    if (courseStatus.teacherapp) {
      buttonStatus = 'Approved'
    }

    return (
      <Button style={{
        marginTop: '5px',
        padding: '5px, 10px'
      }} onClick={(event) => buttonStatus !== 'Approved' && this.approve(event, {stdcourseid})}>
        {buttonStatus}
      </Button>
    );
  }

  /**
   * Construct Course Card 
   */
  generateCard = ({
    stdcourseid,
    course_id, 
    course_name,
    std_id,
    enrolled,
    hoursworked,
    completed,
    teacherapp,
    sponsorapp
  }) => {
    const { classes } = this.props;
    return (
      <Card className={classes.card} key={course_id}>
        <CardContent>
          <Typography variant="headline" component="h2">
            Nikita Koren, course id: {course_id}
          </Typography>
          <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
            {course_name}
          </Typography>
          <LinearProgress variant="determinate" value={100} />
          {this.generateButtonAction({stdcourseid})}
        </CardContent>
      </Card>
    );
  }

  /**
   * Enroll Student into the course
   */
  async approve(event, {stdcourseid}) {
        // stop default behaviour
        event.preventDefault();

        const privateKey = '5KUBosGNs6vBfF47Cqy432tDsjTjfXeEf4KMYb3husVVxDtibPJ';
    
        // eosjs function call: connect to the blockchain
        const rpc = new JsonRpc(endpoint);
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

        try {
          await api.transact({
            actions: [{
              account: "cogneos",
              name: 'teachercheck',
              authorization: [{
                actor: 'cogneos',
                permission: 'active',
              }],
              data: {
                user: 'cogneos',
                stdcourseid,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });

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
      "table": "stdcoursetb",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ courseTable: result.rows }));
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    let { courseTable } = this.state;

    courseTable = courseTable && courseTable.length ? courseTable : [{
        course_desc: "EOS Fundamentals",
        course_id: 0,
        course_name: "EOS Fundamentals",
        duration: 40,
        rewards: 20,
        teacher_id: 0,
        total_avail: 0
    }]

    let courses = courseTable.map((card) => this.generateCard(card));

    return (
      <div>
        <AppBar position="static" style={{color:"#fff"}}>
            <Toolbar>
                <img alt='img' src={require('../img/logo_small.png')}/>
                <Typography variant="title" color="inherit">
              CognEOS Teacher Portal
            </Typography>
          </Toolbar>
        </AppBar>
        <Typography style={{
              textAlign: 'center',
              margin: 20,
        }} variant="display2" color="inherit">
          Students
        </Typography>
        {courses}
      </div>
    );
  }

}

export default withStyles(styles)(TeacherComponent);
