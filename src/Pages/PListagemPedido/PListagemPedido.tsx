import type { JSX } from "react";

import Navegacao from "../../components/Navegação/Navegacao";
import ListagemPedidos from "../../components/listagens/ListagensPedido/ListagensPedido";
import Rodape from "../../components/Rodape/Rodape";

function PListagemPedido(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <ListagemPedidos />
            <Rodape />
        </div>
    );
}

export default PListagemPedido;
