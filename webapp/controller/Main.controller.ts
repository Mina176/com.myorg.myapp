import ListItemBase, { ListItemBase$PressEvent } from "sap/m/ListItemBase";
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
import Event from "sap/ui/base/Event";
import ToggleButton from "sap/m/ToggleButton";

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Main extends BaseController {
	private bEdit: boolean = false;
	private sPath: string = "";

	onSearchFieldLiveChange(oEvent: SearchField$LiveChangeEvent) {
		const filter = [];
		const query = oEvent.getParameter("newValue");
		if (query) {
			filter.push(new Filter("ZempName", FilterOperator.Contains, query));
		}
		// get the list we want to filter
		const list = this.byId("idEmployeesList");
		// get binding (xml list with data "items")
		// getBinding(aggregation name)
		const binding = list?.getBinding("items") as ListBinding;
		binding?.filter(filter);
	}

	onEditModeToggle(oEvent: Event) {
		const oSource = oEvent.getSource() as ToggleButton;
		this.bEdit = oSource.getPressed();
	}

	onItemPress(oEvent: ListItemBase$PressEvent) {
		const pressedItem = oEvent.getSource() as ListItemBase;
		const context = pressedItem.getBindingContext() as Context;

		if (this.bEdit) {
			this.openForm(context);
		} else {
			const sKey = window.encodeURIComponent(context.getPath().substring(1));
			// ZEMPDATASet(...)
			UIComponent.getRouterFor(this).navTo("detail", {
				empId: sKey
			});
		}
	}

	private async openForm(context?: Context) {
		this.sPath = context ? context.getPath() : "";

		const oData = context ? { ...context.getObject() } : { ZempId: "", ZempName: "", Zposition: "", Zdepartment: "" };
		this.getView()?.setModel(new JSONModel(oData), "newEmployee");
		await this.openDialog("com.myorg.myapp.view.fragment.CreateEmployee");
	}

	async onAddEmployeeButtonPress() {
		this.openForm();
	}

	async onEditPress() {
		const oTransientModel = this.getView()?.getModel("newEmployee") as JSONModel;

		await this.openDialog("com.myorg.myapp.view.fragment.CreateEmployee");
	}

	public onSaveButtonPress(): void {
		const oMainModel = this.getView()?.getModel() as ODataModel;
		const oData = (this.getView()?.getModel("newEmployee") as JSONModel).getData();

		const mCallbacks = {
			success: () => {
				oMainModel.refresh(true);
				this.closeDialog();
			}, error: (oError: ErrorCallback) => {
				alert(oError);
			}
		};

		if (this.sPath) {
			// we have path, so we are updating
			oMainModel.update(this.sPath, oData, mCallbacks);
		} else {
			oMainModel.create("/ZEMPDATASet", oData, mCallbacks);
		}

	}
	onCloseButtonPress() {
		this.closeDialog();
	}
}
