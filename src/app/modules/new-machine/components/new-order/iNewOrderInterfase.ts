
interface Iorder {
  order_machine:string;
  number_machine: string;
  name_machine: string;
  description: string;
  idcustomer:number;
  idcategory:number;
  shipment:string;
 }

interface IProperties {
  idproperty? : number|null;
  order_machine?:string|undefined;
  property?: string;
  val?: string;
 }

interface Icategorycastomer {
  customers: [
    {
      idcustomer: number;
      customer: string;
    }
  ],
  categories: [
    {
      idcategory: number;
      category: string;
    }
  ]
}

export { Icategorycastomer, Iorder, IProperties }; 