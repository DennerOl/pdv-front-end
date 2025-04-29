import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss'],
})
export class PaymentOptionsComponent {
  @Input() products: { name: string; quantity: number; price: number }[] = [];

  getTotal(): number {
    return this.products.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }
}
