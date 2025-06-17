import { Injectable } from '@angular/core';
import { NfceLocalStorageService } from './nfce-local-storage.service';
import { ItemNfceDTO, NfceRequestDTO } from 'src/app/types/nfceTypes/nfce';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NfceService {
  private nfceSubject = new BehaviorSubject<NfceRequestDTO>(
    this.getInicialNfce()
  );
  nfce$ = this.nfceSubject.asObservable();

  constructor(private nfceLocalStorage: NfceLocalStorageService) {}

  private getInicialNfce(): NfceRequestDTO {
    const savedNfce = this.nfceLocalStorage.get();
    return savedNfce
      ? savedNfce
      : {
          itens: [],
          pagamentos: [],
          tpEmis: 1, // Tipo de emissão padrão (1 = normal)
          xJust: '', // Justificativa vazia por padrão
          destinatario: {
            cpf: '',
            cnpj: '',
            xNome: 'CONSUMIDOR NÃO IDENTIFICADO', // Nome do destinatário padrão
            logradouro: '',
            numero: '',
            bairro: '',
            cMun: 0, // Código do município padrão
            uf: '', // Unidade Federativa padrão
            cep: '', // CEP padrão
          },
        };
  }

  saveNfce(nfce: NfceRequestDTO): void {
    this.nfceLocalStorage.save(nfce);
    this.nfceSubject.next(nfce);
  }

  getNfce(): NfceRequestDTO {
    return this.nfceLocalStorage.get() || this.getInicialNfce();
  }

  addProduto(produto: ItemNfceDTO): void {
    const nfce = this.getNfce();
    const existingItem = nfce.itens.find(
      (item) => item.productId === produto.productId
    );
    if (existingItem) {
      existingItem.quantidade += produto.quantidade || 1;
    } else {
      nfce.itens.push({
        productId: produto.productId,
        codigo_principal: produto.codigo_principal,
        descricao: produto.descricao,
        quantidade: produto.quantidade || 1,
        precoUnitario: produto.precoUnitario,
      });
    }

    this.saveNfce(nfce);
  }

  icrementarQuantidade(item: ItemNfceDTO): void {
    const nfce = this.getNfce();
    const existingItem = nfce.itens.find((i) => i.productId === item.productId);
    if (existingItem) {
      existingItem.quantidade++;
      this.saveNfce(nfce);
    }
  }

  decrementarQuantidade(item: ItemNfceDTO): void {
    const nfce = this.getNfce();
    const existingItem = nfce.itens.find((i) => i.productId === item.productId);
    if (existingItem) {
      if (existingItem.quantidade > 1) {
        existingItem.quantidade--;
      } else {
        // Se a quantidade for 1, remove o item
        nfce.itens = nfce.itens.filter((i) => i.productId !== item.productId);
      }
      this.saveNfce(nfce);
    }
  }

  removeItem(item: ItemNfceDTO): void {
    const nfce = this.getNfce();
    nfce.itens = nfce.itens.filter((i) => i.productId !== item.productId);
    this.saveNfce(nfce);
  }

  updateQuantity(item: ItemNfceDTO, quantidade: number): void {
    const nfce = this.getNfce();
    const existingItem = nfce.itens.find((i) => i.productId === item.productId);

    if (existingItem) {
      if (quantidade >= 1) {
        existingItem.quantidade = quantidade;
      } else {
        this.removeItem(item);
        return;
      }
      this.saveNfce(nfce);
    }
  }
}
