import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url ="http://localhost:8080/api/v1";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  /**
   * get all the products
   */
  getProduct(){
    const endpoint = `${base_url}/products`;
    return this.http.get(endpoint);
  }
  /**
  *save the product
  */
  saveProduct(body:any){
    const endpoint = `${base_url}/products`;
    return this.http.post(endpoint,body);
  }
}
