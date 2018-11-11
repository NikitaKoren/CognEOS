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
    margin: 40,
    width: 300,
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
    padding: 20,
    marginBottom: 20,
  },
  button: {
      color: "blue",
    width: 50
  }
});


const StyledTypography = withStyles({
  root: {
    textAlign: 'center',
    margin: 40
  }
})(Typography)


// StudentComponent
class StudentComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      courseTable: [],
      studentTable: [],
      studentCoursesTable: []
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
          <Typography style={{
              width: 250,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
          }} variant="headline" gutterBottom>
          {course_id} : {course_name}
          </Typography>
          <Typography component="pre" marginBottom="20">
            Sponsored by: 
         <img src={require('../img/bluchain.png')} width="180"/>
        </Typography>
          <div>
            {this.generateButtonAction({course_id, course_name})}
            <div style={{
              float: 'right',
              padding: 10
            }}>
              {rewards} EOS (reward)
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  generateButtonAction = ({course_id, course_name}) => {
    const { studentCoursesTable } = this.state
    let buttonStatus = 'Enroll'
    
    const courseStatus = (studentCoursesTable || []).find((enrolledCourse) => enrolledCourse.course_id === course_id) || {};

    if (courseStatus.enrolled) {
      buttonStatus = 'Enrolled'
    }

    if (courseStatus.teacherapp) {
      buttonStatus = 'Unlock'
    }

    if (courseStatus.completed) {
      buttonStatus = 'Completed'
    }

    const actions = {
      'Enroll': this.enroll.bind(this),
      'Unlock': this.unlock.bind(this),
    }

    return (
      <Button style={{padding: '0, 10px'}} onClick={(event) => buttonStatus !== 'Enrolled' && actions[buttonStatus](event, {course_id, course_name, stdcourseid: courseStatus.stdcourseid})}>
        {buttonStatus}
      </Button>
    );
  }

  /**
   * Enroll Student into the course
   */
  async enroll (event, {course_id, course_name}) {
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
                course_id,
                course_name,
                std_id: 0
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });

          this.getTable();
          this.getStudentAccount();
          this.getStudentCourses();

        } catch (e) {
          console.log('Caught exception: ' + e);
          if (e instanceof RpcError) {
            console.log(JSON.stringify(e.json, null, 2));
          }
        }
  }

  async unlock (event, {stdcourseid}) {

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
              name: 'unlockreward',
              authorization: [{
                actor: 'cogneos',
                permission: 'active',
              }],
              data: {
                user_account: 'cogneos',
                stdcourseid,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });

          this.getTable();
          this.getStudentAccount();
          this.getStudentCourses();

        } catch (e) {
          console.log('Caught exception: ' + e);
          if (e instanceof RpcError) {
            console.log(JSON.stringify(e.json, null, 2));
          }
        }
  }

  // gets table data from the blockchain
  // and saves it into the component state: "noteTable"
  getTable = () => {
    const rpc = new JsonRpc(endpoint);
    rpc.get_table_rows({
      "json": true,
      "code": "cogneos",   // contract who owns the table
      "scope": "cogneos",  // scope of the table
      "table": "coursestb",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ courseTable: result.rows }));
  }

  getStudentAccount = () => {
    const rpc = new JsonRpc(endpoint);
    rpc.get_table_rows({
      "json": true,
      "code": "cogneos",   // contract who owns the table
      "scope": "cogneos",  // scope of the table
      "table": "studentstb",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ studentTable: result.rows }));
  }

  getStudentCourses = () => {
    const rpc = new JsonRpc(endpoint);
    rpc.get_table_rows({
      "json": true,
      "code": "cogneos",   // contract who owns the table
      "scope": "cogneos",  // scope of the table
      "table": "stdcoursetb",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ studentCoursesTable: result.rows }));
  }

  componentDidMount() {
    this.getTable();
    this.getStudentAccount();
    this.getStudentCourses();
  }

  render() {
    let { courseTable, studentTable, studentCoursesTable } = this.state;

    courseTable = courseTable && courseTable.length ? courseTable : [{
        course_desc: "Sponsored by ",
        course_id: 0,
        course_name: "EOS Fundamentals",
        duration: 40,
        rewards: 40 +" EOS",
        teacher_id: 0,
        total_avail: 0
    }]

    let courses = courseTable.map((card) => this.generateCard(card));
    let studentAccount = studentTable.find((student) => student.std_id === 0) || {};

    return (
      <div>
        <AppBar position="static" style={{color:"#fff"}}>
          <Toolbar>
            <img src={require('../img/logo_small.png')}/>
            <Typography variant="title" color="inherit">
              CognEOS
            </Typography>
                <Typography style={{textAlign: "right", flex: 1, alignItems: 'center'}} component="pre">
                  <div>
                    <img src={require('../img/if_boy_403024.png')} width="40"/>
                      <img src={require('../img/eos.png')} width="30"/>
                      <div style={{
                          display: 'inline-block',
                          width: '500'
                      }}>
                          <a style={{
                            fontSize: 20,
                            textDecoration: 'none',
                            color: 'white'
                          }}> {studentAccount.avail_rewards}</a>
                      </div>
                  </div>
            </Typography>
          </Toolbar>
        </AppBar>
        <Typography style={{
              textAlign: 'center',
              margin: 20,
        }} variant="display2" color="inherit">
          Courses
        </Typography>
        {courses}
      </div>
    );
  }

}

export default withStyles(styles)(StudentComponent);
