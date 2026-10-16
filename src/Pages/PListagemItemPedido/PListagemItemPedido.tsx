import type { JSX } from "react";

import Navegacao from "../../components/Navegação/Navegacao";
import ListagensItemPedido from "../../components/listagens/ListagensItemPedido/ListagensItemPedido";
import Rodape from "../../components/Rodape/Rodape";

function PListagemItemPedido(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col">
            <Navegacao />
            <ListagensItemPedido />
            <Rodape />
        </div>
    );
}

export default PListagemItemPedido;
