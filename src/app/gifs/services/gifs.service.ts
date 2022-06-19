import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' /// angular lo eleva a un nivel global de la aplicación
})
export class GifsService {
  private _historial: string[] = [];
  private apiKey    : string = 'dxmGL69sFe5aWBty7JYOyjNvLzSvs3F8';

  // TODO: 
  public resultados : any[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor(private http:HttpClient){} // Se inserta el servicio http en lugar de fetch
  // para hacer peticiones en base a observables y no en base a promesas

  buscarGifs(query: string){
    query = query.trim().toLowerCase();
    if(query.trim().length == 0){return}
    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);
    }

    this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=dxmGL69sFe5aWBty7JYOyjNvLzSvs3F8&q=${query}&limit=10`)
      .subscribe( (resp: any) => {
        this.resultados = resp.data;
      })

  }



}
