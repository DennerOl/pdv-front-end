import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-produt-list',
  templateUrl: './produt-list.component.html',
  styleUrls: ['./produt-list.component.scss'],
})
export class ProdutListComponent {
  @Input() products: { name: string; quantity: number; price: number }[] = [
    { name: 'Produto A', quantity: 1, price: 50.0 },
    { name: 'Produto B', quantity: 2, price: 75.0 },
    { name: 'Produto C', quantity: 1, price: 50.0 },
    { name: 'Produto D', quantity: 2, price: 75.0 },
    { name: 'Produto E', quantity: 1, price: 50.0 },
    { name: 'Produto F', quantity: 2, price: 75.0 },
  ];

  // Método para calcular o subtotal dinamicamente
  getSubtotal(item: any): number {
    return item.quantity * item.price;
  }

  removeItem(item: any): void {
    this.products = this.products.filter((p) => p !== item);
  }
}
