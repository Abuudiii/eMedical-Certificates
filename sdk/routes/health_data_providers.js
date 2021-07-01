const url = require('url');
const cors = require('cors');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

var express = require('express');
var router = express.Router();
var contract;
var gateway;

async function init(channelName, userName) {
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations',
    'org1.example.com', 'connection-org1.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get(userName);
    const gateway = new Gateway();
    await gateway.connect(ccp, {wallet, identity: userName, discovery: {enabled: true, asLocalhost: true}});
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract('electronic_health_record');
    return gateway, contract
}

/* GET home page. */
router.get('/', async function(req, res) {
    const channelName = req.params.channelName;
    const userName = req.params.userName;
    gateway, contract = await init(channelName, userName);
    res.render('homepage', {title: 'Patients', channel: channelName});
});

router.post('/updateAuthorization', cors(), async function(req, res) {
    try {
        let params = new URLSearchParams(url.parse(req.url).query);
        const operatorID = params.get('id');
        const patientID = params.get('patient-id');
        const authorizingID = params.get('authorizing-id');
        const newRight = params.get('new-right');
        await contract.submitTransaction('updateAuthorization', patientID, operatorID, authorizingID, newRight);
        console.log(`Authorizing ${authorizingID}`);
        res.status(200);
        res.json({'success': true, 'data': ''});

    } catch (error) {
        res.status(400);
        res.json({'success': false, data: `${error}`});
    };
});

router.get('/getAllRecord', cors(), async function(req, res) {
    try {
        let params = new URLSearchParams(url.parse(req.url).query);
        const operatorID = params.get('id');
        const patientID = params.get('patient-id');
        const result = await contract.evaluateTransaction('getAllRecord', patientID, operatorID);
        console.log(`Got all record for ${patientID}`);
        res.status(200);
        res.json({'success': true, 'data': JSON.parse(result.toString())});
    } catch (error) {
        res.status(400);
        res.json({'success': false, 'data': `${error}`});
    };
})

router.get('/getRecordByID', cors(), async function(req, res) {
    try {
        let params = new URLSearchParams(url.parse(req.url).query);
        const patientID = params.get('patient-id');
        const operatorID = params.get('id');
        const recordID = params.get('record-id');
        const result = await contract.evaluateTransaction('getRecordByID', patientID, operatorID, recordID);
        console.log(`Got record with recordID=${recordID}`);
        res.status(200);
        res.json({'success': true, 'data': JSON.parse(result.toString())});
    } catch (error) {
        res.status(400);
        res.json({'success': false, 'data': `${error}`});
    };
});

router.post('/createRecord', cors(), async function(req, res) {
    try {
        let params = new URLSearchParams(url.parse(req.url).query);
        const patientID = params.get('patient-id');
        const operatorID = params.get('id');
        const recordData = params.get('record-data');
        const recordID = await contract.submitTransaction('createRecord', patientID, operatorID, recordData);
        console.log(`Created record with recordID=${recordID}`);
        res.status(200);
        res.json({'success': true, 'data': recordID});
    } catch (error) {
        res.status(400);
        res.json({'success': false, 'data': `${error}`});
    }
});

router.post('/updateRecord', cors(), async function(req, res) {
    try {
        let params = new URLSearchParams(url.parse(req.url).query);
        const patientID = params.get('patient-id');
        const operatorID = params.get('id');
        const recordID = params.get('record-id');
        const newRecordData = params.get('new-record-data');
        await contract.submitTransaction('updateRecordByID', patientID, operatorID, recordID, newRecordData);
        console.log(`Updated record with recordID=${recordID}`);
        res.status(200);
        res.json({'success': true, 'data': ''});
    } catch (error) {
        res.status(400);
        res.json({'success': false, 'data': `${error}`});
    }
});

module.exports = router;