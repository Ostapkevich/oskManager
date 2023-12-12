interface ItypeAndsteel {
    rolled_type: [
      {
        idrolled_type: number;
        name_typerolled: string;
        ind:number;
      }
    ],
    steels: [
      {
        idsteel: number;
        steel: string;
        index:number;
      }
    ]
}

interface Irolled {
  id_rolled:number;
  name_rolled:string;
  d:number;
  t:number;
  steel:string;
  weight:number;
  isEdited?:boolean; 
}

export {ItypeAndsteel, Irolled}