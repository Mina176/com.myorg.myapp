import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";

/**
 * @namespace com.myorg.myapp.controller
 */
export default class App extends BaseController {
	public onInit(): void {
		// apply content density mode to root view
		this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

		const model = new JSONModel();
		model.loadData("model/employees.json");
		this.getView().setModel(model);
	}
}
