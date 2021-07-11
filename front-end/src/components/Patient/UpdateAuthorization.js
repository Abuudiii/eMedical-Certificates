import React from 'react';
import axios from 'axios';

class UpdateAuthorization extends React.Component {
    state = {
        patientID: '',
        authorizingID: '',
        right: false,
        result: ''
    }

    handleAuthorizingIDChange = event => {
        this.setState({authorizingID: event.target.value});
    }

    handleRightChange = event => {
        this.setState({right: !this.state.right});
    }

    updateAuthorization = event => {
        event.preventDefault();
        console.log('Updating authorization');
        axios.get(`http://localhost:3001/patient/${this.props.patientID}-${this.props.channelName}/updateAuthorization?id=${this.state.patientID}&patient-id=${this.props.patientID}&authorizing-id=${this.state.authorizingID}&newRight=${this.state.right.toString()}`,
                {crossDomain: true, 'Access-Control-Allow-Origin': '*'}).then(
                    res => {
                        this.setState({result: 'Result: ' + JSON.stringify(res.data)});
                    }
                )
    }

    render() {
        return (
            <div>
                <form onSubmit={this.updateAuthorization}>
                    <label for='authorizingID'>Authorizing ID: </label>
                    <input type='text' id='authorizingID' name='authorizingID' onChange={this.handleAuthorizingIDChange}></input>
                    <label for='right'>Authorized: </label>
                    <input type='checkbox' id='right' name='right' onChange={this.handleRightChange}></input>
                    <button type='submit'>Submit</button>
                </form>
                <span>{this.state.result}</span>
            </div>
        )
    }
};

export default UpdateAuthorization;