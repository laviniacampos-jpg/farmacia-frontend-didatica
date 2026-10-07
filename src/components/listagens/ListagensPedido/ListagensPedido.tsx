import { type JSX, useEffect, useState } from "react";

import PedidoRequests from "../../../fetch/PedidoRequests";

import type { PedidoDTO } from "../../dto/PedidoDTO";

function ListagemPedidos(): JSX.Element {

    const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [busca, setBusca] = useState("");

    const rowsPerPage = 5;

    const formatarData = (data?: string | null) => {
        if (!data) return "Não informada";

        return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
    };

    // =====================================================
    // BUSCAR PEDIDOS
    // =====================================================

    useEffect(() => {

        const buscarPedidos = async () => {

            try {

                const listaDePedidos =
                    await PedidoRequests.listar();

                setPedidos(Array.isArray(listaDePedidos) ? listaDePedidos : []);

            } catch (error) {

                console.error(
                    `Erro ao buscar pedidos: ${error}`
                );
                setPedidos([]);
                alert("Erro ao carregar a listagem de pedidos.");
            }
        };

        buscarPedidos();

    }, []);


    // =====================================================
    // FILTRO DE PEDIDOS
    // =====================================================

    const pedidosFiltrados = (pedidos || []).filter((pedido) => {

        const textoBusca = busca.trim().toLowerCase();

        return (
            pedido.id_venda?.toString().includes(textoBusca) ||
            pedido.id_cliente.toString().includes(textoBusca)
        );
    });


    // =====================================================
    // PAGINAÇÃO
    // =====================================================

    const totalPages = Math.ceil(
        pedidosFiltrados.length / rowsPerPage
    );

    const indexOfLastRow = currentPage * rowsPerPage;

    const indexOfFirstRow =
        indexOfLastRow - rowsPerPage;

    const currentPedidos =
        pedidosFiltrados.slice(
            indexOfFirstRow,
            indexOfLastRow
        );


    const paginate = (pageNumber: number) => {

        setCurrentPage(pageNumber);

    };


    // =====================================================
    // RETORNO
    // =====================================================

    return (

        <main className="bg-gray-200 flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-6 md:py-10 overflow-hidden">

            {/* CABEÇALHO */}

            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-6 md:mb-8 flex-shrink-0">

                <h1 className="flex-1 text-xl sm:text-2xl md:text-3xl text-center sm:text-left font-bold text-slate-800">

                    Pedidos

                </h1>

                <span className="text-sm text-slate-500">
                    {pedidos.length} pedido(s)
                </span>

            </div>


            {/* CAMPO DE BUSCA */}

            <input
                type="text"
                name="busca-pedido"
                id="busca-pedido"
                value={busca}
                onChange={(e) => {

                    setBusca(e.target.value);

                    setCurrentPage(1);

                }}
                placeholder="Buscar por código do pedido ou cliente"
                className="w-full max-w-6xl mx-auto p-3 md:p-2 md:mb-4 border-b-2 border-slate-700 rounded-sm focus:outline-none"
            />


            {/* TABELA */}

            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden">

                <div className="flex-1 overflow-auto overscroll-none">

                    <table className="table-auto w-full border-collapse text-xs sm:text-sm md:text-base">

                        {/* CABEÇALHO */}

                        <thead className="bg-slate-700 sticky top-0 z-10 shadow-sm">

                            <tr>

                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">
                                    Pedido
                                </th>

                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">
                                    Cliente
                                </th>

                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">
                                    Data da venda
                                </th>

                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-center">
                                    Ações
                                </th>

                            </tr>

                        </thead>


                        {/* CORPO */}

                        <tbody className="divide-y divide-slate-200">

                            {currentPedidos.length > 0 ? (

                                currentPedidos.map((pedido) => (

                                    <tr
                                        key={pedido.id_venda}
                                        className="text-center md:text-left transition-colors hover:bg-slate-50 group"
                                    >

                                        {/* PEDIDO */}

                                        <td className="p-3 md:p-4 text-slate-700 font-semibold">

                                            #{pedido.id_venda}

                                        </td>


                                        {/* CLIENTE */}

                                        <td className="p-3 md:p-4 text-slate-700">

                                            {pedido.id_cliente}

                                        </td>


                                        {/* DATA */}

                                        <td className="p-3 md:p-4 text-slate-600">

                                            {formatarData(pedido.data_venda)}

                                        </td>


                                        {/* AÇÕES */}

                                        <td className="p-2 md:p-4">

                                            <span className="text-xs text-slate-500">
                                                Sem ações
                                            </span>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={4}
                                        className="text-center p-10 text-slate-500 italic"
                                    >

                                        Nenhum pedido encontrado

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* PAGINAÇÃO */}

                <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between flex-shrink-0">


                    {/* MOBILE */}

                    <div className="flex-1 flex justify-between sm:hidden">

                        <button
                            type="button"
                            onClick={() =>
                                paginate(
                                    Math.max(
                                        1,
                                        currentPage - 1
                                    )
                                )
                            }
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ${
                                currentPage === 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >

                            Anterior

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                paginate(
                                    Math.min(
                                        totalPages,
                                        currentPage + 1
                                    )
                                )
                            }
                            disabled={
                                currentPage === totalPages ||
                                totalPages === 0
                            }
                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ${
                                currentPage === totalPages ||
                                totalPages === 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >

                            Próximo

                        </button>

                    </div>


                    {/* DESKTOP */}

                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">

                        <div>

                            <p className="text-sm text-slate-700">

                                Mostrando{" "}

                                <span className="font-semibold">

                                    {pedidosFiltrados.length > 0
                                        ? indexOfFirstRow + 1
                                        : 0}

                                </span>{" "}

                                até{" "}

                                <span className="font-semibold">

                                    {Math.min(
                                        indexOfLastRow,
                                        pedidosFiltrados.length
                                    )}

                                </span>{" "}

                                de{" "}

                                <span className="font-semibold">

                                    {pedidosFiltrados.length}

                                </span>{" "}

                                resultados

                            </p>

                        </div>


                        <div>

                            <nav
                                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                aria-label="Pagination"
                            >

                                {/* ANTERIOR */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        paginate(
                                            Math.max(
                                                1,
                                                currentPage - 1
                                            )
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 ${
                                        currentPage === 1
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >

                                    <span className="sr-only">
                                        Anterior
                                    </span>

                                    <i className="pi pi-chevron-left"></i>

                                </button>


                                {/* PÁGINAS */}

                                {[...Array(totalPages)].map(
                                    (_, i) => (

                                        <button
                                            type="button"
                                            key={i + 1}
                                            onClick={() =>
                                                paginate(i + 1)
                                            }
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                currentPage ===
                                                i + 1
                                                    ? "z-10 bg-slate-700 border-slate-700 text-white"
                                                    : "bg-white border-slate-300 text-slate-500 hover:bg-slate-50"
                                            }`}
                                        >

                                            {i + 1}

                                        </button>

                                    )
                                )}


                                {/* PRÓXIMO */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        paginate(
                                            Math.min(
                                                totalPages,
                                                currentPage + 1
                                            )
                                        )
                                    }
                                    disabled={
                                        currentPage === totalPages ||
                                        totalPages === 0
                                    }
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 ${
                                        currentPage === totalPages ||
                                        totalPages === 0
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >

                                    <span className="sr-only">
                                        Próximo
                                    </span>

                                    <i className="pi pi-chevron-right"></i>

                                </button>

                            </nav>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default ListagemPedidos;