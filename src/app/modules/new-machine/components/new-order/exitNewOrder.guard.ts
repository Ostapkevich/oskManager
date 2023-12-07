import { NewOrderComponent } from "./new-order.component";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

export const exitNewOrder = (newMachineComp: NewOrderComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let event = new Event("click");
    document.getElementById('id_machine')!.dispatchEvent(event);
    if (newMachineComp.dataChanged === true) {
        if (confirm("Данные не сохранены! Все равно выйти?")) {
            newMachineComp.dataChanged = false;
            newMachineComp.newOrderform!.reset();
            newMachineComp.dataOrder = undefined;
        } else {
            return false;
        }
    }
    return true
}