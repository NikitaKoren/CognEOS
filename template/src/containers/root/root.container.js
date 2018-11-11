import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Route, Redirect} from 'react-router-dom'
import {connect, Provider} from 'react-redux'
import {ConnectedRouter} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

// routes
// import LoginContainer from '../login/login.container'

const history = createHistory()

class Root extends Component {

  render() {
    const {store} = this.props;
    console.log(store);
    

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div className={'root-container'}>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}


const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

Root.propTypes = {
  store: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(Root);