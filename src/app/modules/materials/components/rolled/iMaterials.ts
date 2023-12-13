interface IrolledType {
  idrolled_type: number;
  name_typerolled: string;
  ind: number;
}

interface Isteel {
  idsteel: number;
  steel: string;
  index: number;
}

interface Irolled {
  id_rolled: number;
  name_rolled: string;
  d: number;
  t: number;
  steel: string;
  weight: number;
  isEdited?: boolean;
}

interface Imaterial {
  rolled_type:IrolledType[];
  steels:Isteel[];
  rolleds:Irolled[];
}
export { IrolledType, Isteel, Irolled, Imaterial}