import { Component, Input } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-produt-list',
  templateUrl: './produt-list.component.html',
  styleUrls: ['./produt-list.component.scss'],
})
export class ProdutListComponent {
  products$ = this.productService.products$;

  constructor(private productService: ProductService) {}

  getSubtotal(item: { name: string; quantity: number; price: number }): number {
    return item.quantity * item.price;
  }

  removeItem(item: { name: string; quantity: number; price: number }): void {
    this.productService.removeItem(item);
  }

  updateQuantity(
    item: { name: string; quantity: number; price: number },
    quantity: number
  ): void {
    this.productService.updateQuantity(item, quantity);
  }
}
