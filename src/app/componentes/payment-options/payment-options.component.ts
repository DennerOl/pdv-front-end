import { Component, Input } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss'],
})
export class PaymentOptionsComponent {
  constructor(private productService: ProductService) {}

  getTotal(): number {
    return this.productService
      .getProducts()
      .reduce((total, item) => total + item.quantity * item.price, 0);
  }
}
