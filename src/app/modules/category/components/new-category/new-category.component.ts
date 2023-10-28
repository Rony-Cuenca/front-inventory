import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit{

  //INJECCIONES
  public categoryForm!: FormGroup;
  private fb = inject(FormBuilder);
  private categoryServices = inject(CategoryService);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  estadoFormulario: string="Agregar";

  ngOnInit(): void {

    this.categoryForm = this.fb.group({
      name: ['',Validators.required],
      description:['',Validators.required]
    });
    console.log(this.data);

    if (this.data!=null) {
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    }
  }

  onSave(){
    let data = {
      name: this.categoryForm.get('name')?.value,
      description: this.categoryForm.get('description')?.value
    }
    if (this.data !=null) {
      //update registry
      this.categoryServices.updateCategorie(data,this.data.id)
        .subscribe((data:any)=>{
          this.dialogRef.close(1);
        },(error:any)=>{
          this.dialogRef.close(2);
        })
    } else {
      //create new registry
      this.categoryServices.saveCategorie(data)
      .subscribe((data:any)=>{
        console.log(data);
        this.dialogRef.close(1);
      }, (error:any)=>{
        this.dialogRef.close(2);
      })
    }

  }

  onCancel(){
    this.dialogRef.close(3);
  }

  updateForm(data:any){
    this.categoryForm = this.fb.group({
      name: [data.name,Validators.required],
      description:[data.description,Validators.required]
    });
  }
}
