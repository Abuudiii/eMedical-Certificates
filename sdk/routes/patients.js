const url = require('url');
const cors = require('cors');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

var express = require('express');
var router = express.Router();
var contract;
var gateway;

async function init(channelName) {
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations',
    'org1.example.com', 'connection-org1.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get('appUser');
    const gateway = new Gateway();
    await gateway.connect(ccp, {wallet, identity: 'appUser', discovery: {enabled: true, asLocalhost: true}});
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract('electronic_health_record');
    return gateway, contract
}

/* GET home page. */
router.get('/', async function(req, res) {
    const channelName = req.params.channelName;
    gateway, contract = await init(channelName);
    res.render('homepage', {title: 'Patients', channel: channelName});
});


router.post('/createProfile', cors(), async function(req, res) {
    try {
        let params = new URLSearchParams(url.parse(req.url).query);
        const patientID = params.get('id');
        const name = params.get('name');
        const birthDate = params.get('birth-date');
        const address = params.get('address');
        await contract.submitTransaction('createProfile', patientID, name, birthDate, address);
        console.log(`Profile for ${patientID} has been created`);
        res.status(200);
        res.json({'success': true, 'data': ''});
    } catch (error) {
        res.status(400);
        res.json({'success': false, 'data': `${error}`});
    };
});

router.get('/updatePersonalData', cors(), async function(req, res) {
    try {
        let params = new URLSearchParams(url.parse(req.url).query);
        const patientID = params.get('id');
        const newName = params.get('newName');
        const newAddress = params.get('mew-address');
        await contract.submitTransaction('updatePersonalData', patientID, newName, newAddress);
        console.log(`Updated data for ${patientID}`);
        res.status(200);
        res.json({'success': true, 'data': {}});
    } catch (error) {
        res.status(400);
        res.json({'success': false, 'data': `${error}`});
    };
});

router.get('/getRecordByID', cors(), async function(req, res) {
    try {
        let params = new URLSearchParams(url.parse(req.url).query);
        const patientID = params.get('id');
        const recordID = params.get('record-id');
        const result = await contract.evaluateTransaction('getRecordByID', patientID, patientID, recordID);
        console.log(`Got record with recordID=${recordID}`);
        res.status(200);
        res.json({'success': true, 'data': JSON.parse(result.toString())});
    } catch (error) {
        res.status(400);
        res.json({'success': false, 'data': `${error}`});
    };
});

router.get('/getAllRecord', cors(), async function(req, res) {
    try {
        let params = new URLSearchParams(url.parse(req.url).query);
        const patientID = params.get('id');
        const result = await contract.evaluateTransaction('getAllRecord', patientID, patientID);
        console.log(`Got all record for ${patientID}`);
        res.status(200);
        res.json({'success': true, 'data': JSON.parse(result.toString())});
    } catch (error) {
        res.status(400);
        res.json({'success': false, 'data': `${error}`});
    };
})

module.exports = router;
