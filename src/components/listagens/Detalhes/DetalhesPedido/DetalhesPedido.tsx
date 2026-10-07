import { useEffect, useState, type JSX } from "react";
import PedidoRequests from "../../../../fetch/PedidoRequests";
import type { PedidoDTO } from "../../../dto/PedidoDTO";

interface DetalhesPedidoProps {
    id_venda: number;
}

function DetalhesPedido({ id_venda }: DetalhesPedidoProps): JSX.Element {
    const [pedido, setPedido] = useState<PedidoDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formatarData = (data?: string | null) => {
        if (!data) return "Não informada";

        return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
    };

    useEffect(() => {
        const buscarPedido = async () => {
            setLoading(true);
            setError(null);

            try {
                const dados = await PedidoRequests.obterPedidoPorId(id_venda);
                setPedido(dados);
            } catch (error) {
                console.error("Erro ao carregar detalhes do pedido:", error);
                setError("Não foi possível carregar os detalhes do pedido.");
            } finally {
                setLoading(false);
            }
        };

        buscarPedido();
    }, [id_venda]);

    if (loading) {
        return (
            <main className="bg-gray-200 flex-1 p-4 sm:p-8">
                <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-8" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2].map((item) => (
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

    if (error || !pedido) {
        return (
            <main className="bg-gray-200 flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 text-center">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Pedido não encontrado</h2>
                    <p className="text-slate-500 mb-6">{error || "Não foi possível encontrar este pedido."}</p>
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
                    Pedido #{pedido.id_venda}
                </h1>
                <p className="text-slate-500 mt-1">Detalhes da venda</p>

                <div className="border-b border-slate-200 my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">ID da venda</span>
                        <span className="text-slate-700 font-medium">{pedido.id_venda}</span>
                    </div>

                    <div>
                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">ID do cliente</span>
                        <span className="text-slate-700 font-medium">{pedido.id_cliente}</span>
                    </div>

                    <div className="md:col-span-2">
                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Data da venda</span>
                        <span className="text-slate-700 font-medium">{formatarData(pedido.data_venda)}</span>
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

export default DetalhesPedido;
