export interface NfceRequestDTO {
  id?: number;
  itens: ItemNfceDTO[];
  pagamentos: PagamentoDTO[];
  destinatario?: DestinatarioDTO;
  tpEmis: number; // Tipo de emissão (1 = normal, 9 = contingência)
  xJust?: string; // Justificativa para contingência (obrigatório se tpEmis = 9)
}

export interface ItemNfceDTO {
  productId: number; // ID do produto no banco (referência à entidade Product)
  codigo_principal?: string; // Código interno do produto (opcional, para identificação)
  descricao: string; // Descrição do produto (ex.: "Pão de Sal")
  quantidade: number; // Quantidade comprada (ex.: 2.0)
  precoUnitario: number; // Preço unitário do produto (ex.: 5.00)
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
