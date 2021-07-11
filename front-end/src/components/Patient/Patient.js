import React from 'react';
import './Patient.css';
import {BrowserRouter as Router, Switch, Route, NavLink} from 'react-router-dom';
import UpdatePersonalData from './UpdatePersonalData';
import GetRecordByID from './GetRecordByID';
import GetAllRecord from './GetAllRecord';
import UpdateAuthorization from './UpdateAuthorization'

class Patient extends React.Component {
    state = {
        patientID: '',
        channelName: ''
    }

    handleIDChange = event => {
        this.setState({patientID: event.target.value});
    }

    handleChannelChange = event => {
        this.setState({channelName: event.target.value});
    }

    render() {
        return (
            <div>
                <form>
                    <label for='id'>ID: </label>
                    <input type='text' name='id' id='id' onChange={this.handleIDChange}></input>
                    <label for='channel'>Channel: </label>
                    <input type='text' name='channel' id='channel' onChange={this.handleChannelChange}></input>
                </form>
                <Router>
                    <div>
                        <nav id='patientNav'>
                            <NavLink activeClassName="currentTab" to="/updatePersonalData">Update Personal Data</NavLink>
                            <NavLink activeClassName="currentTab" to="/getRecordByID">Get Record By ID</NavLink>
                            <NavLink activeClassName="currentTab" to="/getAllRecord">Get All Record</NavLink>
                            <NavLink activeClassName="currentTab" to="/updateAuthorization">Update Authorization</NavLink>
                        </nav>

                        <Switch>
                            <Route path="/updatePersonalData"><UpdatePersonalData patientID={this.state.patientID}
                                   channelName={this.state.channelName}/></Route>
                            <Route path="/getRecordByID"><GetRecordByID patientID={this.state.patientID}
                                   channelName={this.state.channelName}/></Route>
                            <Route path="/getAllRecord"><GetAllRecord patientID={this.state.patientID}
                                   channelName={this.state.channelName}/></Route>
                            <Route path="/updateAuthorization"><UpdateAuthorization  patientID={this.state.patientID}
                                   channelName={this.state.channelName}/></Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }
};

export default Patient;