import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./EmployeePerformance" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $EmployeePerformanceSettings extends $ControlSettings {
        value?: number | PropertyBindingInfo | `{${string}}`;
        dateText?: string | PropertyBindingInfo;
        checkIn?: string | PropertyBindingInfo;
        checkOut?: string | PropertyBindingInfo;
        change?: (event: EmployeePerformance$ChangeEvent) => void;
    }

    export default interface EmployeePerformance {

        // property: value
        getValue(): number;
        setValue(value: number): this;

        // property: dateText
        getDateText(): string;
        setDateText(dateText: string): this;

        // property: checkIn
        getCheckIn(): string;
        setCheckIn(checkIn: string): this;

        // property: checkOut
        getCheckOut(): string;
        setCheckOut(checkOut: string): this;

        // event: change
        attachChange(fn: (event: EmployeePerformance$ChangeEvent) => void, listener?: object): this;
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: EmployeePerformance$ChangeEvent, data: CustomDataType) => void, listener?: object): this;
        detachChange(fn: (event: EmployeePerformance$ChangeEvent) => void, listener?: object): this;
        fireChange(parameters?: EmployeePerformance$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of EmployeePerformance's 'change' event.
     */
    export interface EmployeePerformance$ChangeEventParameters {
        value?: number;
    }

    /**
     * Type describing the EmployeePerformance's 'change' event.
     */
    export type EmployeePerformance$ChangeEvent = Event<EmployeePerformance$ChangeEventParameters>;
}
