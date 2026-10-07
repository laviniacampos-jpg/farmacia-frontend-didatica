import type { PedidoDTO } from "../components/dto/PedidoDTO";

class PedidoRequests {

    private endpoint: string;

    constructor() {
        this.endpoint = "http://localhost:3333/api/pedido";
    }

    async criar(pedido: PedidoDTO) {
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
                    body: JSON.stringify(pedido)
                }
            );

            if (!response.ok) {
                const corpo = await response.text();
                let mensagem = "Erro ao cadastrar pedido.";

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
            console.error("Erro ao criar pedido:", error);
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
    async obterPedidoPorId(id: number) {

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
                throw new Error("Pedido não encontrado.");
            }

            return await response.json();

        } catch (error) {

            console.error(
                "Erro ao buscar pedido por ID:",
                error
            );

            throw error;
        }
    }
}

export default new PedidoRequests();