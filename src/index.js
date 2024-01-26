//███████╗██╗██████╗ ███████╗ █████╗ ██████╗ ██╗
//██╔════╝██║██╔══██╗██╔════╝██╔══██╗██╔══██╗██║
//█████╗  ██║██████╔╝█████╗  ███████║██████╔╝██║
//██╔══╝  ██║██╔══██╗██╔══╝  ██╔══██║██╔═══╝ ██║
//██║     ██║██║  ██║███████╗██║  ██║██║     ██║
//╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
//24fire API für NodeJS
//Stand: 26.01.2024
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
                    'X-FIRE-APIKEY': apiKey,
                },
            });
            return response.data;
        }

        
        async function getVMstatus() {
            const response = await axios.get("https://api.24fire.de/kvm/status", {
                headers: {
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


    backup() {
        const apiKey = this.apiKey;

        async function listBackups() {
            const response = await axios.get("https://api.24fire.de/kvm/backup/list", {
                headers: {
                    'X-FIRE-APIKEY': apiKey,
                },
            });
            return response.data;
        }



        

        async function createBackup(description) {
            if(!description) {
            const response = await axios.request({
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.24fire.de/kvm/backup/create',
                headers: { 
                  'X-FIRE-APIKEY': apiKey
                }
            })
            return response.data;
        } else {
            const response = await axios.request({
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.24fire.de/kvm/backup/create',
                headers: { 
                  'X-FIRE-APIKEY': apiKey,
                  'description': description
                }
            })
            return response.data;
        }
        }




        async function deleteBackup(backupId) {
            if(!backupId) return fireapiError + 'Error no Backup id specified!';
            const response = await axios.request({
                method: 'delete',
                maxBodyLength: Infinity,
                url: `https://api.24fire.de/kvm/backup/delete?backup_id=${backupId}`,
                headers: { 
                  'X-FIRE-APIKEY': apiKey,
                }
            })
            return response.data;
        }


        return {
            listBackups,
            createBackup,
            deleteBackup,
        }
    }


    monitoring() {
        const apiKey = this.apiKey;

        async function getStats() {
            const response = await axios.get("https://api.24fire.de/kvm/monitoring/timings", {
                headers: {
                    'X-FIRE-APIKEY': apiKey,
                },
            });
            return response.data;
        }



        

        async function retieceOutages(description) {
            const response = await axios.request({
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.24fire.de/kvm/monitoring/incidences',
                headers: { 
                  'X-FIRE-APIKEY': apiKey,
                  'description': description
                }
            })
            return response.data;

        }


        return {
            getStats,
            retieceOutages,
        }
    }
}


module.exports = fireAPI;