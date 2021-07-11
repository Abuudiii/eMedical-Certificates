import React from 'react';
import './HealthDataProvider.css';
import {BrowserRouter as Router, Switch, Route, NavLink} from 'react-router-dom';
import GetRecordByID from './GetRecordByID';
import GetAllRecord from './GetAllRecord';
import UpdateAuthorization from './UpdateAuthorization';
import CreateRecord from './CreateRecord';
import UpdateRecord from './UpdateRecord';

class HealthDataProvider extends React.Component {
    state = {
        userID: '',
        channelName: ''
    }

    handleIDChange = event => {
        this.setState({userID: event.target.value});
    }

    handleChannelChange = event => {
        this.setState({channelName: event.target.value});
    }

    render() {
        return (
            <div>
                <form>
                    <label for='id'>User ID: </label>
                    <input type='text' name='id' id='id' onChange={this.handleIDChange}></input>
                    <label for='channel'>Channel: </label>
                    <input type='text' name='channel' id='channel' onChange={this.handleChannelChange}></input>
                </form>
                <Router>
                    <div>
                        <nav id='patientNav'>
                            <NavLink activeClassName="currentTab" to="/getRecordByID">Get Record By ID</NavLink>
                            <NavLink activeClassName="currentTab" to="/getAllRecord">Get All Record</NavLink>
                            <NavLink activeClassName="currentTab" to="/updateAuthorization">Update Authorization</NavLink>
                            <NavLink activeClassName="currentTab" to="/createRecord">Create Record</NavLink>
                            <NavLink activeClassName="currentTab" to="/updateRecord">Update Record</NavLink>
                        </nav>

                        <Switch>
                            <Route path="/getRecordByID"><GetRecordByID operatorID={this.state.userID}
                                   channelName={this.state.channelName}/></Route>
                            <Route path="/getAllRecord"><GetAllRecord operatorID={this.state.userID}
                                   channelName={this.state.channelName}/></Route>
                            <Route path="/updateAuthorization"><UpdateAuthorization operatorID={this.state.userID}
                                   channelName={this.state.channelName}/></Route>
                            <Route path="/createRecord"><CreateRecord operatorID={this.state.userID}
                                   channelName={this.state.channelName}/></Route>
                           <Route path="/updateRecord"><UpdateRecord operatorID={this.state.userID}
                                   channelName={this.state.channelName}/></Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }

}

export default HealthDataProvider;