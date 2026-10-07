import { type JSX, useState } from 'react';
import estilo from './FormLogin.module.css';
import AuthRequests from '../../fetch/AuthRequests';

function FormLogin(): JSX.Element {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    interface LoginData {
        email: string;
        senha: string;
    }

    interface FormEvent {
        preventDefault: () => void;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const login: LoginData = { email: email, senha: senha };

        try {
            const sucesso = await AuthRequests.login(login);

            if (sucesso) {
                window.location.href = '/';
            } else {
                alert('E-mail ou senha incorretos');
            }

        } catch (error) {
            console.error(`Erro ao tentar fazer login: ${error}`);
            alert('Erro ao conectar com o servidor.');
        }
    };

    return (
        <section className={estilo['login-form-container']}>

            <form className={estilo['login-form']} onSubmit={handleSubmit}>

                <h2 className={estilo['login-header']}>LOGIN</h2>

                <div className={estilo['form-group']}>
                    <label>
                        E-mail
                        <input
                            type="email"
                            placeholder='Informe o seu email'
                            className={estilo['input-email-login']}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className={estilo['form-group']}>
                    <label>
                        Senha
                        <input
                            type="password"
                            placeholder='Informe sua senha'
                            className={estilo['input-password-login']}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <input
                    type="submit"
                    value="Entrar"
                    className={estilo['login-button']}
                />
            </form>
        </section>
    );
}

export default FormLogin;