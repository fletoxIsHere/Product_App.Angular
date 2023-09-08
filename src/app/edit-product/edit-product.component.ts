import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../model/Product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit{
   productId! :String;
   product! : Product;
   productFormGroup! : FormGroup;

  constructor(private route: ActivatedRoute, public productService : ProductService, private fb: FormBuilder){
    this.productId =  route.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.productService.getProductById(this.productId).subscribe({
      next:(data)=>{
        this.product = data;
      },
      error:(err)=>{
        alert(err)
      }
    });
    this.productFormGroup = this.fb.group({
      name:this.fb.control(this.product.name,[Validators.required,Validators.minLength(4)]),
      price:this.fb.control(this.product.price,[Validators.required]),
      promotion:this.fb.control(this.product.promotion,[Validators.required]),
          })
  }

  handleUpdateProduct(){
    let p =  this.productFormGroup.value;
    p.id  = this.productId;

    this.productService.updateProduct(p).subscribe({
      next:(data)=>{
        alert(JSON.stringify(data))
      },
      error:(err)=>{
        alert(err)
      }

    })
  }


}
