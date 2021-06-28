const url = require('url');
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
    gateway, contract = await init('myChannel');
    res.render('homepage', {title: 'Patients'});
});

router.post('/createProfile', async function(req, res) {
    let params = new URLSearchParams(url.parse(req.url).query);
    const patientID = params.get('id');
    const name = params.get('name');
    const birthDate = params.get('birth-date');
    const address = params.get('address');
    await contract.submitTransaction('createProfile', patientID, name, birthDate, address);
    console.log(`Profile for ${patientID} has been created`);
    res.status(200);
    res.json({'success': true, 'data': {}});
});

router.get('/updatePersonalData', async function(req, res) {
    let params = new URLSearchParams(url.parse(req.url).query);
    const patientID = params.get('id');
    const newName = params.get('newName');
    const newAddress = params.get('mew-address');
    await contract.submitTransaction('updatePersonalData', patientID, newName, newAddress);
    console.log(`Updated data for ${patientID}`);
    res.status(200);
    res.json({'success': true, 'data': {}});
});

router.get('/getRecordByID', async function(req, res) {
    let params = new URLSearchParams(url.parse(req.url).query);
    const patientID = params.get('id');
    const recordID = params.get('record-id');
    const result = await contract.submitTransaction('getRecordByID', patientID, patientID, recordID);
    console.log(`Got record with recordID=${recordID}`);
    res.status(200);
    res.json({'success': true, 'data': JSON.parse(result.toString())});
});

router.get('/getAllRecord', async function(req, res) {
    let params = new URLSearchParams(url.parse(req.url).query);
    const patientID = params.get('id');
    const result = await contract.submitTransaction('getAllRecord', patientID, patientID);
    console.log(`Got all record for ${patientID}`);
    res.status(200);
    res.json({'success': true, 'data': JSON.parse(result.toString())});
})

module.exports = router;
