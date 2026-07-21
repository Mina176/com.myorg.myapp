import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import UIComponent from "sap/ui/core/UIComponent";
import Context from "sap/ui/model/Context";
import Event from "sap/ui/base/Event";
import { SearchField$LiveChangeEvent } from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Main extends BaseController {
	onStandardListItemPress(oEvent: ListItemBase$PressEvent) {
		const pressedItem = oEvent.getSource();
		const context = pressedItem.getBindingContext("employeeModel") as Context;
		const desiredPath = (context).getPath() as string;
		// /employees/0
		const cleanPath = (desiredPath).substring(1);
		// employees/0
		const encodedPath = window.encodeURIComponent(cleanPath)
		// employees%2F0
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
}
