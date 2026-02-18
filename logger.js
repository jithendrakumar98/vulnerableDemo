
const logs = [];

function addLog(type, endpoint, status){
    const entry = {
        time: new Date().toISOString(),
        type,
        endpoint,
        status
    };
    logs.unshift(entry);
    if(logs.length>50) logs.pop();
}

function getLogs(){
    return logs;
}

module.exports = {addLog,getLogs};
