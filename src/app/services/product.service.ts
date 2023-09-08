import { Injectable } from '@angular/core';
import { Observable,of, throwError } from 'rxjs';
import { PageProduct, Product } from '../model/Product';
import { UUID } from 'angular2-uuid';
import random from 'random';
import { ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products!: Array<Product>;
  constructor(private httpClient: HttpClient) {
    this.products = [
      // {id:UUID.UUID(),name:"Computer","price":6500,promotion:true},
      // {id:UUID.UUID(),name:"Printer","price":2000,promotion:false},
      // {id:UUID.UUID(),name:"SmartPhone","price":1400,promotion:true},
    ];
    let i=0;
    let Tname = ["computer", "car","watch","charger"];
    let Tprice = [123,332,9332,21981,338];
    let Tbool = [true,false]
  
    while (i!=20) {
      this.products.push({id:UUID.UUID(), name: this.getRandom(Tname) ,"price":this.getRandom(Tprice),promotion:this.getRandom(Tbool)},)
      i++;
    }
   }
  public getRandom(tab:Array<any>){
    const randomIndex = Math.floor(Math.random() * tab.length);
    const randomItem = tab[randomIndex];
  return randomItem;
  }
  public getAllProducts() : Observable<Array<Product>>{

    return of(this.products);
  }
  public deleteProduct(id: String) : Observable<Boolean>{
    this.products = this.products.filter(p=>p.id!=id)
    return of(true)
  }
  public setPromotion(id:String) : Observable<Boolean>{
    let product = this.products.find(p=>p.id==id)
    if (product != undefined){
      product.promotion =! product.promotion;
      return of(true)
    }
    else return  throwError(()=>{new Error("Product not found")})

  }
  public searchProduct(keyword:string,page:number, size:number): Observable<PageProduct>{
    let products = this.products.filter(p=>p.name.includes(keyword));
    let index = page *size;
    let totalPages =  ~~(products.length/size);
    if(products.length%size !=0){
      totalPages++;
    }
    let pageProducts = products.slice(index,index+size)
    console.log(pageProducts)
    return of({products:pageProducts,size:size,page:page,totalPages:totalPages})

  }

  public getPageProduct(page:number, size:number): Observable<PageProduct>{
    let index = page *size;
    let totalPages =  ~~(this.products.length/size);
    if(this.products.length%size !=0){
      totalPages++;
    }
    let pageProducts = this.products.slice(index,index+size)
    return of({products:pageProducts,size:size,page:page,totalPages:totalPages})  
  }

  public addProduct(p: Product): Observable<Product>{
    p.id = UUID.UUID();
    this.products.push(p);
    return of(p)
  }

  public getProductById(id:String):Observable<Product>{
   
   let p =  this.products.find(p=> p.id == id)
   if(p== undefined) return throwError(()=>new Error("product not found"))
    return of(p)
  }

  public getErrorMessage(field:String, error:ValidationErrors):String{
    if(error['required']){
      return field +" required";
    }
    if (error['minlength']) {
      return field+" should have at least " + error['minlength']['requiredLength']+" Characters";
    } else {
      return "";
    }
  }



  public updateProduct(product:Product):Observable<Product>{
     this.products = this.products.map(p=>product.id==p.id ? product : p)
     if (this.products == undefined) return throwError(()=> new Error("product not found") )
    return of(product);
  }
}

