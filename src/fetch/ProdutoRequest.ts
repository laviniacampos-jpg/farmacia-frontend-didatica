import type { ProdutoDTO } from "../components/dto/ProdutoDTO";

class ProdutoRequests {

    private endpoint: string;

    constructor() {
        this.endpoint = "http://localhost:3333/produtos";
    }

    async criar(produto: ProdutoDTO) {
        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                this.endpoint,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        descricao: produto.descricao,
                        validade: produto.validade ?? null,
                        preco: produto.preco,
                        qtdEstoque: produto.qtd_estoque,
                        qtdMinEstoque: produto.qtd_min_estoque,
                    })
                }
            );

            if (!response.ok) {
                const corpo = await response.text();
                let mensagem = "Erro ao cadastrar produto.";

                if (corpo) {
                    try {
                        const dados = JSON.parse(corpo) as {
                            message?: string;
                                mensagem?: string;
                            error?: string;
                            detail?: string;
                        };
                            mensagem = dados.message ?? dados.mensagem ?? dados.error ?? dados.detail ?? corpo;
                    } catch {
                        mensagem = corpo;
                    }
                }

                throw Object.assign(new Error(mensagem), {
                    status: response.status,
                });
            }

            return true;

        } catch (error) {
            console.error("Erro na requisição de cadastro:", error);
            throw error;
        }
    }

    async listar() {
        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                this.endpoint,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) return [];
            const produtos = await response.json() as Array<ProdutoDTO & {
                idProduto?: number;
                qtdEstoque?: number;
                qtdMinEstoque?: number;
            }>;

            return Array.isArray(produtos) ? produtos.map((produto) => ({
                id_produto: produto.id_produto ?? produto.idProduto,
                descricao: produto.descricao,
                validade: produto.validade,
                preco: Number(produto.preco),
                qtd_estoque: Number(produto.qtd_estoque ?? produto.qtdEstoque ?? 0),
                qtd_min_estoque: Number(produto.qtd_min_estoque ?? produto.qtdMinEstoque ?? 0),
            })) : [];

        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async obterProdutoPorId(id: number) {

        try {
            const resposta = await this.listar();
            const produto = resposta.find((item: ProdutoDTO) => item.id_produto === id);
            if (!produto) throw new Error("Produto não encontrado.");
            return produto;

        } catch (error) {

            console.error(
                "Erro ao buscar produto por ID:",
                error
            );

            throw error;
        }
    }
}

export default new ProdutoRequests();