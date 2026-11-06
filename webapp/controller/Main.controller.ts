import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import UIComponent from "sap/ui/core/UIComponent";
import Context from "sap/ui/model/Context";
import { SearchField$LiveChangeEvent } from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Main extends BaseController {
	onObjectListItemPress(oEvent: ListItemBase$PressEvent) {
		const pressedItem = oEvent.getSource();
		const context = pressedItem.getBindingContext() as Context;
		const desiredPath = (context).getPath() as string;
		// /ZEMPDATASet(...)
		const cleanPath = (desiredPath).substring(1);
		// ZEMPDATASet(...)
		const encodedPath = window.encodeURIComponent(cleanPath)
		// ZEMPDATASet(...)
		const router = UIComponent.getRouterFor(this);
		router.navTo("detail", {
			empId: encodedPath
		});
	}
	onSearchFieldLiveChange(oEvent: SearchField$LiveChangeEvent) {
		const filter = [];
		const query = oEvent.getParameter("newValue");
		if (query) {
			filter.push(new Filter("name", FilterOperator.Contains, query));
		}
		// get the list we want to filter
		const list = this.byId("idEmployeesList");
		// get binding (xml list with data "items")
		// getBinding(aggregation name)
		const binding = list?.getBinding("items") as ListBinding;
		binding?.filter(filter);
	}
	async onAddEmployeeButtonPress() {
		const oTransientModel = new JSONModel({
			ZempId: "",
			ZempName: "",
			Zposition: "",
			Zdepartment: "",
		});
		this.getView()?.setModel(oTransientModel, "newEmployee");
		await this.openDialog("com.myorg.myapp.view.fragment.CreateEmployee");
	}

	// async onAddEmployeeButtonPress() {
	// 	const oTransientModel = new JSONModel({
	// 		id: 6,
	// 		name: "",
	// 		position: "",
	// 		department: "",
	// 		attendance: [],
	// 	});
	// 	this.getView()?.setModel(oTransientModel, "newEmployee");

	// 	await this.openDialog("com.myorg.myapp.view.fragment.CreateEmployee");
	// }


	public onSaveButtonPress(): void {
		const oMainModel = this.getView()?.getModel() as ODataModel;
		if (!oMainModel) return;

		const oTransientModel = this.getView()?.getModel("newEmployee") as JSONModel;
		const oPayload = oTransientModel ? oTransientModel.getData() : {};

		this.getView()?.setBusy(true);
		oMainModel.create("/ZEMPDATASet", oPayload, {
			success: () => {
				this.getView()?.setBusy(false);
				MessageToast.show("Employee created successfully!");
				oMainModel.refresh(true);
				this.closeDialog();
			}, error: (oError: any) => {
				this.getView()?.setBusy(false);
				let sMsg = "Failed to create employee";
				try {
					const oErrObj = JSON.parse(oError.responseText);
					sMsg = oErrObj.error?.message?.value || sMsg;
				} catch (e) { }
				MessageBox.error(sMsg);
				this.closeDialog();
			}
		})
	}
	onCloseButtonPress() {
		this.closeDialog();
	}
}
