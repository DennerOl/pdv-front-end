import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemNfceDTO, NfceRequestDTO } from 'src/app/types/nfceTypes/nfce';
import { NfceLocalStorageService } from './nfce-local-storage.service';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NfceService {
  private API: string = environment.API;

  private nfceSubject = new BehaviorSubject<NfceRequestDTO>(
    this.getInicialNfce()
  );
  nfce$ = this.nfceSubject.asObservable();

  constructor(
    private nfceLocalStorage: NfceLocalStorageService,
    private http: HttpClient
  ) {}

  /**
   * Obtém o objeto inicial da NFC-e, do localStorage ou um novo padrão.
   */
  private getInicialNfce(): NfceRequestDTO {
    const savedNfce = this.nfceLocalStorage.get();
    return (
      savedNfce || {
        itens: [],
        qtdeTotalItens: 0,
        valorTotalNota: 0,
        pagamentos: [],
        tpEmis: 1, // Tipo de emissão padrão (1 = normal)
        xJust: '', // Justificativa vazia por padrão
        destinatario: {
          xNome: 'consumidor não identificado',
        }, // Destinatário opcional
      }
    );
  }

  /**
   * Salva a NFC-e no localStorage e atualiza o BehaviorSubject.
   * @param nfce Objeto NFC-e a ser salvo
   */
  saveNfce(nfce: NfceRequestDTO): void {
    this.nfceLocalStorage.save(nfce);
    this.nfceSubject.next({ ...nfce }); // Emite uma cópia para evitar mutações
  }

  /**
   * Obtém a NFC-e atual do localStorage ou inicial.
   */
  getNfce(): NfceRequestDTO {
    return this.nfceLocalStorage.get() || this.getInicialNfce();
  }

  /**
   * Adiciona um produto à NFC-e. Se já existe, incrementa a quantidade.
   * @param produto Dados do produto a adicionar
   */
  addProduto(produto: ItemNfceDTO): void {
    const nfce = this.getNfce();
    const existingItem = nfce.itens.find(
      (item) => item.productId === produto.productId
    );

    if (existingItem) {
      existingItem.quantidade += produto.quantidade || 1;
      existingItem.totalItem =
        existingItem.quantidade * existingItem.precoUnitario;
    } else {
      nfce.itens.push({
        productId: produto.productId,
        codigo_principal: produto.codigo_principal,
        descricao: produto.descricao,
        quantidade: produto.quantidade || 1,
        precoUnitario: produto.precoUnitario,
        totalItem: (produto.quantidade || 1) * produto.precoUnitario,
      });
    }

    nfce.qtdeTotalItens = nfce.itens.reduce(
      (sum, item) => sum + item.quantidade,
      0
    );
    nfce.valorTotalNota = nfce.itens.reduce(
      (sum, item) => sum + item.totalItem,
      0
    );

    this.saveNfce(nfce);
  }

  /**
   * Atualiza a quantidade de um item na NFC-e.
   * @param item Item a ser atualizado
   * @param quantidade Nova quantidade
   */
  updateQuantity(item: ItemNfceDTO, quantidade: number): void {
    const nfce = this.getNfce();
    const existingItem = nfce.itens.find((i) => i.productId === item.productId);

    if (existingItem) {
      if (quantidade >= 1) {
        existingItem.quantidade = quantidade;
        existingItem.totalItem = quantidade * existingItem.precoUnitario;
      } else {
        this.removeItem(item);
        return;
      }
      nfce.qtdeTotalItens = nfce.itens.reduce(
        (sum, item) => sum + item.quantidade,
        0
      );
      nfce.valorTotalNota = nfce.itens.reduce(
        (sum, item) => sum + item.totalItem,
        0
      );
      this.saveNfce(nfce);
    }
  }

  /**
   * Remove um item da NFC-e.
   * @param item Item a ser removido
   */
  removeItem(item: ItemNfceDTO): void {
    const nfce = this.getNfce();
    nfce.itens = nfce.itens.filter((i) => i.productId !== item.productId);
    nfce.qtdeTotalItens = nfce.itens.reduce(
      (sum, item) => sum + item.quantidade,
      0
    );
    nfce.valorTotalNota = nfce.itens.reduce(
      (sum, item) => sum + item.totalItem,
      0
    );
    this.saveNfce(nfce);
  }

  /**
   * Limpa a NFC-e após o envio.
   */
  clearNfce(): void {
    const initialNfce = this.getInicialNfce();
    this.saveNfce(initialNfce);
  }

  enviaNfce(nfce: NfceRequestDTO): Observable<NfceRequestDTO> {
    return this.http.post<NfceRequestDTO>(`${this.API}/nfce`, nfce);
  }
}
