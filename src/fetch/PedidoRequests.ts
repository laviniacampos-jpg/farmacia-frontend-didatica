import type { ItemPedidoDTO } from "../components/dto/IntemPedidoDTO";
import type { PedidoDTO } from "../components/dto/PedidoDTO";

interface NovoPedidoDTO {
    idCliente: number;
    itens: ItemPedidoDTO[];
}

interface PedidoCriadoDTO {
    idVenda: number;
    mensagem?: string;
}

interface PedidoApiDTO {
    id_venda?: number;
    idVenda?: number;
    id_cliente?: number;
    idCliente?: number;
    data_venda?: string;
    dataVenda?: string;
    nomeCliente?: string;
}

class PedidoRequests {

    private endpoint: string;

    constructor() {
        this.endpoint = "http://localhost:3333/pedidos";
    }

    async criar(pedido: NovoPedidoDTO): Promise<PedidoCriadoDTO> {
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

            return await response.json() as PedidoCriadoDTO;

        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            throw error;
        }
    }

    async listar(): Promise<PedidoDTO[]> {
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
            const pedidos = await response.json() as PedidoApiDTO[];
            return Array.isArray(pedidos) ? pedidos.map((pedido) => ({
                id_venda: pedido.id_venda ?? pedido.idVenda,
                id_cliente: pedido.id_cliente ?? pedido.idCliente ?? 0,
                data_venda: pedido.data_venda ?? pedido.dataVenda,
            })) : [];

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