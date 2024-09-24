import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public ORDENES;
  public ESTADOS;
  public TRABAJOS;
  public detalle:boolean = false;
  public orden_detalle;
  public orden_id;
  public cantidad_d;
  public cantidad_do;
  public ejemplares_montados;

  public despacho:boolean = false;

  public loading:boolean = true;
  
  
  constructor(private api:RestApiService,
    private router:Router,
    ) {
      this.usuario = api.usuario
    }
    
    ngOnInit(): void {
      this.getOrdenes();
      this.obtenerTrabajos();
    }
    public usuario

  getOrdenes(){
    this.api.getOrden()
      .subscribe((resp:any)=>{
        this.ORDENES = resp;
        this.ORDENES = this.ORDENES.reverse();
      })
  }

  detallar(id,sort, x, y, montajes){
    this.ejemplares_montados = montajes;
    this.detalle = true;
    this.orden_detalle = sort;
    this.orden_id = id;
    this.cantidad_d = x;
    this.cantidad_do = y;
    // // console.log(y)
  }

  despacho_(){
    this.despacho = true;
  }

  alert(id){
    this.router.navigateByUrl(`orden-produccion/${id}`)
  }

  getEstados(id){
    let estado = this.TRABAJOS.find(x => x.orden._id == id && x.maquina.tipo === 'IMPRIMIR')
    let hoy = moment().format('yyyy-MM-DD');

    // // // console.log(estado)
    if(estado){
      if(hoy < estado.fechaI){
        let date = moment(estado.fechaI).format('yyyy-MM-DD')
        date = moment('yyyy-MM-DD').format('DD-MM-yyyy')
        return `Impresión Comienza el: ${estado.fechaI}`
      }
    }

      let estado2 = this.TRABAJOS.find(x => x.orden._id == id && x.fechaI<= hoy && x.fecha >= hoy)
    if(estado2){
      // // console.log(estado2, 'this is')
        return `En proceso de: ${estado2.maquina.tipo}`
    }else{
      return `ORDEN FINALIZADA`
    }

  }

  obtenerTrabajos(){
    this.api.getTrabajos()
      .subscribe((resp:any)=>{
        this.TRABAJOS = resp;
        // // console.log(this.TRABAJOS)
        this.loading = false;
      })
  }

}
