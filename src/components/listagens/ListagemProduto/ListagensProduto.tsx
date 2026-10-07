import { type JSX, useEffect, useState } from "react";

import ProdutoRequests from "../../../fetch/ProdutoRequest";

import type { ProdutoDTO } from "../../dto/ProdutoDTO";

function ListagemProdutos(): JSX.Element {

    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [busca, setBusca] = useState("");

    const rowsPerPage = 5;

    const formatarPreco = (preco: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(preco);

    const formatarData = (data?: string | null) => {
        if (!data) return "Não informada";

        return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
    };

    // =====================================================
    // BUSCAR PRODUTOS
    // =====================================================

    useEffect(() => {

        const buscarProdutos = async () => {

            try {

                const listaDeProdutos =
                    await ProdutoRequests.listar();

                setProdutos(Array.isArray(listaDeProdutos) ? listaDeProdutos : []);

            } catch (error) {

                console.error(
                    `Erro ao buscar produtos: ${error}`
                );
                setProdutos([]);
                alert("Erro ao criar a listagem de produtos.");
            }
        };

        buscarProdutos();

    }, []);


    // =====================================================
    // FILTRO DE PRODUTOS
    // =====================================================

    const produtosFiltrados = (produtos || []).filter((produto) => {

        const textoBusca = busca.toLowerCase();

        return produto.descricao.toLowerCase().includes(textoBusca);
    });


    // =====================================================
    // PAGINAÇÃO
    // =====================================================

    const totalPages = Math.ceil(
        produtosFiltrados.length / rowsPerPage
    );

    const indexOfLastRow = currentPage * rowsPerPage;

    const indexOfFirstRow =
        indexOfLastRow - rowsPerPage;

    const currentProdutos =
        produtosFiltrados.slice(
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

                    Produtos

                </h1>


                <button
                    type="button"
                    onClick={() => window.location.href = "/cadastro/produto"}
                    className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-slate-700 rounded-md text-center text-white font-bold flex items-center justify-center hover:cursor-pointer hover:bg-slate-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                >

                    Novo Produto

                </button>

            </div>


            {/* CAMPO DE BUSCA */}

            <input
                type="text"
                name="busca-produto"
                id="busca-produto"
                value={busca}
                onChange={(e) => {

                    setBusca(e.target.value);

                    setCurrentPage(1);

                }}
                placeholder="Buscar produto pela descrição"
                className="w-full max-w-6xl mx-auto p-3 md:p-2 md:mb-4 border-b-2 border-slate-700 rounded-sm focus:outline-none"
            />


            {/* TABELA */}

            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden">

                <div className="flex-1 overflow-auto overscroll-none">

                    <table className="table-auto w-full border-collapse text-xs sm:text-sm md:text-base">

                        {/* CABEÇALHO */}

                        <thead className="bg-slate-700 sticky top-0 z-10 shadow-sm">

                            <tr>

                                <th className="border-b border-slate-600 text-white p-3 md:p-4 hidden md:table-cell text-left">
                                    ID
                                </th>

                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">
                                    Descrição
                                </th>

                                <th className="border-b border-slate-600 text-white p-3 md:p-4 hidden sm:table-cell text-left">
                                    Validade
                                </th>

                                <th className="border-b border-slate-600 text-white p-3 md:p-4 hidden md:table-cell text-right">
                                    Preço
                                </th>

                                <th className="border-b border-slate-600 text-white p-3 md:p-4 hidden lg:table-cell text-center">
                                    Estoque
                                </th>

                                <th className="border-b border-slate-600 text-white p-3 md:p-4 hidden xl:table-cell text-center">
                                    Estoque mínimo
                                </th>

                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-center">
                                    Ações
                                </th>

                            </tr>

                        </thead>


                        {/* CORPO */}

                        <tbody className="divide-y divide-slate-200">

                            {currentProdutos.length > 0 ? (

                                currentProdutos.map((produto) => (

                                    <tr
                                        key={produto.id_produto}
                                        className="text-center md:text-left transition-colors hover:bg-slate-50 group"
                                    >

                                        {/* ID */}

                                        <td className="p-3 md:p-4 hidden md:table-cell text-slate-500">

                                            {produto.id_produto}

                                        </td>


                                        {/* DESCRIÇÃO */}

                                        <td className="p-3 md:p-4 text-slate-700 font-semibold">

                                            {produto.descricao}

                                        </td>


                                        {/* VALIDADE */}

                                        <td className="p-3 md:p-4 hidden sm:table-cell text-slate-600">

                                            {formatarData(produto.validade)}

                                        </td>


                                        {/* PREÇO */}

                                        <td className="p-3 md:p-4 hidden md:table-cell text-right text-slate-600">

                                            {formatarPreco(produto.preco)}

                                        </td>


                                        {/* ESTOQUE */}

                                        <td className="p-3 md:p-4 hidden lg:table-cell text-center text-slate-600">

                                            {produto.qtd_estoque}

                                        </td>


                                        {/* ESTOQUE MÍNIMO */}

                                        <td className="p-3 md:p-4 hidden xl:table-cell text-center text-slate-600">

                                            {produto.qtd_min_estoque}

                                        </td>


                                        {/* AÇÕES */}

                                        <td className="p-2 md:p-4">

                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 md:gap-2">

                                                {/* AÇÃO INDISPONÍVEL ATÉ A IMPLEMENTAÇÃO DOS DETALHES */}

                                                <span className="text-xs text-slate-500">
                                                    Sem ações
                                                </span>


                                                {/* DELETAR */}

                                                <button
                                                    type="button"
                                                    className="w-full sm:w-auto bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium hover:bg-red-600 hover:text-white transition-all"
                                                >

                                                    Deletar

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="text-center p-10 text-slate-500 italic"
                                    >

                                        Nenhum produto encontrado

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

                                    {produtosFiltrados.length > 0
                                        ? indexOfFirstRow + 1
                                        : 0}

                                </span>{" "}

                                até{" "}

                                <span className="font-semibold">

                                    {Math.min(
                                        indexOfLastRow,
                                        produtosFiltrados.length
                                    )}

                                </span>{" "}

                                de{" "}

                                <span className="font-semibold">

                                    {produtosFiltrados.length}

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

export default ListagemProdutos;