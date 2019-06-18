const EOSDeployer = require('./eos-deployer');
const assert = require('assert')
const defineImmutableProperties = require('./../helpers/immutable-properties').defineImmutableProperties;

class CleanDeployer extends EOSDeployer {

    constructor(provider, contractFactory, accountFactory) {
        super(provider, contractFactory);
        defineImmutableProperties(this, [
            {
                name: 'deploy',
                value: async function (wasmPath, abiPath, cpuAmount=null, netAmount=null, ramBytes=null, payer=provider.defaultAccount) {
                    let newContractAccount = await accountFactory.createRandom();
                    if(cpuAmount) {
                      assert(netAmount, "If cpuAmount is given, netAmount must be given as well")
                    }
                    if(netAmount) {
                      assert(cpuAmount, "If netAmount is given, cpuAmount must be given as well")
                    }
                    if(cpuAmount && netAmount) {
                      await newContractAccount.buyBandwidth(cpuAmount, netAmount, payer)
                    }
                    if(ramBytes) {
                      await newContractAccount.buyRam(ramBytes, payer)
                    }
                    return this.__deploy(wasmPath, abiPath, newContractAccount);;
                }
            }
        ]);
    }
}

module.exports = CleanDeployer;
