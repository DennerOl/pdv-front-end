import { Component, Input } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../../types/types';
import { NfceService } from '../services/nfce/nfce.service';
import { ItemNfceDTO, NfceRequestDTO } from 'src/app/types/nfceTypes/nfce';

@Component({
  selector: 'app-produt-list',
  templateUrl: './produt-list.component.html',
  styleUrls: ['./produt-list.component.scss'],
})
export class ProdutListComponent {
  nfce$ = this.nfceService.nfce$;

  constructor(private nfceService: NfceService) {}

  ngOnInit(): void {
    this.nfceService.getNfce();
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
