//███████╗██╗██████╗ ███████╗ █████╗ ██████╗ ██╗
//██╔════╝██║██╔══██╗██╔════╝██╔══██╗██╔══██╗██║
//█████╗  ██║██████╔╝█████╗  ███████║██████╔╝██║
//██╔══╝  ██║██╔══██╗██╔══╝  ██╔══██║██╔═══╝ ██║
//██║     ██║██║  ██║███████╗██║  ██║██║     ██║
//╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
//24fireAPI für NodeJS
//Stand: 06.01.2024
//Made by FlosTechnikwlt
//Credits: Lars.1309

'use strict';
const axios = require('axios');
const fireapiError = "[24fire Client]: "


class fireAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        if(!apiKey) { return fireapiError + "No API-Key was given"}
    }


    vm() {
        const apiKey = this.apiKey;

        async function getVMconfig() {
            const response = await axios.get("https://api.24fire.de/kvm/config", {
                headers: {
                    //'Authorization': `Bearer ${apiKey}`,
                    'X-FIRE-APIKEY': apiKey,
                },
            });
            return response.data;
        }

        
        async function getVMstatus() {
            const response = await axios.get("https://api.24fire.de/kvm/status", {
                headers: {
                    //'Authorization': `Bearer ${apiKey}`,
                    'X-FIRE-APIKEY': apiKey,
                },
            });
            return response.data;
        }


        

        async function startVM() {
            const response = await axios.request({
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.24fire.de/kvm/status/start',
                headers: { 
                  'X-FIRE-APIKEY': apiKey
                }
            })
            return response.data;
        }


        

        async function stopVM() {
            const response = await axios.request({
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.24fire.de/kvm/status/start',
                headers: { 
                  'X-FIRE-APIKEY': apiKey
                }
              })
            return response.data;
        }


        

        async function restartVM() {
            const response = await axios.request({
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.24fire.de/kvm/status/restart',
                headers: { 
                  'X-FIRE-APIKEY': apiKey
                }
            })
            return response.data;
        }


        return {
            getVMconfig,
            getVMstatus,
            startVM,
            stopVM,
            restartVM,
        }
    }
}


module.exports = fireAPI;