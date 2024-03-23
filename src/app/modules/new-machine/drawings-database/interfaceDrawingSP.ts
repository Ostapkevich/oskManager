interface Ispecification {
  idItem: number ,  // id добавленного чертежа, материала (прокат, метизы, покуп, материал)
  idParent: number | undefined,  // id position в таблице drawing_specification в базе данных
  idChild: number | null | undefined,// id position в связанной таблице drawing_specification в базе данных
  //ind: number,
  type_position: number | undefined,
  numberDrawing: string | undefined,
  name_item: string | undefined,
  quantity: number | undefined,
  weight: number | undefined,
  uselength: number | undefined,
  len: number | null | undefined,
  dw: number | undefined,
  h: number | null | undefined,
  specific_units: number | undefined,
  units: number | undefined,
  percent: number | null | undefined,
  value: number | null | undefined,
  plasma: boolean | null | number | undefined,
  nameDrawing: string | undefined,
  isSB: number | undefined,
  noBlank:string |undefined,
  s:number,
  path:string[]
}

interface IMaterial {
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

interface IBlank {
  id: number | undefined, // id  - уникальный ключ в таблице заготовки чертежа в базе данных
  idBlank: number | undefined, // id добавленной заготовки
  nameBlank: string, // имя добавленной заготовки
  typeBlank: number | undefined,
  blankWeight: number | undefined,
  uselength: number | undefined,
  plasma: boolean,
  percentBlank: number | undefined,//коэф для заготовки
  valueBlank: number | undefined,
  specificUnitsBlank: number | undefined,
  unitsBlank: number | undefined,
  len: number | undefined, // L чертежа
  dw: number | undefined, // D(B) чертежа
  h: number | undefined,//H чертежа
}

interface Idrawings {
  idDrawing: number
  type_position: number,
  numberDrawing: string,
  name_item: string,
  weight: number,
  uselength: number,
  len: number | null,
  dw: number,
  h: number | null,
  specific_units: number,
  units: number,
  percent: number | null,
  value: number | null,
  plasma: boolean | null | number,
  nameDrawing: string,
  type_blank: number,
  noBlank: string,
  isSB: number,
  path: string[], // массив путей где будут хранится чертежи,
  s:number, //площадь поверхности
  m:number
}

export { Ispecification, IMaterial, IBlank, Idrawings }