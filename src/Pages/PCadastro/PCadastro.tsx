import { type FormEvent, type JSX, useState } from "react";

import Navegacao from "../../components/Navegação/Navegacao";
import Rodape from "../../components/Rodape/Rodape";
import fundoCadastro from "../../assets/ChatGPT Image 7 de out. de 2026, 16_12_48.png";
import ClienteRequests from "../../fetch/ClienteRequest";
import ProdutoRequests from "../../fetch/ProdutoRequest";

type TipoCadastro = "produto" | "cliente";

function PCadastro(): JSX.Element {
    const [tipoCadastro, setTipoCadastro] = useState<TipoCadastro>("produto");
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);

    const [produto, setProduto] = useState({
        descricao: "",
        validade: "",
        preco: "",
        qtd_estoque: "",
        qtd_min_estoque: "",
    });

    const [cliente, setCliente] = useState({
        nome: "",
        cpf: "",
    });

    const atualizarProduto = (field: keyof typeof produto, value: string) => {
        setProduto((dados) => ({ ...dados, [field]: value }));
    };

    const atualizarCliente = (field: keyof typeof cliente, value: string) => {
        setCliente((dados) => ({ ...dados, [field]: value }));
    };

    const limparMensagem = () => {
        setErro(null);
        setSucesso(null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        limparMensagem();
        setCarregando(true);

        try {
            if (tipoCadastro === "produto") {
                const payload = {
                    descricao: produto.descricao.trim(),
                    validade: produto.validade || null,
                    preco: Number(produto.preco),
                    qtd_estoque: Number(produto.qtd_estoque),
                    qtd_min_estoque: Number(produto.qtd_min_estoque),
                };

                if (!payload.descricao || !payload.preco || payload.preco < 0) {
                    throw new Error("Informe descrição e um preço válido.");
                }

                await ProdutoRequests.criar(payload);
                setSucesso("Produto cadastrado com sucesso.");
                setProduto({
                    descricao: "",
                    validade: "",
                    preco: "",
                    qtd_estoque: "",
                    qtd_min_estoque: "",
                });
            } else {
                const payload = {
                    nome: cliente.nome.trim(),
                    cpf: cliente.cpf.replace(/[^0-9]/g, ""),
                };

                if (!payload.nome || payload.cpf.length !== 11) {
                    throw new Error("Informe nome e CPF com 11 caracteres.");
                }

                await ClienteRequests.criar(payload);
                setSucesso("Cliente cadastrado com sucesso.");
                setCliente({ nome: "", cpf: "" });
            }
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível cadastrar.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-950">
            <img
                src={fundoCadastro}
                alt="Imagem de referência do cadastro"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950/90" />

            <Navegacao />

            <main className="relative z-10 flex-1 px-4 py-6 sm:px-6 sm:py-10 overflow-y-auto">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="bg-white/95 rounded-2xl shadow-2xl p-5 backdrop-blur sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Cadastro</h1>
                    <p className="text-slate-500 mt-1">Cadastre produtos ou clientes.</p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 border-b border-slate-200">
                        <button
                            type="button"
                            onClick={() => {
                                setTipoCadastro("produto");
                                limparMensagem();
                            }}
                            className={`flex-1 rounded-t-md px-4 py-3 font-bold transition-colors ${
                                tipoCadastro === "produto"
                                    ? "bg-slate-700 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            Produto
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTipoCadastro("cliente");
                                limparMensagem();
                            }}
                            className={`flex-1 rounded-t-md px-4 py-3 font-bold transition-colors ${
                                tipoCadastro === "cliente"
                                    ? "bg-slate-700 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            Cliente
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {tipoCadastro === "produto" ? (
                            <>
                                <label className="md:col-span-2">
                                    <span className="block text-sm font-semibold text-slate-700 mb-1">Descrição</span>
                                    <textarea
                                        value={produto.descricao}
                                        onChange={(event) => atualizarProduto("descricao", event.target.value)}
                                        required
                                        rows={3}
                                        className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:border-slate-700"
                                        placeholder="Descrição do produto"
                                    />
                                </label>
                                <label>
                                    <span className="block text-sm font-semibold text-slate-700 mb-1">Validade</span>
                                    <input
                                        type="date"
                                        value={produto.validade}
                                        onChange={(event) => atualizarProduto("validade", event.target.value)}
                                        className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:border-slate-700"
                                    />
                                </label>
                                <label>
                                    <span className="block text-sm font-semibold text-slate-700 mb-1">Preço unitário</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={produto.preco}
                                        onChange={(event) => atualizarProduto("preco", event.target.value)}
                                        required
                                        className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:border-slate-700"
                                        placeholder="0,00"
                                    />
                                </label>
                                <label>
                                    <span className="block text-sm font-semibold text-slate-700 mb-1">Quantidade em estoque</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={produto.qtd_estoque}
                                        onChange={(event) => atualizarProduto("qtd_estoque", event.target.value)}
                                        required
                                        className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:border-slate-700"
                                    />
                                </label>
                                <label>
                                    <span className="block text-sm font-semibold text-slate-700 mb-1">Quantidade mínima</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={produto.qtd_min_estoque}
                                        onChange={(event) => atualizarProduto("qtd_min_estoque", event.target.value)}
                                        required
                                        className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:border-slate-700"
                                    />
                                </label>
                            </>
                        ) : (
                            <>
                                <label className="md:col-span-2">
                                    <span className="block text-sm font-semibold text-slate-700 mb-1">Nome do cliente</span>
                                    <input
                                        value={cliente.nome}
                                        onChange={(event) => atualizarCliente("nome", event.target.value)}
                                        required
                                        className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:border-slate-700"
                                        placeholder="Nome completo"
                                    />
                                </label>
                                <label className="md:col-span-2">
                                    <span className="block text-sm font-semibold text-slate-700 mb-1">CPF</span>
                                    <input
                                        inputMode="numeric"
                                        maxLength={11}
                                        value={cliente.cpf}
                                        onChange={(event) => atualizarCliente("cpf", event.target.value.replace(/[^0-9]/g, ""))}
                                        required
                                        className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:border-slate-700"
                                        placeholder="11 caracteres"
                                    />
                                </label>
                            </>
                        )}

                        {erro && (
                            <p className="md:col-span-2 rounded-md bg-red-100 p-3 text-red-700 font-medium">{erro}</p>
                        )}
                        {sucesso && (
                            <p className="md:col-span-2 rounded-md bg-emerald-100 p-3 text-emerald-700 font-medium">{sucesso}</p>
                        )}

                        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
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
                                {carregando ? "Cadastrando..." : `Cadastrar ${tipoCadastro}`}
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
            </main>

            <Rodape />
        </div>
    );
}

export default PCadastro;
