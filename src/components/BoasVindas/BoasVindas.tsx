import { type JSX } from "react";

function BoasVindas(): JSX.Element {
    return (
        <main className="bg-gray-200  h-[76vh]">
            <h1 className="text-[3rem] pt-20" style={{ textAlign: 'center' }}>Loja de Informática Infotech</h1>

            <p className="text-[1.2rem] mt-10" style={{ textAlign: 'center' }}>
                Seja bem-vindo a loja de informatica Infotech. Aqui você encontra produtos de alta qualidade e serviços excepcionais.
            </p>
        </main>
    );
}

export default BoasVindas;