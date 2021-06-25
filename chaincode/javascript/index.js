/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const ElectronicHealthRecord = require('./lib/electronic_health_record');

module.exports.ElectronicHealthRecord = ElectronicHealthRecord;
module.exports.contracts = [ ElectronicHealthRecord ];
