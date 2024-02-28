interface Ispecification {
    idItem: number,  // id добавленного чертежа, материала (прокат, метизы, покуп, материал)
    idParent: number | undefined,  // id position в таблице drawing_specification в базе данных
    idChild: number | null,// id position в связанной таблице drawing_specification в базе данных
    //ind: number,
    type_position: number,
    number_item: string,
    name_item: string,
    quantity: number,
    weight: number,
    uselength: number,
    len: number | null,
    dw: number,
    h: number | null,
    specific_units: number,
    units: number,
    percent: number | null,
    value: number | null,
    plasma: boolean | null|number,
    name: string
  }

  interface IaddMaterial {
    id: number | null,
    idDrawing: number | null,
    idItem: number | null,
    name_material: string,
    specific_units: number,
    percent: number | null,
    valueMaterial: number | null,
    unitsMaterial: number,
    lenMaterial: number | null,
    // dw: number | null,
    hMaterial: number | null,
  }

  export {Ispecification, IaddMaterial}