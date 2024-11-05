import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data: any;

  constructor(){
    this.data = "Default";
  }

  setData(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }
}
