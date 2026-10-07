import { useEffect, useState, type JSX } from "react";
import ItemPedidoRequests from "../../../../fetch/ItemPedidoRequests";
import type { ItemPedidoDTO } from "../../../dto/IntemPedidoDTO";

interface ItemPedidoApi extends ItemPedidoDTO {
    id_produto?: number;
    id_venda?: number;
}

interface DetalhesItemPedidoProps {
    id_venda: number;
    id_produto: number;
}

function DetalhesItemPedido({ id_venda, id_produto }: DetalhesItemPedidoProps): JSX.Element {
    const [item, setItem] = useState<ItemPedidoApi | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formatarPreco = (preco: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(preco);

    useEffect(() => {
        const buscarItem = async () => {
            setLoading(true);
            setError(null);

            try {
                const itens = await ItemPedidoRequests.listar();
                const itemEncontrado = Array.isArray(itens)
                    ? itens.find((itemAtual: ItemPedidoApi) =>
                        Number(itemAtual.id_venda) === id_venda &&
                        Number(itemAtual.id_produto) === id_produto
                    )
                    : null;

                if (!itemEncontrado) {
                    setError("Item do pedido não encontrado.");
                    return;
                }

                setItem(itemEncontrado);
            } catch (error) {
                console.error("Erro ao carregar detalhes do item do pedido:", error);
                setError("Não foi possível carregar os detalhes do item do pedido.");
            } finally {
                setLoading(false);
            }
        };

        buscarItem();
    }, [id_produto, id_venda]);

    if (loading) {
        return (
            <main className="bg-gray-200 flex-1 p-4 sm:p-8">
                <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-8" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3].map((item) => (
                                <div key={item}>
                                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                                    <div className="h-6 bg-gray-200 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !item) {
        return (
            <main className="bg-gray-200 flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 text-center">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Item não encontrado</h2>
                    <p className="text-slate-500 mb-6">{error || "Não foi possível encontrar este item."}</p>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-md font-bold"
                    >
                        Voltar
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-gray-200 flex-1 py-6 sm:py-10 px-4 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Item do pedido #{id_venda}
                </h1>
                <p className="text-slate-500 mt-1">Detalhes do produto no pedido</p>

                <div className="border-b border-slate-200 my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Produto</span>
                        <span className="text-slate-700 font-medium">#{item.id_produto ?? id_produto}</span>
                    </div>

                    <div>
                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Venda</span>
                        <span className="text-slate-700 font-medium">#{id_venda}</span>
                    </div>

                    <div>
                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Quantidade</span>
                        <span className="text-slate-700 font-medium">{item.qtdProduto} unidade(s)</span>
                    </div>

                    <div>
                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Preço unitário</span>
                        <span className="text-emerald-600 font-bold text-xl">{formatarPreco(item.precoUnit)}</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-full mt-8 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-3 rounded-md font-bold"
                >
                    Voltar
                </button>
            </div>
        </main>
    );
}

export default DetalhesItemPedido;
