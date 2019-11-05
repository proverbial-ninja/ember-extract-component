// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const cp = require('child_process')


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {



	let disposable = vscode.commands.registerCommand('extension.ember.extract', function () {

		let ecli = "./.ember-cli.js"
		//CHECK IF INSIDE EMBER CLI PROJECT
		if (fs.existsSync(ecli)) {
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				return; // No open text editor
			}

			let selection = editor.selection;
			let text = editor.document.getText(selection);

			if (!text) return vscode.window.showErrorMessage("No text Selected");

			let options = {
				prompt: "Component Name: ",
				placeHolder: "my-component"
			}

			vscode.window.showInputBox(options).then(v => {
				if (!v) return vscode.window.showErrorMessage("No component name, Please try again");
				//TODO: CHECK INPUT FOR SAPCES
				let value = v.replace(/\s+/g, '-').toLowerCase()
				vscode.window.showInformationMessage('We are creating your component');
				let folderPath = vscode.workspace.rootPath;


				//cp.exec('ember g component ' + value, (err, stdout, stderr) => {
				cp.exec("cd " + folderPath + '&& ember g component ' + value, (err, stdout, stderr) => {
					let filepath = folderPath + "/app/components/" + value + ".hbs";
					console.log("PADHHH :" + filepath);
					fs.writeFile(filepath, text, () => {

						vscode.window.showInformationMessage('Component has been created successfully');

						value = value.replace(/-/g, ' ');

						let output = value.replace(/(\w+)(?:\s+|$)/g, function (_, word) {
							return word.charAt(0).toUpperCase() + word.substr(1);
						});


						editor.edit(builder => builder.replace(selection, `<${output}/>`))
						vscode.workspace.openTextDocument(filepath).then(doc => {
							return vscode.window.showTextDocument(doc);

						});

					})

					if (err) {
						console.log('error: ' + err);
					}
				});





			})

		} else {
			return vscode.window.showErrorMessage("You have to be inside an ember-cli project to use this extension.")
		}


	});

	context.subscriptions.push(disposable);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
