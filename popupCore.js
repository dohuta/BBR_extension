/**
 * for study purposes
 * created by Dohuta - 2018
 * feedback: huynh.dohuta@gmail.com
 */

const StorageArea = chrome.storage.local,
    xmlhttp = new XMLHttpRequest(),
    current = new Date(),
    //url = 'https://cors-anywhere.herokuapp.com/shanghai271.azurewebsites.net/api/values/',
    port = chrome.extension.connect({ name: "271" });
let checked = false,
    message;

const setEvent = () => {
    // message
    port.onMessage.addListener(function(msg) {
        let accID = document.querySelector('#accID').value;
        let accPWD = document.querySelector('#accPWD').value;
        msg.data = { id: accID, pwd: accPWD };
        //throwback(msg);
    });

    // onfocus input -> clear annouce
    document.querySelectorAll('.me-input').forEach((element) => {
        element.addEventListener('focus', () => {
            document.querySelector('#announce').innerHTML = '';
        });
    });

    // save clicked
    document.querySelector('#btn-save').addEventListener('click', () => {
        let accID = document.querySelector('#accID').value;
        let accPWD = document.querySelector('#accPWD').value;
        if (accID != undefined && accPWD != undefined) {
            let data = { id: accID, pwd: accPWD };
            StorageArea.set({ 'data': data });
            document.querySelector('#announce').innerHTML = "Saved!";
            port.postMessage(data);
        } else {
            document.querySelector('#announce').innerHTML = "Can't save!";
        }
    });

    // toggle swiched
    document.querySelector('#btn-toggle').addEventListener('change', () => {
        changeState();
        loadData();
        StorageArea.set({ 'checked': checked });
    });
};

const changeState = () => {
    checked = document.querySelector('#btn-toggle').checked;
    if (checked) {
        document.querySelector('#accID').disabled = false;
        document.querySelector('#accPWD').disabled = false;
        document.querySelector('#btn-save').disabled = false;
    } else {
        document.querySelector('#accID').disabled = true;
        document.querySelector('#accPWD').disabled = true;
        document.querySelector('#btn-save').disabled = true;
    }
};

const loadData = () => {
    StorageArea.get('data', (result) => {
        if (result.data != undefined) {
            document.querySelector('#accID').value = result.data.id;
            document.querySelector('#accPWD').value = result.data.pwd;
        }
    });
};

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

(function init() {
    setEvent();
    StorageArea.get('checked', (result) => {
        if (result.checked) {
            checked = result.checked;
            document.querySelector('#btn-toggle').checked = checked;
            changeState();
        }
    });
    loadData();
})();