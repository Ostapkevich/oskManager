
interface ImaterialType {
  id_type: number;
  name_type: string;
  ind: number;
}

interface Imaterial {
  idmaterial?: number;
  name_material: string;
  initial_name_material:string
  x1: number;
  initial_x1:number
  x2: number;
  initial_x2:number,
  units: number;
  initial_units:number;
  specific_units:number;
  initial_specific_units:number;
  percent:number;
  initial_percent:number;
  isEdited?: boolean;
  value?:number;
}

interface IaddMaterial {
  name_material: string,
  idhardware_type: number,
  x1?: number;
  x2?: number;
  weight: number
  
}

interface IMaterials {
  material_type:ImaterialType[];
  materials:Imaterial[];
}
export { ImaterialType, Imaterial, IMaterials, IaddMaterial}