import { useEffect, useMemo, useState, type FormEvent, type JSX } from "react";

import type { ClienteDTO } from "../components/dto/ClienteDTO";
import type { ItemPedidoDTO } from "../components/dto/IntemPedidoDTO";
import type { ProdutoDTO } from "../components/dto/ProdutoDTO";
import ClienteRequests from "../fetch/ClienteRequest";
import PedidoRequests from "../fetch/PedidoRequests";
import ProdutoRequests from "../fetch/ProdutoRequest";

export type TipoCadastro = "cliente" | "produto" | "pedido";

interface CadastroPageProps {
    tipo: TipoCadastro;
}

interface ItemSelecionado extends ItemPedidoDTO {
    descricao: string;
}

const navegar = (rota: string) => {
    window.history.pushState({}, "", rota);
    window.dispatchEvent(new PopStateEvent("popstate"));
};

const rotas = {
    cliente: { titulo: "Adicionar cliente", subtitulo: "Preencha os dados para cadastrar um novo cliente.", voltar: "/clientes" },
    produto: { titulo: "Adicionar produto", subtitulo: "Preencha os dados para cadastrar um produto na farmácia.", voltar: "/produtos" },
    pedido: { titulo: "Adicionar pedido", subtitulo: "Selecione o cliente e os produtos deste pedido.", voltar: "/pedidos" },
} satisfies Record<TipoCadastro, { titulo: string; subtitulo: string; voltar: string }>;

