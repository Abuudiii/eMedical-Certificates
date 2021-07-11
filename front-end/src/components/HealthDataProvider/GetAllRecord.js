import React from 'react';
import axios from 'axios';

class GetAllRecord extends React.Component {
    state = {
        patientID: '',
        result: ''
    }

    handleRecordIDChange = event => {
        this.setState({recordID: event.target.value});
    }

    handlePatientIDChange = event => {
        this.setState({patientID: event.target.value});
    }

    getAllRecord = event => {
        event.preventDefault();
        console.log('Getting all record');
        axios.get(`http://localhost:3001/health-data-provider/${this.props.operatorID}-${this.props.channelName}/getAllRecord?id=${this.props.operatorID}&patient-id=${this.state.patientID}`,
                {crossDomain: true}).then(
                    res => {
                        this.setState({result: 'Result' + JSON.stringify(res.data)});
                    }
                )
    }


    render() {
        return (
            <div>
                <form onSubmit={this.getAllRecord}>
                    <label for='patientID'>Patient ID: </label>
                    <input type='text' id='patientID' name='patientID' onChange={this.handlePatientIDChange}></input>
                    <button type='submit'>Submit</button>
                </form>
                <span>{this.state.result}</span>
            </div>
        )
    }
};

export default GetAllRecord;