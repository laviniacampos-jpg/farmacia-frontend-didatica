import { useEffect, useState, type JSX } from "react";
import ClienteRequests from "../../../../fetch/ClienteRequest";
import type { ClienteDTO } from "../../../dto/ClienteDTO";

interface DetalhesClienteProps {
    id_cliente: number;
}

function DetalhesCliente({ id_cliente }: DetalhesClienteProps): JSX.Element {
    const [cliente, setCliente] = useState<ClienteDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const buscarCliente = async () => {
            setLoading(true);
            setError(null);

            try {
                const dados = await ClienteRequests.obterItemPorId(id_cliente);
                setCliente(dados);
            } catch (error) {
                console.error("Erro ao carregar detalhes do cliente:", error);
                setError("Não foi possível carregar os detalhes do cliente.");
            } finally {
                setLoading(false);
            }
        };

        buscarCliente();
    }, [id_cliente]);

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

    if (error || !cliente) {
        return (
            <main className="bg-gray-200 flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 text-center">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Cliente não encontrado</h2>
                    <p className="text-slate-500 mb-6">{error || "Não foi possível encontrar este cliente."}</p>
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
                    Cliente #{id_cliente}
                </h1>
                <p className="text-slate-500 mt-1">Detalhes do cliente</p>

                <div className="border-b border-slate-200 my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">ID</span>
                        <span className="text-slate-700 font-medium">{cliente.idCliente ?? id_cliente}</span>
                    </div>

                    <div>
                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Nome</span>
                        <span className="text-slate-700 font-medium">{cliente.nome}</span>
                    </div>

                    <div className="md:col-span-2">
                        <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">CPF</span>
                        <span className="text-slate-700 font-medium">{cliente.cpf}</span>
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

export default DetalhesCliente;
