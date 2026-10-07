import { type JSX, useEffect, useState } from "react";

import ClienteRequests from "../../../fetch/ClienteRequest";

import type { ClienteDTO } from "../../dto/ClienteDTO";

function ListagemClientes(): JSX.Element {

    const [clientes, setClientes] = useState<ClienteDTO[]>([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [busca, setBusca] = useState("");

    const rowsPerPage = 5;

    const obterIdCliente = (cliente: ClienteDTO & { id_cliente?: number }) =>
        cliente.idCliente ?? cliente.id_cliente;

    const clientesFiltrados = (clientes || []).filter((cliente) => {
        const textoBusca = busca.trim().toLowerCase();
        const idCliente = obterIdCliente(cliente as ClienteDTO & { id_cliente?: number })?.toString() ?? "";

        return (
            idCliente.includes(textoBusca) ||
            cliente.nome.toLowerCase().includes(textoBusca) ||
            cliente.cpf.toLowerCase().includes(textoBusca)
        );
    });

    const totalPages = Math.ceil(
        clientesFiltrados.length / rowsPerPage
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    const currentClientes = clientesFiltrados.slice(
        indexOfFirstRow,
        indexOfLastRow
    );

    useEffect(() => {
        const buscarClientes = async () => {
            try {
                const listaDeClientes = await ClienteRequests.listar();
                setClientes(Array.isArray(listaDeClientes) ? listaDeClientes : []);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
                setClientes([]);
                alert("Erro ao carregar a listagem de clientes.");
            }
        };

        buscarClientes();
    }, []);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <main className="bg-gray-200 flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-6 md:py-10 overflow-hidden">
            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-6 md:mb-8 flex-shrink-0">
                <h1 className="flex-1 text-xl sm:text-2xl md:text-3xl text-center sm:text-left font-bold text-slate-800">
                    Clientes
                </h1>

                <span className="text-sm text-slate-500">
                    {clientes.length} cliente(s)
                </span>
            </div>

            <input
                type="text"
                name="busca-cliente"
                id="busca-cliente"
                value={busca}
                onChange={(event) => {
                    setBusca(event.target.value);
                    setCurrentPage(1);
                }}
                placeholder="Buscar por ID, nome ou CPF"
                className="w-full max-w-6xl mx-auto p-3 md:p-2 md:mb-4 border-b-2 border-slate-700 rounded-sm focus:outline-none"
            />

            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden">
                <div className="flex-1 overflow-auto overscroll-none">
                    <table className="table-auto w-full border-collapse text-xs sm:text-sm md:text-base">
                        <thead className="bg-slate-700 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">
                                    ID
                                </th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">
                                    Nome
                                </th>
                                <th className="border-b border-slate-600 text-white p-3 md:p-4 text-left">
                                    CPF
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">
                            {currentClientes.length > 0 ? (
                                currentClientes.map((cliente) => (
                                    <tr
                                        key={obterIdCliente(cliente) ?? `${cliente.nome}-${cliente.cpf}`}
                                        className="text-center md:text-left transition-colors hover:bg-slate-50"
                                    >
                                        <td className="p-3 md:p-4 text-slate-700 font-semibold">
                                            {obterIdCliente(cliente) ?? "—"}
                                        </td>
                                        <td className="p-3 md:p-4 text-slate-700">
                                            {cliente.nome}
                                        </td>
                                        <td className="p-3 md:p-4 text-slate-600">
                                            {cliente.cpf}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="text-center p-10 text-slate-500 italic"
                                    >
                                        Nenhum cliente encontrado
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between flex-shrink-0">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            type="button"
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Anterior
                        </button>

                        <button
                            type="button"
                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ${currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Próximo
                        </button>
                    </div>

                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-700">
                                Mostrando{" "}
                                <span className="font-semibold">
                                    {clientesFiltrados.length > 0 ? indexOfFirstRow + 1 : 0}
                                </span>{" "}
                                até{" "}
                                <span className="font-semibold">
                                    {Math.min(indexOfLastRow, clientesFiltrados.length)}
                                </span>{" "}
                                de{" "}
                                <span className="font-semibold">
                                    {clientesFiltrados.length}
                                </span>{" "}
                                resultados
                            </p>
                        </div>

                        <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Paginação de clientes"
                        >
                            <button
                                type="button"
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <span className="sr-only">Anterior</span>
                                <i className="pi pi-chevron-left"></i>
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    type="button"
                                    key={index + 1}
                                    onClick={() => paginate(index + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                                        ? "z-10 bg-slate-700 border-slate-700 text-white"
                                        : "bg-white border-slate-300 text-slate-500 hover:bg-slate-50"}`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 ${currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <span className="sr-only">Próximo</span>
                                <i className="pi pi-chevron-right"></i>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ListagemClientes;
