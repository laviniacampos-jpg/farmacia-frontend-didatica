export interface ProdutoDTO {
    id_produto?: number;
    descricao: string;
    validade?: string | null;
    preco: number;
    qtd_estoque: number;
    qtd_min_estoque: number;
}
