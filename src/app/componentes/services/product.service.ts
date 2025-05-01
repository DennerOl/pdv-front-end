import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([
    { name: 'Produto A', quantity: 1, price: 50.0 },
    { name: 'Produto B', quantity: 2, price: 75.0 },
    { name: 'Produto C', quantity: 1, price: 50.0 },
    { name: 'Produto D', quantity: 2, price: 75.0 },
    { name: 'Produto E', quantity: 1, price: 50.0 },
    { name: 'Produto F', quantity: 2, price: 75.0 },
  ]);

  products$: Observable<Product[]> = this.productsSubject.asObservable();

  getProducts(): { name: string; quantity: number; price: number }[] {
    return this.productsSubject.getValue();
  }

  addProduct(product: { name: string; quantity: number; price: number }): void {
    const currentProducts = this.productsSubject.getValue();
    this.productsSubject.next([...currentProducts, product]);
  }

  removeItem(item: Product): void {
    const currentProducts = this.productsSubject.getValue();
    this.productsSubject.next(currentProducts.filter((p) => p !== item));
  }

  updateQuantity(item: Product, quantity: number): void {
    const currentProducts = this.productsSubject.getValue();
    const updatedProducts = currentProducts.map((p) =>
      p === item ? { ...p, quantity } : p
    );
    this.productsSubject.next(updatedProducts);
  }
}
