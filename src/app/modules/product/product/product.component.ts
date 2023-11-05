import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  private productService = inject(ProductService);
  ngOnInit(): void {
      this.getProduct();
  }
  displayedColumns: string[]= ['id','name','price','account','category','picture','actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!:MatPaginator;

  getProduct(){
this.productService.getProduct()
    .subscribe((data:any)=>{
      console.log("Respuesta de productos: ", data);
      this.processProductResponse(data);
    }), (error:any)=>{
      console.log("Error en productos: ",error);
    }

  }

  processProductResponse(resp:any){
    const dateProduct: ProductElement[]=[];
    if (resp.metadata[0].code=="00") {
      let listCProduct = resp.product.products;

      listCProduct.forEach((element:ProductElement) => {
        element.category = element.category.name;
        element.picture = 'data:image/jpeg;base64, '+element.picture;
        dateProduct.push(element);
      });
      //set the datasource
      this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
      this.dataSource.paginator = this.paginator;
    }
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
