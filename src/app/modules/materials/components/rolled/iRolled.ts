import { Isteel } from "../../iSteel";

interface IrolledType {
  id_type: number;
  name_type: string;
  ind: number;
  lenghtForWeight:boolean
}



interface Irolled {
  id_rolled?: number;
  name_rolled: string;
  initial_name_rolled: string;
  d?: number;
  initial_d?: number;
  t?: number;
  initial_t?: number;
  steel?: string;
  weight: string;
  initial_weight: string;
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