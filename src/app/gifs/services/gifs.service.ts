import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root' /// angular lo eleva a un nivel global de la aplicación
})
export class GifsService {
  private _historial : string[] = [];
  private apiKey     : string = 'dxmGL69sFe5aWBty7JYOyjNvLzSvs3F8';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  // TODO: 
  public resultados : Gif[] = []; // Si se le dá ctrl + click se puede acceder a la interfaz

  get historial(){
    return [...this._historial];
  }

  constructor(private http:HttpClient){
    // Para leer del local storage, es mejor hacerlo acá, ya que aquí solo se lee
    // la primera vez que se caarga la página
    if(localStorage.getItem('historial')){ // se valida si existe o nó la información en el ls
      this._historial = JSON.parse(localStorage.getItem('historial')!); // Se forza el resultado con !, ya que ya se hizo la validación
    }

    if(localStorage.getItem('resultados')){ // se valida si existe o nó la información en el ls
      this.resultados = JSON.parse(localStorage.getItem('resultados')!); // Se forza el resultado con !, ya que ya se hizo la validación
    }

  } // Se inserta el servicio http en lugar de fetch
  // para hacer peticiones en base a observables y no en base a promesas

  buscarGifs(query: string){
    query = query.trim().toLowerCase();
    if(query.trim().length == 0){return}
    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      localStorage.setItem('historial',JSON.stringify(this._historial)); // Se guarda el historial en el LS
      this._historial = this._historial.splice(0,10);
    }
    // En este momento la petición tiene un tipado genérico, por lo que no se sabe que retornará
    // La interface que se creó al traducir la respuesta en quicktype.io permite cambiarle el genérico a uno específico
    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit'  , '10')
          .set('q',query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params})
      .subscribe( (resp) => {
        this.resultados = resp.data; // Typescript ya me ayuda con el tipado
        localStorage.setItem('resultados',JSON.stringify(this.resultados)); // Se guardan los últimos resultados en el LS
      })

  }



}
