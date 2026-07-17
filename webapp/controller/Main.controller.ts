import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import UIComponent from "sap/ui/core/UIComponent";
import Context from "sap/ui/model/Context";

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
}
