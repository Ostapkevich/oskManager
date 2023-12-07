
interface Iorder {
  readonly order_machine:string;
  readonly number_machine: string;
  readonly name_machine: string;
  readonly description: string;
  readonly idcustomer:number;
  readonly idcategory:number;
 }

interface IProperties {
  "property": string;
  "val": string;
  "idproperty": number;
}

interface Icategorycastomer {
  "customers": [
    {
      "idcustomer": number;
      "customer": string;
    }
  ],
  "categories": [
    {
      "idcategory": number;
      "category": string;
    }
  ]
}

export { Icategorycastomer, Iorder, IProperties }; 