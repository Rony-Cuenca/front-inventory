import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { NewProductComponent } from '../new-product/new-product.component';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { UtilService } from '../../shared/services/util.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  isAdmin: any;

  //INJECCIONES
  private productService = inject(ProductService);
  public dialog = inject(MatDialog);
  private snackBar=inject(MatSnackBar);
  private util = inject(UtilService);

  ngOnInit(): void {
      this.getProduct();
      this.isAdmin = this.util.isAdmin();
  }
  displayedColumns: string[]= ['id','name','price','account','category','picture','actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!:MatPaginator;

  getProduct(){
    this.productService.getProduct()
      .subscribe((data:any)=>{
        console.log("respuesta productos: ", data);
        this.processProductResponse(data);
      }, (error:any) =>{
        console.log("error: ",error);
      })
  }

  processProductResponse(resp:any){
    const dateProduct: ProductElement[]=[];
    if (resp.metadata[0].code=="00") {
      let listCProduct = resp.product.products;

      listCProduct.forEach((element:ProductElement) => {
        //element.category = element.category.name;
        element.picture = 'data:image/jpeg;base64, '+element.picture;
        dateProduct.push(element);
      });
      //set the datasource
      this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
      this.dataSource.paginator = this.paginator;
    }
  }

  openProductDialog(){
    const dialogRef = this.dialog.open( NewProductComponent, {
      width:'450px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result==1){
        this.openSnackBar("Producto Agregada","Exitosa");
        this.getProduct();
      }else if (result==2){
        this.openSnackBar("Se produjo un error al guardar producto","Error");
      }
    });
  }

  openSnackBar(message:string,action: string):MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message,action,{
      duration:3000
    })
  }

  edit(id:number,name:string,price:number,account:number,category:any){
    const dialogRef = this.dialog.open( NewProductComponent, {
      width:'450px',
      data:{id:id,name:name,price:price,account:account,category:category}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result==1){
        this.openSnackBar("Producto editado","Exitosa");
        this.getProduct();
      }else if (result==2){
        this.openSnackBar("Se produjo un error al editar producto","Error");
      }
    });
  }

  delete(id:any){
    const dialogRef = this.dialog.open( ConfirmComponent, {
      width:'450px',
      data:{id:id, module: "product"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result==1){
        this.openSnackBar("Producto eliminado","Exitosa");
        this.getProduct();
      }else if (result==2){
        this.openSnackBar("Se produjo un error al eliminar producto","Error");
      }
    });
  }

  buscar(name: string){
    if (name.length === 0) {
      return this.getProduct();
    } else {
      this.productService.getProductByName(name)
        .subscribe((resp:any)=>{
          this.processProductResponse(resp);
        })
    }
  }

  exportExcel(){
    this.productService.exportProducts()
      .subscribe((data:any)=>{
        let file = new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        let fileUrl=URL.createObjectURL(file);
        var anchor = document.createElement("a");
        anchor.download = "products.xlsx";
        anchor.href = fileUrl;
        anchor.click();

        this.openSnackBar("Archivo exportado correctamente","Exitosa");
      },(error:any) => {
        this.openSnackBar("No se pudo exportar el archivo","Error");
      })
  }
}

export interface ProductElement {
  id:number;
  name:string;
  price:number;
  account:number;
  category:any;
  picture:any;
}
