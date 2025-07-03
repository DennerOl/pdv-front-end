import { Component, Input } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../../types/types';
import { NfceService } from '../services/nfce/nfce.service';
import { ItemNfceDTO, NfceRequestDTO } from 'src/app/types/nfceTypes/nfce';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-produt-list',
  templateUrl: './produt-list.component.html',
  styleUrls: ['./produt-list.component.scss'],
})
export class ProdutListComponent {
  nfce: NfceRequestDTO; // Propriedade para armazenar o estado atual
  private subscription: Subscription = new Subscription();

  constructor(private nfceService: NfceService) {
    this.nfce = this.nfceService.getInicialNfce();
  }

  ngOnInit(): void {
    // Assinar o nfce$ para atualizar o estado local
    this.subscription.add(
      this.nfceService.nfce$.subscribe((nfce) => {
        this.nfce = nfce;
      })
    );
  }

  ngOnDestroy(): void {
    // Assinar o nfce$ para atualizar o estado local
    this.subscription.unsubscribe();
  }

  /**
   * Atualiza a quantidade de um item na NFC-e.
   * @param item Item a ser atualizado
   */
  updateQuantity(item: ItemNfceDTO): void {
    this.nfceService.updateQuantity(item, item.quantidade);
  }

  /**
   * Remove um item da NFC-e.
   * @param item Item a ser removido
   */
  removeItem(item: ItemNfceDTO): void {
    this.nfceService.removeItem(item);
  }

  /**
   * Calcula o subtotal de um item (quantidade × preço unitário).
   * @param item Item da NFC-e
   * @returns Subtotal
   */
  getSubtotal(item: ItemNfceDTO): number {
    return item.quantidade * item.precoUnitario;
  }
}
