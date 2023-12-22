interface IrolledType {
  idrolled_type: number;
  name_typerolled: string;
  ind: number;
}

interface Isteel {
  idsteel: number;
  steel: string;
  ind: number;
}

interface Irolled {
  id_rolled?: number;
  name_rolled: string;
  d?: number;
  t?: number;
  steel?: string;
  weight: number;
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

interface Imaterial {
  rolled_type:IrolledType[];
  steels:Isteel[];
  rolleds:Irolled[];
}
export { IrolledType, Isteel, Irolled, Imaterial, IaddRolled}