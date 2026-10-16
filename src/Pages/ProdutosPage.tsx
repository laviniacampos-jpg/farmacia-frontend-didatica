import { useState, type JSX } from "react";

const produtosIniciais = [
    { id: 1, descricao: "Paracetamol 500mg", descricaoDetalhada: "(20 comprimidos)", validade: "12/2026", preco: "R$ 15,90", estoque: 12, estoqueMin: 5, status: "Disponível" },
    { id: 2, descricao: "Vitamina C", descricaoDetalhada: "(10 comprimidos)", validade: "08/2026", preco: "R$ 12,50", estoque: 8, estoqueMin: 5, status: "Baixo" },
    { id: 3, descricao: "Dipirona 500mg", descricaoDetalhada: "(20 comprimidos)", validade: "10/2027", preco: "R$ 11,90", estoque: 20, estoqueMin: 5, status: "Disponível" },
    { id: 4, descricao: "Protetor Solar FPS 50", descricaoDetalhada: "(120ml)", validade: "05/2027", preco: "R$ 45,90", estoque: 6, estoqueMin: 5, status: "Disponível" },
    { id: 5, descricao: "Shampoo Anticaspa", descricaoDetalhada: "(200ml)", validade: "03/2027", preco: "R$ 37,80", estoque: 3, estoqueMin: 5, status: "Baixo" },
];

type Produto = (typeof produtosIniciais)[number];

const converterPreco = (valor: string): number => {
    const normalizado = valor.trim().replace(/[^\d,.-]/g, "");
    const comPontoDecimal = normalizado.includes(",")
        ? normalizado.replace(/\./g, "").replace(",", ".")
        : normalizado;
    return Number(comPontoDecimal);
};

const navegar = (rota: string) => {
    window.history.pushState({}, "", rota);
    window.dispatchEvent(new PopStateEvent("popstate"));
};

