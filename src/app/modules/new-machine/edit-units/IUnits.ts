interface Iunits {
    id_unit?: number|null,
    order_machine?:string,
    unit:string,
    number_unit: string,
    name_unit: string,
    status_unit: number,
    idauthor?: string,
    weight:number,
    nameUser:string,
    newOrEdit?:boolean,
    ind?:number,
    started?:string,
    finished?:string,
}
interface IUnitOrder {
    order_machine:string,
    number_machine:string,
    name_machine:string,
    customer:string,
}
export {Iunits, IUnitOrder};