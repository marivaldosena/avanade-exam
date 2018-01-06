var assert = require('assert');
var pixelmatch = require('pixelmatch');
var PNG = require('pngjs').PNG;
var fs = require('fs');
var path = require('path');
var url = 'http://localhost:4200';
const randNumber = 

Math.floor(Math.random() * 10000) + 1000;

describe('Final Exam - ', function() {

	it('Teste de fumaça: pelo menos este teste tem que rodar', function() {
		assert(true, true)
	});

	describe('Código HTML&CSS: ', function() {

		it('O layout desktop de login deve ser igual ao gabarito', function () {
			layoutTestRunner("login-desktop", 800, 600, url+'/login')
		});

		it('O layout mobile de login deve ser igual ao gabarito', function () {
				layoutTestRunner("login-mobile", 376, 667, url+'/login')
		});

		it('O layout desktop de cadastro deve ser igual ao gabarito', function () {
			layoutTestRunner("signup-desktop", 800, 600, url+'/signup')
		});

		it('O layout mobile de cadastro deve ser igual ao gabarito', function () {
				layoutTestRunner("signup-mobile", 376, 667, url+'/signup')
		});

	});

	describe('Cadastramento de usuário: ', function() {
		it('Deve conseguir extrair listagem de estados da api', function() {
			browser.url(url+'/signup');
			browser.waitForVisible('#main');
			browser.click('[name="state"]');
			browser.waitUntil(function() {
				return browser.elements('[name="state"] option').value.length > 1;
			}, 5000, 'Demora para adquirir dados assincronos de estado');
			assert.equal(28, browser.elements('[name="state"] option').value.length);
		});

		it('Deve conseguir extrair listagem de cidades da api', function() {
			browser.url(url+'/signup');
			browser.waitForVisible('#main');
			browser.click('[name="state"]');
			browser.waitUntil(function() {
				return browser.elements('[name="state"] option').value.length > 1;
			}, 5000, 'Demora para adquirir dados assincronos de estado');
			browser.click('[name="state"] option[value="MG"]');
			browser.click('[name="city"]');
			browser.waitUntil(function() {
				return browser.elements('[name="city"] option').value.length > 1
			}, 5000, 'Demora para adquirir dados assincronos de cidade');
			assert.equal(854, browser.elements('[name="city"] option').value.length);
		});

		it('Deve conseguir realizar um cadastro com dados válidos', function() {
			browser.url(url+'/signup');
			browser.waitForVisible('#main');
			browser.element('[name="username"]').setValue('test'+randNumber);
			browser.element('[name="email"]').setValue('test+'+randNumber+'@test.com');
			browser.element('[name="password"]').setValue(randNumber);
			browser.click('[name="state"]');
			browser.waitUntil(function() {
				return browser.elements('[name="state"] option').value.length > 1;
			}, 5000, 'Demora para adquirir dados assincronos de estado');
			browser.click('[name="state"] option[value="SP"]');
			browser.click('[name="city"]');
			browser.waitUntil(function() {
				return browser.elements('[name="city"] option').value.length > 1
			}, 5000, 'Demora para adquirir dados assincronos de cidade');
			browser.click('[name="city"] option[value="São Paulo"]');
			browser.click('[name="accepts_newsletters"]');
			browser.click('button[type="submit"]');
			browser.waitForVisible('.modal');
			assert.equal("test"+randNumber, browser.element('#username').getText());
			assert.equal("test+"+randNumber+"@test.com", browser.element('#email').getText());
			assert.equal("SP", browser.element('#state').getText());
			assert.equal("São Paulo", browser.element('#city').getText());
			assert.equal("true", browser.element('#accepts_newsletters').getText());
		});

		it('Deve receber mensagens de erro de validação', function() {
			browser.url(url+'/signup');
			browser.waitForVisible('#main');
			browser.click('[name="username"]');
			browser.click('[name="email"]');
			browser.click('[name="password"]');
			browser.click('[name="state"]');
			browser.click('[name="city"]');
			browser.click('[name="username"]');
			assert.equal(5, browser.elements('.form-text.text-danger').value.length);
		});
	});

	describe('Tentativas de Login: ', function() {
		it('Deve conseguir logar com dados válidos', function() {
			browser.url(url+'/login');
			browser.waitForVisible('#main');
			browser.element('[name="username"]').setValue('test'+randNumber);
			browser.element('[name="password"]').setValue(randNumber);
			browser.click('button[type="submit"]');
			browser.waitForVisible('.modal');
			assert.equal("test"+randNumber, browser.element('#username').getText());
			assert.equal("test+"+randNumber+"@test.com", browser.element('#email').getText());
			assert.equal("SP", browser.element('#state').getText());
			assert.equal("São Paulo", browser.element('#city').getText());
			assert.equal("true", browser.element('#accepts_newsletters').getText());
		});

		it('Deve receber mensagem de erro com dados inválidos', function() {
			browser.url(url+'/login');
			browser.waitForVisible('#main');
			browser.click('[name="username"]');
			browser.click('[name="password"]');
			browser.click('[name="username"]');
			assert.equal(2, browser.elements('.form-text.text-danger').value.length);
		});
	});
});

function layoutTestRunner(assertion_file, width, height, url) {
	browser.setViewportSize({
	    width: width,
	    height: height
	});
	browser.url(url);
	browser.waitForVisible('#main');
	var screenshotName = './screenshot-' + assertion_file + ".png"
	browser.saveScreenshot(screenshotName);
	var os = process.platform;
	var img1 = PNG.sync.read(fs.readFileSync(screenshotName));
	var img2 = PNG.sync.read(fs.readFileSync('./test/' + os + "-" + assertion_file + '.png'));
    var diff = new PNG({width: img1.width, height: img1.height});
    var pixelsDiff = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});
    diff.pack().pipe(fs.createWriteStream('diff-' + assertion_file + '.png'));
	assert.equal(pixelsDiff, 0);
}
