import { type FormEvent, type JSX, useEffect, useMemo, useState } from "react";

import Navegacao from "../../components/Navegação/Navegacao";
import Rodape from "../../components/Rodape/Rodape";
import ClienteRequests from "../../fetch/ClienteRequest";
import PedidoRequests from "../../fetch/PedidoRequests";
import ProdutoRequests from "../../fetch/ProdutoRequest";
import type { ClienteDTO } from "../../components/dto/ClienteDTO";
import type { ProdutoDTO } from "../../components/dto/ProdutoDTO";
import type { ItemPedidoDTO } from "../../components/dto/IntemPedidoDTO";

interface ItemSelecionado extends ItemPedidoDTO {
    descricao: string;
}

function PPedido(): JSX.Element {
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [clienteId, setClienteId] = useState("");
    const [produtosSelecionados, setProdutosSelecionados] = useState<ItemSelecionado[]>([]);
    const [quantidades, setQuantidades] = useState<Record<number, number>>({});
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [listaClientes, listaProdutos] = await Promise.all([
                    ClienteRequests.listar(),
                    ProdutoRequests.listar(),
                ]);

                setClientes(Array.isArray(listaClientes) ? listaClientes : []);
                setProdutos(Array.isArray(listaProdutos) ? listaProdutos : []);
            } catch (error) {
                setErro(error instanceof Error ? error.message : "Não foi possível carregar os dados.");
            }
        };

        carregarDados();
    }, []);

    const totalPedido = useMemo(
        () => produtosSelecionados.reduce(
            (total, item) => total + item.qtdProduto * item.precoUnit,
            0,
        ),
        [produtosSelecionados],
    );

    const adicionarProduto = (produto: ProdutoDTO) => {
        const idProduto = Number(produto.id_produto);

        if (!Number.isFinite(idProduto) || idProduto <= 0) {
            setErro("O produto selecionado não possui identificador válido.");
            return;
        }

        const quantidade = quantidades[idProduto] ?? 1;

        if (quantidade <= 0) {
            setErro("A quantidade deve ser maior que zero.");
            return;
        }

        const existe = produtosSelecionados.some((item) => item.idProduto === idProduto);

        if (existe) {
            setProdutosSelecionados((itens) => itens.map((item) =>
                item.idProduto === idProduto
                    ? { ...item, qtdProduto: quantidade }
                    : item,
            ));
        } else {
            setProdutosSelecionados((itens) => [
                ...itens,
                {
                    idProduto,
                    qtdProduto: quantidade,
                    precoUnit: produto.preco,
                    descricao: produto.descricao,
                },
            ]);
        }

        setQuantidades((dados) => ({
            ...dados,
            [idProduto]: quantidade,
        }));
        setErro(null);
    };

    const atualizarQuantidade = (idProduto: number, quantidade: number) => {
        if (quantidade <= 0) {
            setProdutosSelecionados((itens) => itens.filter((item) => item.idProduto !== idProduto));
            return;
        }

        setQuantidades((dados) => ({ ...dados, [idProduto]: quantidade }));
        setProdutosSelecionados((itens) => itens.map((item) =>
            item.idProduto === idProduto ? { ...item, qtdProduto: quantidade } : item,
        ));
    };

    const removerProduto = (idProduto: number) => {
        setProdutosSelecionados((itens) => itens.filter((item) => item.idProduto !== idProduto));
        setQuantidades((dados) => {
            const novo = { ...dados };
            delete novo[idProduto];
            return novo;
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErro(null);
        setSucesso(null);

        if (!clienteId) {
            setErro("Selecione um cliente.");
            return;
        }

        if (produtosSelecionados.length === 0) {
            setErro("Selecione pelo menos um produto.");
            return;
        }

        setCarregando(true);

        try {
            const pedidoCriado = await PedidoRequests.criar({
                idCliente: Number(clienteId),
                itens: produtosSelecionados.map(({ idProduto, qtdProduto, precoUnit }) => ({
                    idProduto,
                    qtdProduto,
                    precoUnit,
                })),
            });

            if (!pedidoCriado.idVenda) {
                throw new Error("Não foi possível criar o pedido.");
            }

            setSucesso("Pedido cadastrado com sucesso.");
            setProdutosSelecionados([]);
            setClienteId("");
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível cadastrar o pedido.");
        } finally {
            setCarregando(false);
        }
    };

    const formatarPreco = (preco: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(preco);

    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />

            <main className="bg-gray-200 flex-1 px-4 py-6 sm:px-6 sm:py-10 overflow-y-auto">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Pedido</h1>
                    <p className="text-slate-500 mt-1">Selecione um cliente e os produtos desejados.</p>

                    <form onSubmit={handleSubmit} className="mt-7">
                        <label className="block max-w-md">
                            <span className="block text-sm font-semibold text-slate-700 mb-1">Cliente</span>
                            <select
                                value={clienteId}
                                onChange={(event) => setClienteId(event.target.value)}
                                required
                                className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:border-slate-700"
                            >
                                <option value="">Selecione um cliente</option>
                                {clientes.map((cliente) => (
                                    <option key={cliente.idCliente ?? cliente.nome} value={cliente.idCliente ?? ""}>
                                        {cliente.nome} — {cliente.cpf}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <section className="mt-8">
                            <h2 className="text-lg font-bold text-slate-800">Produtos disponíveis</h2>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {produtos.map((produto) => (
                                    <article key={produto.id_produto} className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-bold text-slate-800">{produto.descricao}</h3>
                                                <p className="mt-1 text-sm text-slate-500">Produto #{produto.id_produto}</p>
                                            </div>
                                            <span className="font-bold text-emerald-600">{formatarPreco(produto.preco)}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => adicionarProduto(produto)}
                                            className="mt-4 w-full rounded-md bg-slate-700 px-4 py-2 font-bold text-white hover:bg-slate-600"
                                        >
                                            Adicionar ao pedido
                                        </button>
                                    </article>
                                ))}
                                {produtos.length === 0 && (
                                    <p className="text-slate-500">Nenhum produto está disponível.</p>
                                )}
                            </div>
                        </section>

                        <section className="mt-8">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-lg font-bold text-slate-800">Produtos selecionados</h2>
                                <span className="text-sm font-bold text-slate-600">{produtosSelecionados.length} item(s)</span>
                            </div>

                            {produtosSelecionados.length > 0 ? (
                                <div className="mt-4 space-y-3">
                                    {produtosSelecionados.map((item) => (
                                        <article key={item.idProduto} className="rounded-lg border border-slate-200 p-4">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{item.descricao}</h3>
                                                    <p className="text-sm text-slate-500">{formatarPreco(item.precoUnit)} por unidade</p>
                                                </div>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                    Quantidade
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.qtdProduto}
                                                        onChange={(event) => atualizarQuantidade(item.idProduto, Number(event.target.value))}
                                                        className="w-24 border border-slate-300 rounded-md p-2"
                                                    />
                                                </label>
                                                <div className="flex items-center justify-between gap-5 sm:justify-end">
                                                    <span className="font-bold text-emerald-700">{formatarPreco(item.qtdProduto * item.precoUnit)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removerProduto(item.idProduto)}
                                                        className="rounded-md bg-red-100 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-200"
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
                                    Nenhum produto foi adicionado ao pedido.
                                </div>
                            )}
                        </section>

                        {erro && <p className="mt-5 rounded-md bg-red-100 p-3 text-red-700 font-medium">{erro}</p>}
                        {sucesso && <p className="mt-5 rounded-md bg-emerald-100 p-3 text-emerald-700 font-medium">{sucesso}</p>}

                        <div className="mt-7 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <span className="text-sm text-slate-500">Valor total</span>
                                <p className="text-2xl font-bold text-emerald-700">{formatarPreco(totalPedido)}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="rounded-md border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-100"
                                >
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    disabled={carregando}
                                    className="rounded-md bg-slate-700 px-5 py-3 font-bold text-white hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {carregando ? "Cadastrando..." : "Criar pedido"}
                                </button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </main>

            <Rodape />
        </div>
    );
}

export default PPedido;
