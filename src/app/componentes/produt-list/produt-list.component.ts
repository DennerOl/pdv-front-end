import { Component, Input } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../../types/types';

@Component({
  selector: 'app-produt-list',
  templateUrl: './produt-list.component.html',
  styleUrls: ['./produt-list.component.scss'],
})
export class ProdutListComponent {
  products$ = this.productService.products$;

  constructor(private productService: ProductService) {}

  getSubtotal(item: Product): number {
    return item.quantity * item.price;
  }

  removeItem(item: Product): void {
    this.productService.removeItem(item);
  }

  updateQuantity(item: Product, quantity: number): void {
    this.productService.updateQuantity(item, quantity);
  }
}