function ProdutosPage(): JSX.Element {
    const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
    const [busca, setBusca] = useState("");
    const [descricaoFiltro, setDescricaoFiltro] = useState("");
    const [faixaPreco, setFaixaPreco] = useState("Todos");
    const [estoqueFiltro, setEstoqueFiltro] = useState("Todos");
    const [filtrosAplicados, setFiltrosAplicados] = useState({ descricao: "", faixaPreco: "Todos", estoque: "Todos" });
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;

    const produtosFiltrados = produtos.filter((produto) => {
        const texto = `${produto.descricao} ${produto.descricaoDetalhada}`.toLowerCase();
        const preco = converterPreco(produto.preco);
        const correspondePreco = filtrosAplicados.faixaPreco === "Todos"
            || (filtrosAplicados.faixaPreco === "Até R$ 20" && preco <= 20)
            || (filtrosAplicados.faixaPreco === "R$ 20 a R$ 40" && preco > 20 && preco <= 40)
            || (filtrosAplicados.faixaPreco === "Acima de R$ 40" && preco > 40);
        const correspondeEstoque = filtrosAplicados.estoque === "Todos"
            || (filtrosAplicados.estoque === "Disponível" && produto.estoque > produto.estoqueMin)
            || (filtrosAplicados.estoque === "Baixo" && produto.estoque <= produto.estoqueMin);

        return texto.includes(busca.trim().toLowerCase())
            && texto.includes(filtrosAplicados.descricao.trim().toLowerCase())
            && correspondePreco
            && correspondeEstoque;
    });
    const totalPaginas = Math.max(1, Math.ceil(produtosFiltrados.length / itensPorPagina));
    const produtosDaPagina = produtosFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

    const editarProduto = (produto: Produto) => {
        const descricao = window.prompt("Editar nome do produto:", produto.descricao);
        if (!descricao?.trim()) return;
        setProdutos((lista) => lista.map((item) => item.id === produto.id ? { ...item, descricao: descricao.trim() } : item));
    };

    const excluirProduto = (produto: Produto) => {
        if (!window.confirm(`Excluir ${produto.descricao}?`)) return;
        setProdutos((lista) => lista.filter((item) => item.id !== produto.id));
        setPaginaAtual(1);
    };

    return (
        <div className="farmacia-app">
            <aside className="farmacia-sidebar">
                <div className="brand-area">
                    <div className="brand-mark">✚</div>
                    <div className="brand-copy">
                        <h1>Farmácia</h1>
                        <span>Vida+</span>
                    </div>
                </div>

                <p className="sidebar-subtitle">Sua saúde em boas mãos</p>

                <nav className="sidebar-menu" aria-label="Menu principal">
                    <button type="button" className="menu-item" onClick={() => navegar("/")}>
                        <span className="menu-icon">⌂</span>
                        Início
                    </button>
                    <button type="button" className="menu-item active" onClick={() => navegar("/produtos")}>
                        <span className="menu-icon">▣</span>
                        Produtos
                    </button>
                    <button type="button" className="menu-item" onClick={() => navegar("/clientes")}>
                        <span className="menu-icon">◌</span>
                        Clientes
                    </button>
                    <button type="button" className="menu-item" onClick={() => navegar("/pedidos")}>
                        <span className="menu-icon">◫</span>
                        Pedidos
                    </button>
                </nav>

                <button type="button" className="logout-button" onClick={() => navegar("/")}>
                    Sair
                </button>
            </aside>

            <main className="page-content">
                <div className="produto-page">
                    <header className="dashboard-topbar produto-topbar">
                        <div className="search-box">
                            <span className="search-icon">⌕</span>
                            <input type="search" placeholder="Buscar por produto..." aria-label="Buscar produto" value={busca} onChange={(event) => { setBusca(event.target.value); setPaginaAtual(1); }} />
                        </div>

                        <div className="user-badge">
                            <span className="user-icon">◔</span>
                            <span>Usuário</span>
                            <span className="caret">▾</span>
                        </div>
                    </header>

                    <section className="produto-header-panel">
                        <div className="produto-title-wrap">
                            <div className="produto-icon">▣</div>
                            <div>
                                <h2>Produtos</h2>
                                <p>Gerencie os produtos da sua farmácia.</p>
                            </div>
                        </div>

                        <button type="button" className="primary-action" onClick={() => navegar("/produtos/novo")}>
                            + Novo Produto
                        </button>
                    </section>

                    <div className="filtro-row">
                        <div className="filtro-grupo largura-grande">
                            <label>Descrição</label>
                            <input type="search" placeholder="Buscar por descrição..." value={descricaoFiltro} onChange={(event) => setDescricaoFiltro(event.target.value)} />
                        </div>

                        <div className="filtro-grupo">
                            <label>Faixa de preço</label>
                            <select value={faixaPreco} onChange={(event) => setFaixaPreco(event.target.value)}>
                                <option>Todos</option>
                                <option>Até R$ 20</option>
                                <option>R$ 20 a R$ 40</option>
                                <option>Acima de R$ 40</option>
                            </select>
                        </div>

                        <div className="filtro-grupo">
                            <label>Estoque</label>
                            <select value={estoqueFiltro} onChange={(event) => setEstoqueFiltro(event.target.value)}>
                                <option>Todos</option>
                                <option>Disponível</option>
                                <option>Baixo</option>
                            </select>
                        </div>

                        <button type="button" className="filter-button" onClick={() => { setFiltrosAplicados({ descricao: descricaoFiltro, faixaPreco, estoque: estoqueFiltro }); setPaginaAtual(1); }}>
                            Filtrar
                        </button>
                    </div>

                    <div className="table-wrap produto-table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Descrição</th>
                                    <th>Validade</th>
                                    <th>Preço</th>
                                    <th>Estoque</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtosDaPagina.map((produto) => (
                                    <tr key={produto.id}>
                                        <td>{produto.id}</td>
                                        <td>
                                            <div className="descricao-cell">
                                                <span>{produto.descricao}</span>
                                                <small>{produto.descricaoDetalhada}</small>
                                            </div>
                                        </td>
                                        <td>{produto.validade}</td>
                                        <td>{produto.preco}</td>
                                        <td>{produto.estoque}</td>
                                        <td>
                                            <span className={produto.status === "Disponível" ? "status-pill green" : "status-pill red"}>
                                                {produto.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button type="button" className="action-button delete" aria-label={`Excluir ${produto.descricao}`} onClick={() => excluirProduto(produto)}>
                                                    🗑
                                                </button>
                                                <button type="button" className="action-button edit" aria-label={`Editar ${produto.descricao}`} onClick={() => editarProduto(produto)}>
                                                    ✎
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {produtosDaPagina.length === 0 && <p className="sem-resultados">Nenhum produto encontrado com esses filtros.</p>}

                    <div className="produto-footer-row" aria-label="Paginação de produtos">
                        <button type="button" className="pagination-arrow" aria-label="Página anterior" disabled={paginaAtual <= 1} onClick={() => setPaginaAtual((pagina) => Math.max(1, pagina - 1))}>‹</button>
                        {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((pagina) => (
                            <button type="button" key={pagina} className={`pagination-page${pagina === paginaAtual ? " active" : ""}`} aria-current={pagina === paginaAtual ? "page" : undefined} onClick={() => setPaginaAtual(pagina)}>{pagina}</button>
                        ))}
                        <button type="button" className="pagination-arrow" aria-label="Próxima página" disabled={paginaAtual >= totalPaginas} onClick={() => setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))}>›</button>
                    </div>

                    <div className="qualidade-row">
                        <span className="status-check">✓</span>
                        <span>Qualidade em estar sempre presente.</span>
                    </div>

                    <div className="footer-brand produto-brand">
                        <span className="brand-dot">♥</span>
                        Farmácia Vida+
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProdutosPage;
