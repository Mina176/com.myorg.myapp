import UIComponent from "sap/ui/core/UIComponent";
import Route, { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import History from "sap/ui/core/routing/History";
import BaseController from "./BaseController";
import MessageBox from "sap/m/MessageBox";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Context from "sap/ui/model/odata/v2/Context";
import Router from "sap/f/routing/Router";

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Detail extends BaseController {

    onInit(): void {
        const router = UIComponent.getRouterFor(this);
        (router.getRoute("detail") as Route).attachPatternMatched(this.onObjectMatched, this);
        // looks inside manifest.json in routes a route named "detail" (manifest.json/routes/name:detail)
    }
    // this method executes everytime user lands on this page 
    onObjectMatched(event: Route$PatternMatchedEvent): void {
        const encodedPath = (event.getParameter("arguments") as any).empId
        const decodedPath = window.decodeURIComponent(encodedPath);
        // ZEMPDATASet('00001000')
        this.getView()?.bindElement({
            path: "/" + decodedPath,
            // /employees/0
            // model: "employeeModel"
        });
    }

    onPageNavButtonPress(): void {
        const history = History.getInstance();
        const previousHash = history.getPreviousHash() as string;

        // "!=" treats [0,"",false] are equal, because one equal sign does not check data types
        // "!==" treats [0,"",false] are not equal, becuase data types are different
        if (previousHash !== undefined) {
            // user came from the app normally 
            window.history.go(-1);
        } else {
            // user came from external website fallback to main view
            const router = UIComponent.getRouterFor(this) as Router;
            router.navTo("main", {}, true);
            // set bReplace (replace history) true reset pages stack     
        }
    }

    public onDeleteEmployeeButtonPress() {
        const context = this.getView().getBindingContext() as Context;
        const sPath = context.getPath() as string;
        // "/ZEMPDATASet('00001000')"
        MessageBox.confirm('Are you sure you want to delete this Employee ?', {
            title: "Confirm Deletion",
            onClose: (action: string) => {
                if (action === MessageBox.Action.OK)
                    this.deleteEmployeeByPath(sPath);
            }
        })
    }

    private deleteEmployeeByPath(sPath: string) {
        const oMainModel = this.getView()?.getModel() as ODataModel;
        if (!oMainModel) return;
        oMainModel.remove(sPath, {
            success: () => UIComponent.getRouterFor(this).navTo("main", {}, true)
            ,
            error: (oError: any) => MessageBox.error(`Failed to delete employee: ${oError.message}`)

        });
    }
};