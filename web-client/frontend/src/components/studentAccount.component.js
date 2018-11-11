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
    margin: '20px auto',
    width: 750,
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


// StudentComponent
class StudentComponent extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static" style={{color:"#fff"}}>
          <Toolbar>
            <img src={require('../img/logo_small.png')}/>
            <Typography variant="title" color="inherit">
              CognEOS
            </Typography>
            <Typography style={{textAlign: "right", flex: 1}} component="pre">
                <img src={require('../img/if_boy_403024.png')} width="40"/>
            <Link to="/student/account"> 200 EOS</Link>
            </Typography>
          </Toolbar>
        </AppBar>

        <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" component="h2">
              Nikita Koren
            </Typography>
            <StyledButton>
              Unlock 200 EOS
            </StyledButton>
          </CardContent>
        </Card>
      </div>
    );
  }

}

export default withStyles(styles)(StudentComponent);
