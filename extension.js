// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
* @param {vscode.ExtensionContext} context
*/
function activate(context) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Zambra\'s extension is now active!');
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let forceApexDeploy = vscode.commands.registerCommand('extension.forceapexdeploy', function () {
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
		term.sendText(
			'sfdx force:source:deploy'+
			' -m ApexClass:' + DeployApexClassInput.ApexClassName +
			' -l RunSpecifiedTests -r \"' + DeployApexClassInput.ApexTestClassName  + '\"'
			);
		};
		
		var getApexClassName = async () => {
			
			const className = await vscode.window.showInputBox({
				placeHolder: 'Enter Apex class name',
				prompt: 'The Apex class name'
			});
			
			if ( className !== undefined ){
				DeployApexClassInput.ApexClassName = className;
				getApexTestClassName();
			}
		};
		
		var getApexTestClassName = async () => {
			
			const testClass = await vscode.window.showInputBox({
				placeHolder: 'Enter Apex test class name',
				prompt: 'The Apex test class name'
				
			});
			
			if ( testClass !== undefined ){
				DeployApexClassInput.ApexTestClassName = testClass;
				showTerminalDeployApexClass();
			}
		};
		context.subscriptions.push(forceApexDeploy);

		let forceLwcDeploy = vscode.commands.registerCommand('extension.forceLwcDeploy', function () {
			// Display a message box to the user
			// vscode.window.showInformationMessage('Hello World from ext!');
			getLwcName();
		});
	
		var DeployLwcName = '';
		
		var showTerminalDeployLwc = function () {
			let term = vscode.window.createTerminal('deploylwc');
			term.show();
			term.sendText(
				'sfdx force:source:deploy'+
				' -m LightningComponentBundle:' + DeployLwcName
				);
			};
			
			var getLwcName = async () => {
				
				const lwcName = await vscode.window.showInputBox({
					placeHolder: 'Enter Lightning Web Component name',
					prompt: 'The Lightning Web Component name'
				});
				
				if ( lwcName !== undefined ){
					DeployLwcName = lwcName;
					showTerminalDeployLwc();
				}
			};
			
			context.subscriptions.push(forceLwcDeploy);
	}
	exports.activate = activate;
	
	// this method is called when your extension is deactivated
	function deactivate() {}
	
	module.exports = {
		activate,
		deactivate
	}
	