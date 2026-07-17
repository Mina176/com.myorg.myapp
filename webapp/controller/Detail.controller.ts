import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import Route, { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import History from "sap/ui/core/routing/History";

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Detail extends Controller {

    onInit(): void {
        const router = UIComponent.getRouterFor(this);
        (router.getRoute("detail") as Route).attachPatternMatched(this.onObjectMatched, this);
        // looks inside manifest.json in routes a route named "detail" (manifest.json/routes/name:detail)
    }
    // this method executes everytime user lands on this page 
    onObjectMatched(event: Route$PatternMatchedEvent): void {
        const encodedPath = (event.getParameter("arguments") as any).empId
        // employees%2F0
        const decodedPath = window.decodeURIComponent(encodedPath);
        // employees/0
        this.getView()?.bindElement({
            path: "/" + decodedPath,
            // /employees/0
            model: "employeeModel"
        });
    }

    onPageNavButtonPress(): void {
        const history = History.getInstance();
        const previousHash = history.getPreviousHash();

        // "!=" treats [0,"",false] are equal
        // "!==" treats [0,"",false] are not equal
        if (previousHash !== undefined) {
            // user came from the app normally 
            window.history.go(-1);
        } else {
            // user came from external website fallback to main view
            const router = UIComponent.getRouterFor(this);
            router.navTo("main", {}, true);
            // set bReplace (replace history) true reset pages stack     
        }
    }

};