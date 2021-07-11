import React from 'react';
import axios from 'axios';

class GetRecordByID extends React.Component {
    state = {
        name: '',
        address: '',
        result: ''
    }

    handleNameChange = event => {
        this.setState({name: event.target.value});
    }

    handleAddressChange = event => {
        this.setState({address: event.target.value});
    }

    handlePatientIDChange = event => {
        this.setState({patientID: event.target.value});
    }

    updatePersonalData = event => {
        event.preventDefault();
        console.log('Updating personal data');
        axios.get(`http://localhost:3001/patient/${this.props.patientID}-${this.props.channelName}/updatePersonalData?id=${this.props.patientID}&new-name=${this.state.name}&new-address=${this.state.address}`,
                {crossDomain: true}).then(
                    res => {
                        this.setState({result: 'Result: ' + JSON.stringify(res.data)});
                    }
                );
    }


    render() {
        return (
            <div>
                <form onSubmit={this.updatePersonalData}>
                    <label for='name'>Patient ID: </label>
                    <input type='text' id='name' name='name' onChange={this.handleNameChange}></input>
                    <label for='recordID'>Record ID: </label>
                    <input type='text' id='address' name='address' onChange={this.handleAddressChange}></input>
                    <button type='submit'>Submit</button>
                </form>
                <span>{this.state.result}</span>
            </div>
        )
    }
};

export default GetRecordByID;