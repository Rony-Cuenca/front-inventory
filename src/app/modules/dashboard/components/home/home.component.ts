import { Component, OnInit, inject } from '@angular/core';
import { Chart } from 'chart.js';
import { ProductElement } from 'src/app/modules/product/product/product.component';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit{

  chartBar:any;
  chartDoughnut:any;

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.getProduct();
  }

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

    const nameProduct: String[] = [];
    const account: number [] = [];

    if (resp.metadata[0].code=="00") {
      let listCProduct = resp.product.products;

      listCProduct.forEach((element:ProductElement) => {
        nameProduct.push(element.name);
        account.push(element.account);
      });

      //NUESTRO GRAFICO DE BARRAS
      this.chartBar = new Chart('canvas-bar',{
        type:'bar',
        data:{
          labels:nameProduct,
          datasets:[
            {label:'Productos', data:account}
          ]
        }
      });

      //NUESTRO GRAFICO DE DOUGHNUT
      this.chartDoughnut = new Chart('canvas-doughnut',{
        type:'doughnut',
        data:{
          labels:nameProduct,
          datasets:[
            {label:'Productos', data:account}
          ]
        }
      });

    }
  }

}
