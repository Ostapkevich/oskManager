
interface ImaterialType {
  id_type: number;
  name_type: string;
  ind: number;
}

interface Imaterial {
  idmaterial?: number;
  name_material: string;
  x1?: number;
  x2?: number;
  weight: string;
  isEdited?: boolean;
}

interface IaddMaterial {
  name_material: string,
  idhardware_type: number,
  x1?: number,
  x2?: number,
  weight: number,
  
}

interface IMaterials {
  material_type:ImaterialType[];
  materials:Imaterial[];
}
export { ImaterialType, Imaterial, IMaterials, IaddMaterial}