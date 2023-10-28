import { Component, inject,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{

  //INYECCIONES
  private categoryService = inject(CategoryService);
  public dialog = inject(MatDialog);
  private snackBar=inject(MatSnackBar);

  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[]= ['id','name','description','actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  getCategories(){
    this.categoryService.getCategories()
      .subscribe((data:any)=>{
        console.log("respuesta categories: ", data);
        this.processCategoriesResponse(data);
      }, (error:any) =>{
        console.log("error: ",error);
      })
  }

  processCategoriesResponse(resp:any){
    const dataCategory: CategoryElement[]=[];
    if(resp.metadata[0].code=="00"){
      let listCategory = resp.categoryResponse.category;

      listCategory.forEach((element:CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
    }
  }

  openCategoryDialog(){
    const dialogRef = this.dialog.open( NewCategoryComponent, {
      width:'450px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result==1){
        this.openSnackBar("Categoria Agregada","Exitosa");
        this.getCategories();
      }else if (result==2){
        this.openSnackBar("Se produjo un error al guardar categoria","Error");
      }
    });
  }

  edit(id:number,name:string,description:string){
    const dialogRef = this.dialog.open( NewCategoryComponent, {
      data:{id:id,name:name,description:description},
      width:'450px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result==1){
        this.openSnackBar("Categoria Actualizada","Exitosa");
        this.getCategories();
      }else if (result==2){
        this.openSnackBar("Se produjo un error al actualizar categoria","Error");
      }
    });
  }

  delete(id:any){
    const dialogRef = this.dialog.open( ConfirmComponent, {
      data:{id:id}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result==1){
        this.openSnackBar("Categoria Eliminada","Exitosa");
        this.getCategories();
      }else if (result==2){
        this.openSnackBar("Se produjo un error al eliminar categoria","Error");
      }
    });
  }

  buscar(termino: string){
    if (termino.length === 0) {
      return this.getCategories();
    } else {
      this.categoryService.getCategoryById(termino)
        .subscribe((resp:any)=>{
          this.processCategoriesResponse(resp);
        })
    }
  }

  openSnackBar(message:string,action: string):MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message,action,{
      duration:3000
    })
  }
}

export interface CategoryElement{
  id:number;
  description: string;
  name:string;
}

