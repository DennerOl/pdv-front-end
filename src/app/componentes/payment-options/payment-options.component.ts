import { Component, Renderer2, RendererFactory2 } from '@angular/core';
import { Product } from 'src/app/types/types';
import { ProductService } from '../services/product.service';
import { NfceService } from '../services/nfce/nfce.service';
import { HttpClient } from '@angular/common/http';
import { NfceRequestDTO } from 'src/app/types/nfceTypes/nfce';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss'],
})
export class PaymentOptionsComponent {
  nfce: NfceRequestDTO | null = null;
  total: number = 0;
  totalWithDiscount: number = 0;
  discount: number = 0;
  isModalOpen: boolean = false;
  paymentType: string = '';
  isAnonymous: boolean = true;
  customerName: string = '';
  customerCpf: string = '';
  amountPaid: number = 0;
  change: number = 0;
  cardType: string = 'debit';
  installments: number = 1;
  installmentValue: number = 0;
  installmentOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private renderer: Renderer2;

  constructor(
    private nfceService: NfceService,
    private http: HttpClient,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngOnInit(): void {
    this.nfceService.nfce$.subscribe((nfce) => {
      this.nfce = nfce;
      this.updateTotals();
    });
  }

  /**
   * Calcula o total e a quantidade total de itens.
   */
  updateTotals(): void {
    if (!this.nfce || !this.nfce.itens) {
      this.total = 0;
      this.totalWithDiscount = 0;
      return;
    }
    this.total = this.nfce.itens.reduce(
      (sum, item) => sum + item.quantidade * item.precoUnitario,
      0
    );
    this.totalWithDiscount = this.total - this.discount;
  }

  /**
   * Abre o modal de pagamento e move para o body.
   * @param formaPagamento Tipo de pagamento
   */
  openPaymentModal(formaPagamento: string): void {
    this.paymentType = formaPagamento;
    this.isModalOpen = true;
    this.isAnonymous = true;
    this.customerName = '';
    this.customerCpf = '';
    this.amountPaid = 0;
    this.change = 0;
    this.discount = 0;
    this.cardType = 'debit';
    this.installments = 1;
    this.installmentValue = 0;
    this.updateTotals();

    // Mover o modal para o body
    setTimeout(() => {
      const modal = document.querySelector(
        'app-payment-options .modal-overlay'
      );
      if (modal) {
        this.renderer.appendChild(document.body, modal);
      }
    }, 0);
  }

  /**
   * Fecha o modal de pagamento e retorna ao componente.
   */
  closePaymentModal(): void {
    // Retornar o modal ao componente
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      const component = document.querySelector('app-payment-options');
      if (component) {
        this.renderer.appendChild(component, modal);
      }
    }
    this.isModalOpen = false;
  }

  /**
   * Alterna entre cliente identificado e anônimo.
   */
  toggleAnonymous(): void {
    if (this.isAnonymous) {
      this.customerName = '';
      this.customerCpf = '';
    }
  }

  /**
   * Atualiza o desconto e recalcula os totais.
   */
  updateDiscount(): void {
    if (this.discount < 0 || this.discount > this.total) {
      this.discount = 0;
    }
    this.totalWithDiscount = this.total - this.discount;
    this.calculateChange();
    this.calculateInstallmentValue();
  }

  /**
   * Calcula o troco para pagamento em dinheiro.
   */
  calculateChange(): void {
    this.change = this.amountPaid - this.totalWithDiscount;
  }

  /**
   * Reseta as parcelas ao mudar o tipo de cartão.
   */
  resetInstallments(): void {
    this.installments = 1;
    this.calculateInstallmentValue();
  }

  /**
   * Calcula o valor de cada parcela para pagamento com cartão de crédito.
   */
  calculateInstallmentValue(): void {
    if (this.cardType === 'credit' && this.installments > 0) {
      this.installmentValue = this.totalWithDiscount / this.installments;
    } else {
      this.installmentValue = 0;
    }
  }

  /**
   * Verifica se o pagamento é válido.
   */
  isPaymentValid(): boolean {
    if (this.paymentType === 'cash') {
      return this.amountPaid >= this.totalWithDiscount;
    }
    if (this.paymentType === 'card') {
      return (
        this.cardType === 'debit' ||
        (this.cardType === 'credit' && this.installments >= 1)
      );
    }
    return false;
  }

  /**
   * Confirma o pagamento e envia o NfceRequestDTO ao back-end.
   */
  confirmPayment(): void {
    if (!this.nfce || !this.nfce.itens.length) {
      alert('Nenhum item na NFC-e.');
      console.error('NFC-e inválida ou sem itens.' + this.nfce);
      return;
    }

    // Monta o NfceRequestDTO
    const nfceRequest: NfceRequestDTO = {
      ...this.nfce,
      qtdeTotalItens: this.nfce.itens.reduce(
        (sum, item) => sum + item.quantidade,
        0
      ),
      valorTotalNota: this.totalWithDiscount,
      itens: this.nfce.itens.map((item) => ({
        ...item,
        totalItem: item.quantidade * item.precoUnitario,
      })),
      pagamentos: [
        {
          tPag: this.getTPagCode(),
          vPag: this.totalWithDiscount,
        },
      ],
      destinatario: this.isAnonymous
        ? {
            cpf: 'XXXXXXXXXXX',
            cnpj: 'XXXXXXXXXXX',
            xNome: 'consumidor não identificado',
            logradouro: 'xxxxxxxxxxxxx',
            numero: '0',
            bairro: 'xxxxxxxxxxxxx',
            cMun: 3304557,
            uf: 'RJ',
            cep: '00000000',
          }
        : {
            cpf: this.customerCpf,
            xNome: this.customerName,
            cMun: 3304557, // Rio de Janeiro
            uf: 'RJ',
          },
    };
    console.log('NFC-e Request:', nfceRequest);
    // Envia ao back-end
    this.nfceService.enviaNfce(nfceRequest).subscribe({
      next: (response) => {
        console.log('NFC-e enviada com sucesso:', response);
        this.nfceService.clearNfce();
        this.closePaymentModal();
      },
      error: (error) => {
        console.error('Erro ao enviar NFC-e:', error);
        alert('Erro ao finalizar a NFC-e.');
      },
    });
  }

  /**
   * Mapeia o tipo de pagamento para o código tPag da NFC-e.
   */
  private getTPagCode(): string {
    switch (this.paymentType) {
      case 'cash':
        return '01';
      case 'card':
        return this.cardType === 'debit' ? '03' : '04';
      case 'check':
        return '02';
      case 'ticket':
        return '10';
      case 'installment':
        return '04';
      case 'pix':
        return '05';
      case 'voucher':
        return '99';
      default:
        return '99';
    }
  }
}
