export interface NfceRequestDTO {
  id?: number; // Identificador da NFC-e (opcional, preenchido pelo back-end)
  itens: ItemNfceDTO[]; // Lista de itens da venda
  qtdeTotalItens: number; // Quantidade total de itens (soma das quantidades)
  valorTotalNota: number; // Valor total da nota (soma dos totais dos itens, menos desconto)
  pagamentos: PagamentoDTO[]; // Lista de pagamentos da venda
  destinatario?: DestinatarioDTO; // Dados do cliente (opcional, para CPF ou entregas)
  tpEmis: number; // Tipo de emissão (1 = normal, 9 = contingência)
  xJust?: string; // Justificativa para contingência (obrigatório se tpEmis = 9)
}

/**
 * Interface para um item da NFC-e.
 * Representa um produto selecionado na venda.
 */
export interface ItemNfceDTO {
  productId: number; // ID do produto no banco (referência à entidade Product)
  codigo_principal?: string; // Código interno do produto (opcional, para identificação)
  descricao: string; // Descrição do produto (ex.: "Pão de Sal")
  quantidade: number; // Quantidade comprada (ex.: 2.0)
  precoUnitario: number; // Preço unitário do produto (ex.: 5.00)
  totalItem: number; // Subtotal do item (quantidade * precoUnitario)
}

export interface PagamentoDTO {
  tPag: string; // Meio de pagamento (ex.: "01" = Dinheiro, "03" = Cartão de Crédito)
  vPag: number; // Valor pago (ex.: 10.00)
}

export interface DestinatarioDTO {
  cpf?: string;
  cnpj?: string;
  xNome?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cMun?: number; // Código do município (ex.: 3304557 = Rio de Janeiro)
  uf?: string; // Unidade Federativa (ex.: "RJ")
  cep?: string; // CEP (8 dígitos)
}
