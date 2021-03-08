
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { startSignalHandler } from './editors/signalsEditor';
import { startMsgHandler } from './editors/messageEditor';
import { startNetworkNodesHandler } from './editors/nodeEditor';
import { DataProvider, TreeViewItem } from "./treeviewDataprovider";
import { startAttributeHandler } from "./attributeProvider";

export function activate(context: vscode.ExtensionContext) {
	
	let totalPanels:string[] = [];


	let disposable = vscode.commands.registerCommand('vscode-plugin-demo.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from demo-test!');
	});
	context.subscriptions.push(disposable);
	

	// let dataProvider: any;
	// const dataProvider = new DataProvider(path.join(context.extensionPath, 'db_output'));
	// vscode.window.registerTreeDataProvider('TreeView', dataProvider);
	let dbcObject = JSON.parse(fs.readFileSync(path.join(context.extensionPath, 'inputFile.json'), 'utf-8'));
	const dataProvider = new DataProvider(path.join(context.extensionPath, 'db_output'), dbcObject);
	vscode.window.registerTreeDataProvider('TreeView', dataProvider);

	vscode.commands.registerCommand('extension.openSignalEditor', (moduleName, candb, isPreview=false) => {
		startSignalHandler(context, moduleName, candb, isPreview);
	});

	vscode.commands.registerCommand('extension.openMessageEditor', (moduleName, candb) => {
		console.log(moduleName);
		startMsgHandler(context, moduleName, candb);
	});

	vscode.commands.registerCommand('extension.openNetworkNodesEditor', (moduleName, candb) => {
		startNetworkNodesHandler(context, moduleName, candb);
	});

	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-plugin-demo.loadJSONFile", () => {
			vscode.window.showOpenDialog({
				canSelectMany: false,
				canSelectFolders: false,
				canSelectFiles: true,
				filters: {
					'JSON File': ['json']
				},
				title: 'Select JSON File',
				defaultUri: vscode.Uri.parse('/'+ context.extensionPath)
			}).then(fileUri => {
				if (fileUri && fileUri[0]) {
					let dbcObject = JSON.parse(fs.readFileSync(fileUri[0].fsPath, 'utf-8'));
					const dataProvider = new DataProvider(path.join(context.extensionPath, 'db_output'), dbcObject);
					vscode.window.registerTreeDataProvider('TreeView', dataProvider);
				}
			});
		})
	);
	
	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-plugin-demo.saveJSONFile", () => {
			jsonData = dataProvider.saveJsonFile()
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-plugin-demo.add_treeviewitems", async (rootName: TreeViewItem) => {
			dataProvider.addItem(rootName.label);
		})
	);	

	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-plugin-demo.refresh_treeview" , () => {
			dataProvider.refresh();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-plugin-demo.openAttributeDefinitions", () => {
			startAttributeHandler(context, dataProvider.candb_);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-plugin-demo.delete_treeview", async (itemName: TreeViewItem) => {
			const confirm = await vscode.window.showQuickPick(["delete", "cancel"], {
				placeHolder: "Do you want to delete item?"
			});
			if (confirm === "delete") {
				dataProvider.deleteItem(itemName);
			}
		})
	);

}

// this method is called when your extension is deactivated
export function deactivate() {}
