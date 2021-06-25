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
            name,
            birthDate,
            address,
            authorization: {},
            records: []
        }

        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(profile)));
        console.info('END: createProfile');
    }

    async isProfileExist(ctx, patientID) {
        const profileAsBytes = await ctx.stub.getState(patientID);
        if (!profileAsBytes || profileAsBytes.length === 0) {
            throw new Error(`${patientID} does not exist`);
        }
        return JSON.parse(profileAsBytes.toString());
    }

    isAuthorized(profile, patientID, operatorID) {
        if (patientID !== operatorID && profile['authorization'][operatorID] !== true){
            throw new Error(`${operatorID} is not authorized`);
        }
    }

    async getRecordByID(ctx, patientID, operatorID, recordID) {
        console.info('START: getRecordByID');
        const profile = await self.isProfileExist(ctx, patientID);
        self.isAuthorized(profile, patientID, operatorID);
        if (profile['records'].length < recordID) {
            throw new Error(`${recordID} does not exist`);
        }
        console.info('END: getRecordByID');
        return profile['records'][recordID];
    }

    async getAllRecord(ctx, patientID, operatorID) {
        console.info('START: getAllRecord');
        const profile = await self.isProfileExist(ctx, patientID);
        self.isAuthorized(patientID, operatorID);
        console.info('END: getAllRecord');
        return profile['records'];
    }

    async updateAuthorization(ctx, patientID, operatorID, authorizingID, newRight) {
        console.info('START: updateAuthorization');
        const profile = await self.isProfileExist(ctx, patientID);
        self.isAuthorized(profile, patientID, operatorID);
        profile['authorization'][authorizingID] = newRight;
        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(profile)));
        console.info('END updateAuthorization');
    }

    async createRecord(ctx, patientID, operatorID, recordData: string) {
        console.info('START: createRecord');
        const profile = await self.isProfileExist(ctx, patientID);
        self.isAuthorized(profile, patientID, operatorID);
        profile['records'].push(JSON.parse(recordData));
        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(profile)));
        console.info('END createRecord');
        return profile['records'].length;
    }

    async updateRecordByID(ctx, patientID, operatorID, recordID, newRecordData: string) {
        console.info('START: updateRecordByID');
        const profile = await self.isProfileExist(ctx, patientID);
        if (profile['records'].length < recordID) {
            throw new Error(`${recordID} does not exist`);
        }
        profile.records[recordID] = JSON.parse(newRecordData);
        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(profile));)
        console.info('END: updateRecordByID');
    }

    async updatePersonalData(ctx, patientID, newName, newAddress) {
        console.info('START: udpatePersonalData');
        const profile = await self.isProfileExist(ctx, patientID);
        profile.name = newName;
        profile.address = newAddress;
    }
}

module.exports = ElectronicHealthRecord;
