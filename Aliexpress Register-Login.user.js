// ==UserScript==
// @name         Aliexpress Register/Login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматический вход/регситрация на Алиэкспресс
// @author       Andronio
// @homepage     https://github.com/Andronio2/Aliexpress-Register-Login
// @supportURL   https://github.com/Andronio2/Aliexpress-Register-Login
// @updateURL    https://github.com/Andronio2/Aliexpress-Register-Login/raw/master/Aliexpress%20Register-Login.user.js
// @downloadURL  https://github.com/Andronio2/Aliexpress-Register-Login/raw/master/Aliexpress%20Register-Login.user.js
// @match        https://login.aliexpress.com/*
// @match        https://login.aliexpress.ru/*
// @grant        none

// ==/UserScript==

(function() {
    'use strict';

    var div = document.createElement('div');
    div.className = 'regavhod-box';

    div.innerHTML += `
    <input type="text" id="namepass"></br>
    <input type="button" id="rega" class="regavhod-btn" value="Рега">
    <input type="button" id="vhod" class="regavhod-btn" value="Вход">
    `;

// Стили
    var styles = `
    .regavhod-box {
    position: fixed;
    top: 0;
    right: 0;
    background: white;
    box-shadow: 1px -1px 4px 1px;
    padding: 10px 20px;
    z-index:9999;
    }

    .regavhod-btn {
    display: inline-block;
    padding: 5px 10px;
    margin-right:auto;
    cursor:pointer;
    }`

    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.append(styleSheet)
    document.body.append(div);

    let btn1 = document.getElementById("rega");
    let btn2 = document.getElementById("vhod");
    btn1.addEventListener('click', regaFunc);
    btn2.addEventListener('click', vhodFunc);
    let mytext = document.getElementById("namepass");
    mytext.addEventListener('keydown', event => {
        if (event.keyCode == "13") {
            if (event.code == "Enter" && !event.shiftKey) document.getElementById('vhod').click();
            if (event.code == "NumpadEnter" || event.code == "Enter" && event.shiftKey)  document.getElementById('rega').click();
        }
    });
    mytext.focus();

	// Функция регистрации
	function regaFunc () {
		let namepass = document.getElementById("namepass");
		let mass;

		mass = parseString(namepass.value);
		if (mass) {
			document.querySelectorAll(".next-tabs-tab")[0].click();
			let email = document.querySelector(".email");
			let pass = document.querySelector(".password");
			email.setAttribute("value", mass[0]);
			email.dispatchEvent(new Event("change", {bubbles: true}));
			email.dispatchEvent(new Event("blur", {bubbles: true}));

			let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
			nativeInputValueSetter.call(pass, mass[1]);
			pass.dispatchEvent(new Event('change', {bubbles: true}));
			pass.dispatchEvent(new Event('blur', {bubbles: true}));
			setTimeout(waitReady, 200);
		} else alert("Нет логина");
	}


	// Ждем проверки email при реге
	let timeout = 50;
	function waitReady() {
		if (document.querySelector(".email-checking")) {
			if (--timeout) return setTimeout(waitReady, 200);
			else return;
		}
		timeout = 50;
		document.querySelector(".submit").click();
	}

	// Функция входа
	function vhodFunc () {
		let namepass = document.getElementById("namepass");
		let mass;

		mass = parseString(namepass.value);
		if (mass) {
			document.querySelectorAll(".next-tabs-tab")[1].click();
			let signName = document.getElementById("fm-login-id");
			let signPass = document.getElementById("fm-login-password");
			let enterButton = document.querySelector(".fm-button.fm-submit.password-login");
			signPass.value = mass[1];
			signName.value = mass[0];
			enterButton.click();
			setTimeout(checkSlider, 1000);
		} else alert("Нет логина");
	}

	function parseString(str) {
		if (str == "") return null;
		if (/\w+@[\w\.]+\.\w+\t\w+/.test(str)) {
			return str.split('\t');
		} else if (/\w+@[\w\.]+\.\w+:\w+/.test(str)) {
			return str.split(':');
		} else return null;
	}

	// Проверяем слайдер, если есть, то обновляем и вход
	let tryAmount = 20; // количество попыток
	function checkSlider () {
		if (document.getElementById('nocaptcha-password').clientHeight && --tryAmount) {
			let inp = document.getElementById("fm-login-id");
            inp.value += ' ';
			inp.dispatchEvent(new Event('change'));
			inp.dispatchEvent(new Event('input'));
			inp.dispatchEvent(new Event('blur'));
			setTimeout(checkSlider, 200);
		} else document.querySelector(".fm-button.fm-submit.password-login").click();
	}
})();