function CadastroPage({ tipo }: CadastroPageProps): JSX.Element {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [descricao, setDescricao] = useState("");
    const [validade, setValidade] = useState("");
    const [preco, setPreco] = useState("");
    const [estoque, setEstoque] = useState("");
    const [estoqueMinimo, setEstoqueMinimo] = useState("");
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [clienteId, setClienteId] = useState("");
    const [produtoId, setProdutoId] = useState("");
    const [quantidade, setQuantidade] = useState("1");
    const [itens, setItens] = useState<ItemSelecionado[]>([]);
    const [carregandoDados, setCarregandoDados] = useState(tipo === "pedido");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        if (tipo !== "pedido") return;

        const carregarOpcoes = async () => {
            setCarregandoDados(true);
            try {
                const [listaClientes, listaProdutos] = await Promise.all([
                    ClienteRequests.listar(),
                    ProdutoRequests.listar(),
                ]);
                setClientes(Array.isArray(listaClientes) ? listaClientes : []);
                setProdutos(Array.isArray(listaProdutos) ? listaProdutos : []);
            } catch (error) {
                setErro(error instanceof Error ? error.message : "Não foi possível carregar clientes e produtos.");
            } finally {
                setCarregandoDados(false);
            }
        };

        void carregarOpcoes();
    }, [tipo]);

    const total = useMemo(
        () => itens.reduce((soma, item) => soma + item.precoUnit * item.qtdProduto, 0),
        [itens],
    );

    const formatarPreco = (valor: number) => new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);

    const adicionarItem = () => {
        const produto = produtos.find((item) => String(item.id_produto) === produtoId);
        const qtd = Number(quantidade);
        if (!produto || !Number.isInteger(qtd) || qtd < 1) {
            setErro("Selecione um produto e informe uma quantidade válida.");
            return;
        }
        if (qtd > produto.qtd_estoque) {
            setErro(`Estoque insuficiente. Disponível: ${produto.qtd_estoque}.`);
            return;
        }

        setItens((atuais) => {
            const existente = atuais.find((item) => item.idProduto === produto.id_produto);
            if (existente) {
                return atuais.map((item) => item.idProduto === produto.id_produto
                    ? { ...item, qtdProduto: Math.min(produto.qtd_estoque, item.qtdProduto + qtd) }
                    : item);
            }
            return [...atuais, {
                idProduto: Number(produto.id_produto),
                qtdProduto: qtd,
                precoUnit: produto.preco,
                descricao: produto.descricao,
            }];
        });
        setProdutoId("");
        setQuantidade("1");
        setErro("");
    };

    const removerItem = (id: number) => setItens((atuais) => atuais.filter((item) => item.idProduto !== id));

    const enviarFormulario = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErro("");
        setSucesso("");
        setCarregando(true);

        try {
            if (tipo === "cliente") {
                const cpfNumeros = cpf.replace(/\D/g, "");
                if (cpfNumeros.length !== 11) throw new Error("O CPF deve conter 11 números.");
                await ClienteRequests.criar({ nome: nome.trim(), cpf: cpfNumeros });
                setNome("");
                setCpf("");
                setSucesso("Cliente cadastrado com sucesso. Voltando à página inicial...");
            } else if (tipo === "produto") {
                const valor = Number(preco);
                const quantidadeEstoque = Number(estoque);
                const quantidadeMinima = Number(estoqueMinimo);
                if (!descricao.trim() || !Number.isFinite(valor) || valor < 0) {
                    throw new Error("Informe uma descrição e um preço válido.");
                }
                await ProdutoRequests.criar({
                    descricao: descricao.trim(),
                    validade: validade || null,
                    preco: valor,
                    qtd_estoque: quantidadeEstoque,
                    qtd_min_estoque: quantidadeMinima,
                });
                setDescricao("");
                setValidade("");
                setPreco("");
                setEstoque("");
                setEstoqueMinimo("");
                setSucesso("Produto cadastrado com sucesso. Voltando à página inicial...");
            } else {
                if (!clienteId) throw new Error("Selecione um cliente para o pedido.");
                if (itens.length === 0) throw new Error("Adicione pelo menos um produto ao pedido.");

                const pedidoCriado = await PedidoRequests.criar({
                    idCliente: Number(clienteId),
                    itens: itens.map(({ idProduto, qtdProduto, precoUnit }) => ({ idProduto, qtdProduto, precoUnit })),
                });
                if (!pedidoCriado.idVenda) throw new Error("O servidor não confirmou a criação do pedido.");
                setClienteId("");
                setItens([]);
                setSucesso("Pedido cadastrado com sucesso. Voltando à página inicial...");
            }
            window.setTimeout(() => navegar("/"), 1200);
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível concluir o cadastro.");
        } finally {
            setCarregando(false);
        }
    };

    const conteudoFormulario = () => {
        if (tipo === "cliente") {
            return (
                <div className="cadastro-grid">
                    <label className="cadastro-campo cadastro-campo-largo">
                        <span>Nome completo <b>*</b></span>
                        <input value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Digite o nome completo" autoComplete="name" required />
                    </label>
                    <label className="cadastro-campo cadastro-campo-largo">
                        <span>CPF <b>*</b></span>
                        <input inputMode="numeric" maxLength={14} value={cpf} onChange={(event) => setCpf(event.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="Digite o CPF (somente números)" required />
                    </label>
                </div>
            );
        }

        if (tipo === "produto") {
            return (
                <div className="cadastro-grid">
                    <label className="cadastro-campo cadastro-campo-largo">
                        <span>Descrição do produto <b>*</b></span>
                        <input value={descricao} onChange={(event) => setDescricao(event.target.value)} placeholder="Ex.: Paracetamol 500 mg" required />
                    </label>
                    <label className="cadastro-campo">
                        <span>Validade</span>
                        <input type="date" value={validade} onChange={(event) => setValidade(event.target.value)} />
                    </label>
                    <label className="cadastro-campo">
                        <span>Preço unitário (R$) <b>*</b></span>
                        <input type="number" min="0" step="0.01" value={preco} onChange={(event) => setPreco(event.target.value)} placeholder="0,00" required />
                    </label>
                    <label className="cadastro-campo">
                        <span>Quantidade em estoque <b>*</b></span>
                        <input type="number" min="0" step="1" value={estoque} onChange={(event) => setEstoque(event.target.value)} placeholder="0" required />
                    </label>
                    <label className="cadastro-campo">
                        <span>Estoque mínimo <b>*</b></span>
                        <input type="number" min="0" step="1" value={estoqueMinimo} onChange={(event) => setEstoqueMinimo(event.target.value)} placeholder="0" required />
                    </label>
                </div>
            );
        }

        return (
            <div className="cadastro-grid">
                <label className="cadastro-campo cadastro-campo-largo">
                    <span>Cliente <b>*</b></span>
                    <select value={clienteId} onChange={(event) => setClienteId(event.target.value)} required disabled={carregandoDados}>
                        <option value="">{carregandoDados ? "Carregando clientes..." : "Selecione um cliente"}</option>
                        {clientes.map((cliente) => {
                            const id = cliente.idCliente ?? (cliente as ClienteDTO & { id_cliente?: number }).id_cliente;
                            return <option key={id ?? cliente.cpf} value={id ?? ""}>{cliente.nome} — {cliente.cpf}</option>;
                        })}
                    </select>
                </label>
                <div className="cadastro-campo cadastro-campo-largo">
                    <span>Adicionar produto ao pedido</span>
                    <div className="cadastro-adicionar-item">
                        <select aria-label="Produto" value={produtoId} onChange={(event) => setProdutoId(event.target.value)} disabled={carregandoDados || produtos.length === 0}>
                            <option value="">{carregandoDados ? "Carregando produtos..." : "Selecione um produto"}</option>
                            {produtos.map((produto) => <option key={produto.id_produto} value={produto.id_produto}>{produto.descricao} — {formatarPreco(produto.preco)} (estoque: {produto.qtd_estoque})</option>)}
                        </select>
                        <input aria-label="Quantidade do produto" type="number" min="1" value={quantidade} onChange={(event) => setQuantidade(event.target.value)} />
                        <button className="cadastro-botao-secundario" type="button" onClick={adicionarItem} disabled={!produtoId}>Adicionar</button>
                    </div>
                </div>
                <section className="cadastro-itens cadastro-campo-largo" aria-label="Produtos do pedido">
                    <h3>Itens selecionados</h3>
                    {itens.length === 0 ? <p>Nenhum produto foi adicionado.</p> : itens.map((item) => (
                        <div className="cadastro-item-linha" key={item.idProduto}>
                            <span>{item.descricao} · {item.qtdProduto} × {formatarPreco(item.precoUnit)}</span>
                            <strong>{formatarPreco(item.qtdProduto * item.precoUnit)}</strong>
                            <button type="button" className="cadastro-remover" onClick={() => removerItem(item.idProduto)}>Remover</button>
                        </div>
                    ))}
                    <div className="cadastro-total"><span>Total do pedido</span><strong>{formatarPreco(total)}</strong></div>
                </section>
            </div>
        );
    };

    const cabecalho = rotas[tipo];

    return (
        <div className="farmacia-app">
            <aside className="farmacia-sidebar">
                <div className="brand-area">
                    <div className="brand-mark">✚</div>
                    <div className="brand-copy"><h1>Farmácia</h1><span>Vida+</span></div>
                </div>
                <p className="sidebar-subtitle">Sua saúde em boas mãos</p>
                <nav className="sidebar-menu" aria-label="Menu principal">
                    <button type="button" className="menu-item" onClick={() => navegar("/")}><span className="menu-icon">⌂</span>Início</button>
                    <button type="button" className={`menu-item${tipo === "produto" ? " active" : ""}`} onClick={() => navegar("/produtos")}><span className="menu-icon">▣</span>Produtos</button>
                    <button type="button" className={`menu-item${tipo === "cliente" ? " active" : ""}`} onClick={() => navegar("/clientes")}><span className="menu-icon">◌</span>Clientes</button>
                    <button type="button" className={`menu-item${tipo === "pedido" ? " active" : ""}`} onClick={() => navegar("/pedidos")}><span className="menu-icon">◫</span>Pedidos</button>
                </nav>
                <button type="button" className="logout-button" onClick={() => navegar("/")}>Voltar ao início</button>
            </aside>

            <main className="page-content">
                <div className="cadastro-page">
                    <header className="dashboard-topbar">
                        <div className="cadastro-contexto">Farmácia Vida+ <span>/</span> Cadastro</div>
                        <div className="user-badge"><span className="user-icon">◔</span><span>Usuário</span><span className="caret">▾</span></div>
                    </header>
                    <section className="cadastro-card">
                        <button type="button" className="cadastro-voltar" onClick={() => navegar(cabecalho.voltar)}>← Voltar para {tipo === "cliente" ? "clientes" : tipo === "produto" ? "produtos" : "pedidos"}</button>
                        <div className="cadastro-titulo">
                            <span className="cadastro-icone" aria-hidden="true">{tipo === "cliente" ? "♙" : tipo === "produto" ? "▣" : "▤"}</span>
                            <div><h1>{cabecalho.titulo}</h1><p>{cabecalho.subtitulo}</p></div>
                        </div>
                        <form onSubmit={enviarFormulario}>
                            {conteudoFormulario()}
                            {erro && <p className="cadastro-mensagem erro" role="alert">{erro}</p>}
                            {sucesso && <p className="cadastro-mensagem sucesso" role="status">{sucesso}</p>}
                            {tipo === "pedido" && clientes.length === 0 && !carregandoDados && <p className="cadastro-ajuda">Cadastre um cliente antes de criar um pedido.</p>}
                            {tipo === "pedido" && produtos.length === 0 && !carregandoDados && <p className="cadastro-ajuda">Cadastre produtos antes de criar um pedido.</p>}
                            <div className="cadastro-acoes">
                                <button type="button" className="cadastro-botao-secundario" onClick={() => navegar(cabecalho.voltar)}>Cancelar</button>
                                <button type="submit" className="cadastro-botao-principal" disabled={carregando || carregandoDados}>
                                    {carregando ? "Salvando..." : tipo === "cliente" ? "Salvar cliente" : tipo === "produto" ? "Salvar produto" : "Criar pedido"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default CadastroPage;
