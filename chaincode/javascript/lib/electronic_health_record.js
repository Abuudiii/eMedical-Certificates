/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ElectronicHealthRecord extends Contract {

    async initLedger(ctx) {
        console.info('START : Initialize Ledger');
        console.info('END: Initialize Ledger');
    }

    async createProfile(ctx, patientID, name, birthDate, address) {
        console.info('START: createProfile');
        const profile = {
            'name': name,
            'birthDate': birthDate,
            'address': address,
            'authorization': {},
            'records': []
        }

        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(profile)));
        console.info('END: createProfile');
    }

    async isProfileExist(ctx, patientID) {
        const profileAsBytes = await ctx.stub.getState(patientID);
        if (!profileAsBytes || profileAsBytes.length === 0) {
            throw new Error(`Patient ${patientID} does not exist`);
        }
        return JSON.parse(profileAsBytes.toString());
    }

    isAuthorized(profile, patientID, operatorID) {
        if (patientID !== operatorID && profile['authorization'][operatorID] !== true){
            throw new Error(`Operator ${operatorID} is not authorized`);
        }
    }

    async getRecordByID(ctx, patientID, operatorID, recordID) {
        console.info('START: getRecordByID');
        const profile = await this.isProfileExist(ctx, patientID);
        this.isAuthorized(profile, patientID, operatorID);
        if (profile['records'].length <= parseInt(recordID)) {
            throw new Error(`Record ID ${recordID} does not exist`);
        }
        console.info('END: getRecordByID');
        return profile['records'][parseInt(recordID)];
    }

    async getAllRecord(ctx, patientID, operatorID) {
        console.info('START: getAllRecord');
        const profile = await this.isProfileExist(ctx, patientID);
        this.isAuthorized(profile, patientID, operatorID);
        console.info('END: getAllRecord');
        return profile['records'];
    }

    async updateAuthorization(ctx, patientID, operatorID, authorizingID, newRight) {
        console.info('START: updateAuthorization');
        const profile = await this.isProfileExist(ctx, patientID);
        this.isAuthorized(profile, patientID, operatorID);
        profile['authorization'][authorizingID] = newRight == "true";
        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(profile)));
        console.info('END updateAuthorization');
    }

    async createRecord(ctx, patientID, operatorID, recordData) {
        console.info('START: createRecord');
        const profile = await this.isProfileExist(ctx, patientID);
        this.isAuthorized(profile, patientID, operatorID);
        const record = {'author': operatorID, 'data': recordData};
        profile['records'].push(record);
        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(profile)));
        console.info('END createRecord');
        return profile['records'].length - 1;
    }

    async updateRecordByID(ctx, patientID, operatorID, recordID, newRecordData) {
        console.info('START: updateRecordByID');
        const profile = await this.isProfileExist(ctx, patientID);
        if (profile['records'].length <= parseInt(recordID)) {
            throw new Error(`Record ID ${recordID} does not exist`);
        }
        if (profile['records'][parseInt(recordID)]['author'] !== operatorID) {
            throw new Error('Only the author can update the record');
        }
        profile.records[parseInt(recordID)]['data'] = newRecordData;
        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(profile)));
        console.info('END: updateRecordByID');
    }

    async updatePersonalData(ctx, patientID, newName, newAddress) {
        console.info('START: updatePersonalData');
        const profile = await this.isProfileExist(ctx, patientID);
        profile.name = newName;
        profile.address = newAddress;
        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(profile)));
        console.info('END: updatePersonalData');
    }
}

module.exports = ElectronicHealthRecord;
