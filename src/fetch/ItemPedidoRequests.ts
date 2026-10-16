import type { ItemPedidoDTO } from "../components/dto/IntemPedidoDTO";

interface ItemPedidoResposta extends ItemPedidoDTO {
    id_venda: number;
    id_produto: number;
}

class ItemPedidoRequests {

    private endpoint: string;

    constructor() {
        this.endpoint = "http://localhost:3333/itens";
    }

    async criar(item: ItemPedidoDTO & { idVenda: number }) {
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
                    body: JSON.stringify(item)
                }
            );

            if (!response.ok) {
                const corpo = await response.text();
                let mensagem = "Erro ao cadastrar item do pedido.";

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
            console.error("Erro ao criar item do pedido:", error);
            throw error;
        }
    }

    async listar(idVenda?: number): Promise<ItemPedidoResposta[]> {
        try {

            if (!idVenda) return [];

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${this.endpoint}/${idVenda}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) return [];
            const itens = await response.json() as Array<Partial<ItemPedidoResposta>>;
            return Array.isArray(itens) ? itens.map((item) => ({
                ...item,
                id_venda: idVenda,
                id_produto: Number(item.id_produto ?? item.idProduto),
                idProduto: Number(item.idProduto ?? item.id_produto),
                qtdProduto: Number(item.qtdProduto),
                precoUnit: Number(item.precoUnit),
            })) as ItemPedidoResposta[] : [];

        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async obterItemPorId(id: number) {

        try {
            const itens = await this.listar(id);
            if (!itens.length) throw new Error("Item do pedido não encontrado.");
            return itens;

        } catch (error) {

            console.error(
                "Erro ao buscar item do pedido por ID:",
                error
            );

            throw error;
        }
    }
}

export default new ItemPedidoRequests();