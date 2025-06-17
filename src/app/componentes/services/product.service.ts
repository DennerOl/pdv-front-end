import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Product } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private API: string = environment.API;

  // Subject para os produtos pesquisados (resultados da busca)
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.productsSubject.asObservable();

  // Subject para os produtos selecionados (lista de produtos escolhidos)
  private selectedProductsSubject = new BehaviorSubject<Product[]>([]);
  selectedProducts$: Observable<Product[]> =
    this.selectedProductsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(
    pagina: number,
    filtro: string
  ): Observable<{ content: Product[] }> {
    // Não faz requisição se o filtro for vazio ou muito curto
    if (!filtro || filtro.trim().length <= 2) {
      this.productsSubject.next([]); // Limpa os produtos pesquisados
      return of({ content: [] }); // Retorna observable vazio
    }

    const itemsPerPage = 10;
    let params = new HttpParams()
      .set('page', pagina.toString())
      .set('size', itemsPerPage.toString())
      .set('sort', 'nome,asc')
      .set('nome', filtro.trim());

    return this.http
      .get<{ content: Product[] }>(`${this.API}/products`, { params })
      .pipe(
        tap((response) => {
          this.productsSubject.next(response.content); // Atualiza os produtos pesquisados
        })
      );
  }

  // Método para adicionar um produto à lista de selecionados
  addProduct(product: Product): void {
    const currentSelected = this.selectedProductsSubject.getValue();
    if (!currentSelected.find((p) => p.id === product.id)) {
      // Evita duplicatas
      this.selectedProductsSubject.next([...currentSelected, product]);
    }
  }

  // Método para remover um produto da lista de selecionados (opcional)
  removeItem(productId: number): void {
    const currentSelected = this.selectedProductsSubject.getValue();
    this.selectedProductsSubject.next(
      currentSelected.filter((p) => p.id !== productId)
    );
  }

  // Método para atualizar a quantidade de um produto selecionado
  // Método para atualizar a quantidade de um produto selecionado
  updateQuantity(item: Product, quantity: number): void {
    const currentSelected = this.selectedProductsSubject.getValue();
    const updatedSelected = currentSelected.map((p) =>
      p.id === item.id ? { ...p, quantity } : p
    );
    this.selectedProductsSubject.next(updatedSelected);
  }

  // Método para limpar a lista de produtos selecionados
  clearProducts(): void {
    this.selectedProductsSubject.next([]);
  }
}
