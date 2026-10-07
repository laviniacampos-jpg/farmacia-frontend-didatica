import type { ProdutoDTO } from "../components/dto/ProdutoDTO";

class ProdutoRequests {

    private endpoint: string;

    constructor() {
        this.endpoint = "http://localhost:3333/api/produtos";
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
                    body: JSON.stringify(produto)
                }
            );

            if (!response.ok) {
                const corpo = await response.text();
                let mensagem = "Erro ao cadastrar produto.";

                if (corpo) {
                    try {
                        const dados = JSON.parse(corpo) as {
                            message?: string;
                            error?: string;
                            detail?: string;
                        };
                        mensagem = dados.message ?? dados.error ?? dados.detail ?? corpo;
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

            return await response.json();

        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async obterProdutoPorId(id: number) {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${this.endpoint}/${id}`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type": "application/json",
                        ...(token
                            ? {
                                Authorization: `Bearer ${token}`
                            }
                            : {})
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Produto não encontrado.");
            }

            return await response.json();

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