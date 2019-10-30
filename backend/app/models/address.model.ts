export class Address {
  id = -1;
  street: string;
  housenumber: number;
  zip: number;
  city: string;

  constructor(street: string, housenumber: number, zip: number, city: string){
    this.street = street;
    this.housenumber = housenumber;
    this.zip = zip;
    this.city = city;
  }
  setId(id: number){
    this.id = id;
  }

}