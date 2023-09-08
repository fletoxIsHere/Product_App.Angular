import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../model/Product';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent  {
  products! : Array<Product>;
  errorMessage! : String;
  searchFormGroup! : FormGroup;
  size:number = 5;
  totalPage :number=0;
  currentPage: number =0;
  currentAction : String = "all";
  lastKeyword : String  = "";
  constructor (private productService : ProductService, private fb : FormBuilder, private router:Router,
    public authService:AuthenticationService,
    private httpClient:HttpClient){}

  ngOnInit():void{
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(null)
    })
    this.handleGetPageProduct();
  }

  goto(page:number){
    
    this.currentPage = page;
    this.handleGetPageProduct() 
   }
  handleGetAllProduct(){

    this.productService.getAllProducts().subscribe({
      next:(data)=>{
        this.products = data;
      },
      error:(err)=>{
        this.errorMessage = err;
      }
     });
  }
  handleDeleteProduct(product:Product){

    let conf = confirm("are you sure?");
    if (conf == false) return
    this.productService.deleteProduct(product.id).subscribe({
      next:(data)=>{
       // this.handleGetAllProduct()
    let index = this.products.indexOf(product);
    this.products.splice(index,1);
      }
    })
  }

  handleTogglePromotion(product:Product){
    let promo = product.promotion;
    this.productService.setPromotion(product.id).subscribe({
      next:(data)=>{
      product.promotion =! promo;

      },
      error:(err)=>{
        console.log("err")
      }

    })

  }

  handleSearchProduct(){
    this.currentAction = "search";
    let keyword = this.searchFormGroup.value.keyword;
    if (this.lastKeyword != keyword){
      this.currentPage = 0;
      this.lastKeyword = keyword;
    }
    this.productService.searchProduct(keyword,this.currentPage,this.size).subscribe({
      next:(data)=>{
        this.products= data.products;
        this.totalPage = data.totalPages;
      }
    })
  }

  handleGetPageProduct(){
    if(this.currentAction == "search")
    this.handleSearchProduct();
    else {
    this.currentAction == "all"
    this.productService.getPageProduct(this.currentPage,this.size).subscribe({
      next:(data)=>{
 
        this.products = data.products;
        this.totalPage = data.totalPages;
        
      },
      error:(err)=>{
        this.errorMessage = err;
      }
     });
  }
}


handleNewProducts() {
  this.router.navigateByUrl("/admin/newProduct");
}

handleUpdateProduct(p:Product) {
  this.router.navigateByUrl("/admin/editProduct/"+p.id);
}
  
}
