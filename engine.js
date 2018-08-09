/**
 * for study purposes
 * created by Dohuta - 2018
 * feedback: huynh.dohuta@gmail.com
 */

const StorageArea = chrome.storage.local,
    waittime = 500;
let captcha = document.querySelector('span[id*="Capcha"]'),
    txtCaptcha = document.querySelector('input[id*="Captcha"]'),
    btnVerify = document.querySelector('input[id*="XacNhan"]'),
    txtAccID = document.querySelector('input[id*="TaiKhoa"]'),
    txtAccPWD = document.querySelector('input[id*="MatKhau"]'),
    btnSubmit = document.querySelector('input[type="submit"]'),
    unloggedin = ((document.querySelector('a[id*="LogOut"]')) || (document.querySelector('a[id*="DangXuat"]'))).innerHTML === "Đăng Nhập",
    home = "http://daotao.huflit.edu.vn/",
    checked = false;

const autoCaptcha = () => {
    if (!unloggedin) return;
    if (checked) {
        if (captcha) {
            txtCaptcha.value = captcha.textContent;
            setTimeout(() => {
                btnVerify.click();
            }, waittime);
        } else {
            window.location.href = home;
        }
    } else if (captcha) {
        txtCaptcha.value = captcha.textContent;
        setTimeout(() => {
            btnVerify.click();
        }, waittime);
    } else if (!captcha && !txtAccID) {
        window.location.href = home;
    }
};

const autoLogin = () => {
    if (!unloggedin) return;
    if (checked) {
        if (txtAccID && txtAccPWD) {
            StorageArea.get('obj', (result) => {
                txtAccID.value = result.obj.id;
                txtAccPWD.value = result.obj.pwd;
                setTimeout(() => {
                    btnSubmit.click();
                }, waittime);
            });
        }
    }
};

(function init() {
    if (unloggedin) {
        autoCaptcha();
        StorageArea.get('checked', (result) => {
            if (result.checked) {
                checked = result.checked;
                autoLogin();
            }
        });
    }
})();