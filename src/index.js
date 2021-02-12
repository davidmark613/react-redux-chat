import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import {BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Spinner from './Spinner';
import firebase from './firebase';
import {Provider, connect} from 'react-redux';
import {store} from './redux/store';
import {bindActionCreators} from 'redux';
import {setUser, clearUser} from './redux/actions/actions';

class Root extends Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.setUser(user);
                this.props.history.push('/');
            } else {
                this.props.history.push('/login');
                this.props.clearUser();
            }
        })
    }

    render() {
        return this.props.isLoading
            ? <Spinner/>
            : (
                <Switch>
                    <Route exact path='/' component={App}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/register' component={Register}/>
                </Switch>
            );
    }
}

const mapStateToProps = state => ({
    isLoading: state.user.isLoading
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ setUser, clearUser }, dispatch)
}

const RootWithAuth = withRouter(connect(mapStateToProps, mapDispatchToProps)(Root));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth/>
        </Router>
    </Provider>,
    document.getElementById('root')
);

