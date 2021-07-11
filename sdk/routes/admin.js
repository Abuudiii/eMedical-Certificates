const url = require('url');
const cors = require('cors');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

var express = require('express');
var router = express.Router();
var ca;

async function init() {
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations',
    'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get('admin');
    const gateway = new Gateway();
    await gateway.connect(ccp, {wallet, identity: 'admin', discovery: {enabled: true, asLocalhost: true}});
    return ca, gateway
}

router.post('/createProfile', cors(), async function(req, res) {
    try {
        let ca, gateway = await init();
        let params = new URLSearchParams(url.parse(req.url).query);
        const network = await gateway.getNetwork(params.get('channelName'));
        const contract = network.getContract('electronic_health_record');
        const patientID = params.get('id');
        const name = params.get('name');
        const birthDate = params.get('birth-date');
        const address = params.get('address');
        await contract.submitTransaction('createProfile', patientID, name, birthDate, address);
        console.log(`Profile for ${patientID} has been created`);
        res.status(200);
        res.json({'success': true, 'data': ''});
    } catch (error) {
        res.status(200);
        res.json({'success': false, 'data': `${error}`});
    };
});

router.post('/registerUser', cors(), async function(req, res){
    try {
        let ca, gateway = await init(channelName);
        let params = new URLSearchParams(url.parse(req.url).query);
        const userName = params.get('user-name');

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const userIdentity = await wallet.get(userName);
        if (userIdentity) {
            res.status(200);
            res.json({'success': false, 'reason': `User ${userName} already exists in the wallet`});
        }

        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            res.status(200);
            res.json({'success': false, 'reason': `Missing admin user in the wallet`});
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: userName,
            role: 'client'
        }, adminUser);

        const enrollment = await ca.enroll({
            enrollmentID: userName,
            enrollmentSecret: secret
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put(userName, x509Identity);
        console.log(`Registered and enrolled user ${userName}`);
        res.status(200);
        res.json({'success': true, 'data': ''});
    } catch (error) {
        res.status(200);
        res.json({'success': false, 'data': `${error}`});
    }
});

router.post('/createChannel', cors(), async function(req, res){
    try {
        let ca, gateway = await init(channelName);
        let params = new URLSearchParams(url.parse(req.url).query);
        const channelName = params.get('channel-name');
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('Missing admin user in the wallet')
            res.status(200);
            res.json({'success': false, 'reason': 'Missing admin user in the wallet'});
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: 'admin', discovery: {enabled: true, asLocalhost: true}});
        var client = gateway.getClient();

        let envelopeBytes = fs.readFileSync(path.resolve(__dirname, '..', '..', 'test-network', 'channel-artifacts',
        'channel1.tx'));
        let adminKey = fs.readFileSync(path.resolve(__dirname, '..', '..', 'test-network', 'organizations',
        'peerOrganizations', 'org1.example.com', 'users', 'Admin@org1.example.com', 'msp', 'keystore',
        'bc0495a3baf7eb06cb0e04d6ff44eea1a3b4ebc70b8aac02ea63f9a647450c7c_sk'));
        let adminCert = fs.readFileSync(path.resolve(__dirname, '..', '..', 'test-network', 'organizations',
        'peerOrganizations', 'org1.example.com', 'users', 'Admin@org1.example.com', 'msp', 'cacerts',
        'localhost-7054-ca-org1.pem'));
        client.setAdminSigningIdentity(adminKey.toString(), adminCert.toString(), 'Org1MSP');
        var signatures = new Array();

        const configUpdate = client.extractChannelConfig(envelopeBytes);
        var configSignature = client.signChannelConfig(configUpdate);

        signatures.push(configSignature);

        var orderer = client.getOrderer('orderer.example.com');
        let request = {
            config: configUpdate,
            signatures: signatures,
            name: channelName,
            orderer: orderer,
            txId: client.newTransactionID(true)
        };

        console.log('Transaction sent');
        const result = await client.createChannel(request);
        res.status(200);
        res.json({'success': true, 'data': `${result}`});
    } catch (error) {
        res.status(200);
        res.json({'success': false, 'data': `${error}`});
    };
})

module.exports = router;
