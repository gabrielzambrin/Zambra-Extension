// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fetch = require("node-fetch");
const jsonminify = require("jsonminify");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
* @param {vscode.ExtensionContext} context
*/
function activate(context) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Zambra\'s extension is now active!');
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	
	//#region extension.forceapexdeploy
	
	let forceApexDeploy = vscode.commands.registerCommand('zambra-s.forceapexdeploy', function () {
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from ext!');
		getApexClassName();
	});
	
	var DeployApexClassInput = {
		ApexClassName: '',
		ApexTestClassName: ''
	};
	
	var showTerminalDeployApexClass = function () {
		let term = vscode.window.createTerminal('deployApexClass');
		term.show();
		if(DeployApexClassInput.ApexClassName !== undefined && DeployApexClassInput.ApexClassName !== ''){
			let classes = DeployApexClassInput.ApexClassName.split(';');
			let commandSF = 'sf project deploy start -m ApexClass:' + classes.join(' ApexClass:');
			if(DeployApexClassInput.ApexTestClassName !== undefined && DeployApexClassInput.ApexTestClassName !== ''){
				let classesTest = DeployApexClassInput.ApexTestClassName.split(';');
				commandSF += ' -l RunSpecifiedTests --tests ' + classesTest.join(' ')  + '';
			}
			term.sendText(commandSF);
		}else{
			showMessage('error', 'Please enter Apex classes names.');
			return;
		}
	};
	
	var getApexClassName = async () => {
		
		const className = await vscode.window.showInputBox({
			placeHolder: 'Enter Apex classes names',
			prompt: 'The Apex classes names'
		});
		
		if ( className !== undefined && className !== '' ){
			DeployApexClassInput.ApexClassName = className;
			getApexTestClassName();
		}else{
			showMessage('error', 'Please enter Apex classes names.');
			return;
		}
	};
	
	var getApexTestClassName = async () => {
		
		const testClass = await vscode.window.showInputBox({
			placeHolder: 'Enter Apex tests classes names',
			prompt: 'The Apex tests classes names'
			
		});
		
		if ( testClass !== undefined ){
			DeployApexClassInput.ApexTestClassName = testClass;
			showTerminalDeployApexClass();
		}
	};
	
	//#endregion
	
	//#region JSON2Apex
	
	let json2apexCommand = vscode.commands.registerCommand("zambra-s.json2apex",function() {
		json2apex();
	});
	const outputTerminal = vscode.window.createOutputChannel("Zambra's");
	async function json2apex() {
	
		const editor = vscode.window.activeTextEditor;
		let className;
		let auraEnabled;
		let params = {};

		let userSelection = editor.document.getText(editor.selection);
		if(isInvalidSelection(userSelection)){
			showMessage('error', 'Please select a valid JSON content and try again');
			return;
		} 
		className = await vscode.window.showInputBox({
			placeHolder: "Enter the generated class name"
		});
		if(className === undefined)return;
		if(className === ''){
			showMessage('error', 'Class name cannot be empty');
			return;
		}
		auraEnabled = await vscode.window.showInputBox({
			placeHolder: "Use @AuraEnabled? (Y/N - Default N)"
		});
		try {
			if(auraEnabled === undefined)return;
			let auraOption = validateInputs(auraEnabled, 'aura');
			auraEnabled = auraOption.auraEnabled;
		} catch (error) {
			showMessage('error', error.message);
			return;
		}
		
		outputTerminal.show();
		params.className = className;
		params.auraEnabled = auraEnabled;
		params.userSelection = userSelection;
		outputTerminal.appendLine(formatDate(new Date())+'Process started. Wait...')
		submitForConversion(params,editor).catch((e)=>{
			showMessage('error', `Something went wrong...${e.message}`);
		});
	}
	
	async function submitForConversion(params,editor){
		let response = await fetch(`https://gabrielzambrin-dev-ed.my.salesforce-sites.com/Zambras/services/apexrest/JSON2Apex?className=${params.className}&auraEnabled=${params.auraEnabled}`, {
		method: 'POST',
		mode: 'cors',
		body: params.userSelection,
		headers: {
			'Content-Type': 'application/json',
			'Accept':'*/*'
		}
	}).catch((e)=>{
		showMessage('error', `Something went wrong...${e.message}`);
	});
	try {
		if(response.status == 200){
			var treatedResponse = await response.json();
		}else{
			outputTerminal.appendLine(formatDate(new Date())+'Error!');
			throw new Error('JSON conversion failed!');
		}
	} catch (e) {
		showMessage('error', `Something went wrong... ${e.message}`);
		return;
	}
	outputTerminal.appendLine(formatDate(new Date())+'Converting data...');
	if (editor) {
		//foco no editor principal do vscode
		editor.edit((selectedText) => {
			selectedText.replace(editor.selection, treatedResponse);
		});
		// Obter a posição da primeira linha selecionada
		const firstLine = editor.selection.start.line;
		// scroll editor para a primeira linha selecionada
		editor.revealRange(new vscode.Range(firstLine, 0, firstLine, 0), vscode.TextEditorRevealType.Default);
		outputTerminal.appendLine(formatDate(new Date())+'Done!');
		showMessage('success', 'JSON conversion completed successfully');
		vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
	}
	}
	function showMessage(context, content){
		switch (context) {
			case 'success':
			vscode.window.showInformationMessage(content);
			break;
			case 'warning':
			vscode.window.showWarningMessage(content);
			break;
			case 'error':
			vscode.window.showErrorMessage(content);
			break;
			default:
			break;
		}
	}
	function isInvalidSelection(input){
		if(input == '') return true;
		try {
			JSON.parse(input);
		return false;
		} catch (e) {
			return true;
		}
	}
	function validateInputs(value, key){
		value = value.toUpperCase();
		let validInputs = {};
		
		if(key =='aura'){
			if(value == '' || value == 'N'){
				validInputs.auraEnabled = false
			}else if(value == 'Y'){
				validInputs.auraEnabled = true
			}else{
				throw new Error('Invalid input for auraEnabled. Use Y, N or Enter for default (N)');
			}
		}
		return validInputs;
	}

	function padToDigits(num,dig) {
		return num.toString().padStart(dig, '0');
	  }
	  
	function formatDate(date) {
		return ('[' +
		  [
			date.getFullYear(),
			padToDigits(date.getMonth() + 1,2),
			padToDigits(date.getDate(),2),
		  ].join('-') +
		  ' ' +
		  [
			padToDigits(date.getHours(),2),
			padToDigits(date.getMinutes(),2),
			padToDigits(date.getSeconds(),2),
		  ].join(':') + '.' + padToDigits(date.getMilliseconds(),3) +
		'] ');
	  }

//#endregion

//#region minify text

let minifyText = vscode.commands.registerCommand('zambra-s.minifyText', () => {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const selection = editor.selection;
		const text = editor.document.getText(selection);
		try {
			const minifiedText = jsonminify(text);
			editor.edit((editBuilder) => {
				editBuilder.replace(selection, minifiedText);
			});
		} catch (error) {
			vscode.window.showErrorMessage('Erro ao minificar o texto: ' + error.message);
		}
	}
});

//#endregion 

context.subscriptions.push(forceApexDeploy,json2apexCommand,minifyText);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
