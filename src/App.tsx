import { useEffect, useState, type JSX } from "react";

import DashboardPage from "./Pages/DashboardPage";
import ProdutosPage from "./Pages/ProdutosPage";
import ClientesPage from "./Pages/ClientesPage";
import PedidosPage from "./Pages/PedidosPage";
import CadastroPage from "./Pages/CadastroPage";

import "./App.css";

function App(): JSX.Element {
    const [pathname, setPathname] = useState(window.location.pathname);

    useEffect(() => {
        const handleNavigation = () => setPathname(window.location.pathname);
        window.addEventListener("popstate", handleNavigation);
        return () => window.removeEventListener("popstate", handleNavigation);
    }, []);

    const rotas: Record<string, JSX.Element> = {
        "/": <DashboardPage />,
        "/produtos": <ProdutosPage />,
        "/clientes": <ClientesPage />,
        "/pedidos": <PedidosPage />,
        "/clientes/novo": <CadastroPage key="cliente-novo" tipo="cliente" />,
        "/produtos/novo": <CadastroPage key="produto-novo" tipo="produto" />,
        "/pedidos/novo": <CadastroPage key="pedido-novo" tipo="pedido" />,
        "/cadastro/cliente": <CadastroPage key="cliente-cadastro" tipo="cliente" />,
        "/cadastro/produto": <CadastroPage key="produto-cadastro" tipo="produto" />,
    };

    return rotas[pathname] ?? <DashboardPage />;
}

export default App;
