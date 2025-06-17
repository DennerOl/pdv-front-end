import { Component, Renderer2, RendererFactory2 } from '@angular/core';
import { Product } from 'src/app/types/types';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss'],
})
export class PaymentOptionsComponent {
  products: Product[] = [];
  total: number = 0;
  totalWithDiscount: number = 0;
  isModalOpen: boolean = false;
  paymentType: string = '';
  isAnonymous: boolean = true;
  customerName: string = '';
  customerCpf: string = '';
  amountPaid: number = 0;
  change: number = 0;
  discount: number = 0;
  cardType: string = 'debit';
  installments: number = 1;
  installmentValue: number = 0;
  installmentOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private renderer: Renderer2;

  constructor(
    private productService: ProductService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngOnInit(): void {
    this.productService.products$.subscribe((products) => {
      this.products = products;
      this.total = this.getTotal();
      this.updateDiscount();
    });
  }

  getTotal(): number {
    return this.products.reduce(
      (sum, item) => sum + item.quantidade * item.precoVenda,
      0
    );
  }

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
    this.totalWithDiscount = this.total;

    // Mover o modal para o body
    setTimeout(() => {
      const modal = document.getElementById('payment-modal');
      if (modal) {
        this.renderer.appendChild(document.body, modal);
      }
    }, 0);
  }

  closePaymentModal(): void {
    // Remover o modal do body e voltar para o componente
    const modal = document.getElementById('payment-modal');
    if (modal) {
      const component = document.querySelector('app-payment-options');
      if (component) {
        this.renderer.appendChild(component, modal);
      } else {
        this.renderer.removeChild(document.body, modal);
      }
    }
    this.isModalOpen = false;
  }

  toggleAnonymous(): void {
    if (this.isAnonymous) {
      this.customerName = '';
      this.customerCpf = '';
    }
  }

  updateDiscount(): void {
    if (this.discount < 0 || this.discount > this.total) {
      this.discount = 0;
    }
    this.totalWithDiscount = this.total - this.discount;
    this.calculateChange();
    this.calculateInstallmentValue();
  }

  calculateChange(): void {
    this.change = this.amountPaid - this.totalWithDiscount;
  }

  resetInstallments(): void {
    this.installments = 1;
    this.calculateInstallmentValue();
  }

  calculateInstallmentValue(): void {
    if (this.cardType === 'credit' && this.installments > 0) {
      this.installmentValue = this.totalWithDiscount / this.installments;
    } else {
      this.installmentValue = 0;
    }
  }

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
    return true; // Outros tipos (em desenvolvimento)
  }

  confirmPayment(): void {
    const saleData = {
      products: this.products,
      total: this.total,
      discount: this.discount,
      totalWithDiscount: this.totalWithDiscount,
      paymentType: this.paymentType,
      customer: this.isAnonymous
        ? 'Consumidor não identificado'
        : { name: this.customerName, cpf: this.customerCpf },
      change: this.paymentType === 'cash' ? this.change : 0,
      cardType: this.paymentType === 'card' ? this.cardType : null,
      installments:
        this.paymentType === 'card' && this.cardType === 'credit'
          ? this.installments
          : 0,
      installmentValue:
        this.paymentType === 'card' && this.cardType === 'credit'
          ? this.installmentValue
          : 0,
    };
    console.log('Venda confirmada:', saleData);
    // TODO: Enviar saleData para o backend (POST /api/sale)
    this.productService.clearProducts(); // Limpa o carrinho
    this.closePaymentModal();
  }
}
