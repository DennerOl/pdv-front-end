import { Component } from '@angular/core';
import { Product } from 'src/app/types/types';
import { ProductService } from '../services/product.service';
import { NfceService } from '../services/nfce/nfce.service';
import { ItemNfceDTO } from 'src/app/types/nfceTypes/nfce';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  searchQuery: string = '';
  paginaAtual: number = 0;
  filteredProducts: Product[] = [];
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private nfceService: NfceService
  ) {}

  ngOnInit(): void {
    // Configura o debounce para evitar chamadas excessivas
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300), // Aguarda 300ms após a última digitação
        distinctUntilChanged() // Evita chamadas repetidas para o mesmo valor
      )
      .subscribe((query) => {
        this.filterProducts(query);
      });
  }

  ngOnDestroy(): void {
    // Limpa a assinatura para evitar memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  filterProducts(query: string = this.searchQuery): void {
    if (!query) {
      this.filteredProducts = [];
      return;
    }

    this.productService
      .getProducts(this.paginaAtual, query)
      .subscribe((response) => {
        this.filteredProducts = response.content || [];
      });
  }

  /**
   * Emite a query de busca para o Subject com debounce.
   */
  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  selectProduct(product: Product): void {
    const newProduct: ItemNfceDTO = {
      productId: product.id,
      codigo_principal: product.codigo_principal,
      descricao: product.descricao || product.nome,
      quantidade: 1,
      precoUnitario: product.precoVenda,
      totalItem: product.precoVenda,
    };
    this.nfceService.addProduto(newProduct);
    this.clearSearch();
  }

  selectFirstProduct(): void {
    if (this.filteredProducts.length) {
      this.selectProduct(this.filteredProducts[0]);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredProducts = [];
  }
}
