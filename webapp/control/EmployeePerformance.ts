import RatingIndicator, { RatingIndicator$LiveChangeEvent } from "sap/m/RatingIndicator";
import Control from "sap/ui/core/Control"
import { MetadataOptions } from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace com.myorg.myapp.control
 */

export default class EmployeePerformance extends Control {


    static readonly metadata: MetadataOptions = {
        properties: {
            value: {
                type: "float",
                defaultValue: 0.0
            }
        },
        aggregations: {
            _performance: {
                type: "sap.m.RatingIndicator",
                multiple: false,
                visibility: "hidden"
            }
        },
        events: {
            change: {
                parameters: {
                    "value": "float"
                }
            }
        }
    }
    init(): void {
        const rating = new RatingIndicator({
            value: this.getValue(),
            iconSize: "1.6rem",
            liveChange: this._onRate.bind(this)
        });
        rating.addStyleClass("sapUiTinyMarginTopBottom");
        this.setAggregation("_performance", rating);
    }
    private _onRate(event: RatingIndicator$LiveChangeEvent): void {
        const value = event.getParameter("value");
        this.setProperty("value", value, true);
    }
    setValue(value: number): EmployeePerformance {
        this.setProperty("value", value, true);
        (this.getAggregation("_performance") as RatingIndicator).setValue(value);

        return this;
    }
    static renderer = {
        apiVersion: 4,
        render: (rm: RenderManager, control: EmployeePerformance) => {
            const rateValue = control.getValue();

            rm.openStart("div", control);

            rm.class("customBadge");

            rm.style("padding", "6px 12px");
            rm.style("border-radius", "16px");
            rm.style("display", "inline-block");
            rm.style("font-weight", "bold");
            rm.style("cursor", "pointer");
            rm.openEnd();
            rm.renderControl(control.getAggregation("_performance") as Control);
            rm.close("div");
        }
    }

};
