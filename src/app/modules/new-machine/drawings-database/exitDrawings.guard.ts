import { DrawingsDatabaseComponent } from "./drawings-database.component";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

export const exitDrawing = (drawings: DrawingsDatabaseComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let event = new Event("click");
    document.getElementById('numberDrawing')!.dispatchEvent(event);
    if (drawings.dataChanged === true  || drawings.materialChange === true || drawings.spChange === true  ) {
        if (confirm("Данные не сохранены! Все равно выйти?")) {
           
        } else {
            return false;
        }
    }
    return true
}