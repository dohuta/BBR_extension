/**
 * for study purposes
 * created by Dohuta - 2018
 * feedback: huynh.dohuta@gmail.com
 */

// -- declaration --
const StorageArea = chrome.storage.local,
    waittime = 500;
let captcha = document.querySelector('span[id*="Capcha"]'),
    txtCaptcha = document.querySelector('input[id*="Captcha"]'),
    btnVerify = document.querySelector('input[id*="XacNhan"]'),
    txtAccID = document.querySelector('input[id*="TaiKhoa"]'),
    txtAccPWD = document.querySelector('input[id*="MatKhau"]'),
    btnSubmit = document.querySelector('input[type="submit"]'),
    loggedIn = document.querySelector('span[id*="NguoiDung"]').innerText != "",
    btbLuu = document.querySelector('#btnLuu'),
    current = window.location.href,
    url = "http://shanghai271.azurewebsite.net/api/values/",
    home = "http://daotao.huflit.edu.vn/",
    dangky = "http://daotao.huflit.edu.vn/Default.aspx?page=dkmonhoc",
    checked = false;

/**
 * Bypass captcha
 */
const autoCaptcha = () => {
    if (loggedIn && !captcha) return;
    else {
        if (captcha) {
            txtCaptcha.value = captcha.textContent;
            setTimeout(() => {
                btnVerify.click();
            }, waittime);
        }
    }
};

/**
 * Auto login
 */
const autoLogin = () => {
    if (loggedIn) return;
    else if (checked) {
        if (txtAccID && txtAccPWD) {
            StorageArea.get('data', (result) => {
                txtAccID.value = result.data.id;
                txtAccPWD.value = result.data.pwd;
                setTimeout(() => {
                    btnSubmit.click();
                }, waittime);
            });
        }
    }
};

/**
 * Redirect to dangky page
 */
const autoRedirect = () => {
    if (checked && current != dangky) {
        window.location.href = dangky;
    }
};


// -- IIFE function --
(function init() {
    StorageArea.get('checked', (result) => {
        checked = result.checked;
        autoCaptcha();
        if (checked && !loggedIn) {
            autoLogin();
        }
        if (loggedIn) {
            autoRedirect();
        }
    });
})();