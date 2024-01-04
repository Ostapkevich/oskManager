import { Isteel } from "../../iSteel";

interface IrolledType {
  idrolled_type: number;
  name_typerolled: string;
  ind: number;
  lenghtForWeight:boolean
}



interface Irolled {
  id_rolled?: number;
  name_rolled: string;
  d?: number;
  t?: number;
  steel?: string;
  weight: string;
  isEdited?: boolean;
}

interface IaddRolled {
  name_rolled: string,
  idsteel: number,
  idrolled_type: number,
  d?: number,
  weight: number,
  t?: number
}

interface IRolledMaterial {
  rolled_type:IrolledType[];
  steels:Isteel[];
  rolleds:Irolled[];
}
export { IrolledType, Isteel, Irolled, IRolledMaterial, IaddRolled}