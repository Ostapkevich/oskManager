import { Isteel } from "../../iSteel";

interface IrolledType {
  id_type: number,
  name_type: string,
  ind: number,
  lenghtForWeight:boolean
}



interface Irolled {
  id_item?: number,
  name_item: string,
  initial_name_item: string,
  d?: number,
  initial_d?: number,
  t?: number,
  initial_t?: number,
  steel?: string,
  weight: number,
  initial_weight: number,
  isEdited?: boolean,
  uselength:number,
}

interface IaddRolled {
  name_item: string,
  idsteel: number,
  id_type: number,
  d?: number,
  weight: number,
  t?: number
}

interface IRolledMaterial {
  rolled_type:IrolledType[],
  steels:Isteel[],
  rolleds:Irolled[],
}
export { IrolledType, Isteel, Irolled, IRolledMaterial, IaddRolled}