import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  searchQuery: string = '';
  products = [
    {
      code: 'P001',
      description: 'Produto A',
      barcode: '123456789012',
      quantity: 10,
      price: 50.0,
    },
    {
      code: 'P002',
      description: 'Produto B',
      barcode: '987654321098',
      quantity: 5,
      price: 75.0,
    },
    {
      code: 'P003',
      description: 'Produto C',
      barcode: '456789123456',
      quantity: 8,
      price: 30.0,
    },
  ];
  filteredProducts = this.products;

  constructor(private productService: ProductService) {}

  filterProducts(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(
      (p) =>
        p.code.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.barcode.includes(query)
    );
  }

  selectProduct(product: any): void {
    this.productService.addProduct({
      name: product.description,
      quantity: 1,
      price: product.price,
    });
    this.searchQuery = '';
    this.filteredProducts = [];
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
