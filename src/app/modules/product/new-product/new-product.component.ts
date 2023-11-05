import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../shared/services/product.service';
import { yearsPerPage } from '@angular/material/datepicker';

export interface Category{
  description : string;
  id:number;
  name:string;
}
@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit{

  public productForm!: FormGroup;
  estadoFormulario: string="";
  categories:Category[]=[];
  selectedFile: any;
  nameImg:string="";

  //INJECCION
  private fb = inject(FormBuilder);
  private categoryServices = inject(CategoryService);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);
  private productService = inject(ProductService);

  ngOnInit(): void {

    this.getCategories();

    this.estadoFormulario = "Agregar";
    this.productForm = this.fb.group({
      name:['',Validators.required],
      price:['',Validators.required],
      account:['',Validators.required],
      category:['',Validators.required],
      picture:['',Validators.required]
    })
  }

  getCategories(){
    this.categoryServices.getCategories()
      .subscribe((data:any)=>{
        this.categories = data.categoryResponse.category;
      },(error:any)=>{
        console.log("error al consultar categorias");
      })
  }

  onFileChanged(event:any){
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    this.nameImg=event.target.files[0].name;
  }

  onSave(){
    let data ={
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      account: this.productForm.get('account')?.value,
      category: this.productForm.get('category')?.value,
      picture: this.selectedFile
    }

    //NOMBRE SERVICIO SPRING BOOT
    const uploadImageData = new FormData();
    uploadImageData.append('picture',data.picture,data.picture.name);
    uploadImageData.append('name',data.name);
    uploadImageData.append('price',data.price);
    uploadImageData.append('account', data.account);
    uploadImageData.append('categoryId',data.category);

    //CALL THE SERVICE TO SAVE A PRODUCT
    this.productService.saveProduct(uploadImageData)
      .subscribe((data:any)=>{
        this.dialogRef.close(1);
      }, (error:any)=>{
        this.dialogRef.close(2);
      })
  }

  onCancel(){
this.dialogRef.close(3);
  }

}
