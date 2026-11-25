
import { useState } from "react";
import "../styles/meuCadastro.css";

const cadastroInicial = {
  tipoPessoa: "fisica",
  nome: "",
  documento: "",
  telefones: [{ ddi: "55", ddd: "", numero: "" }],
  emails: [""],
  endereco: {
    cep: "",
    tipoLogradouro: "Rua",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    nomeEstado: "",
  },
};

const tiposLogradouro = [
  "Rua",
  "Avenida",
  "Travessa",
  "Alameda",
  "Praça",
  "Estrada",
  "Rodovia",
  "Viela",
  "Largo",
  "Outro",
];

function somenteNumeros(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

function formatarDocumento(valor, tipoPessoa) {
  const numeros = somenteNumeros(valor);

  if (tipoPessoa === "fisica") {
    return numeros
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return numeros
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatarCEP(valor) {
  return somenteNumeros(valor)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");
}

// Armazenamento temporário para testes do front-end
function obterClientes() {
  try {
    return JSON.parse(
      localStorage.getItem("equipass-clientes") || "[]"
    );
  } catch {
    return [];
  }
}

function MeuCadastro() {
  const [formulario, setFormulario] = useState(cadastroInicial);
  const [documentoBusca, setDocumentoBusca] = useState("");
  const [clienteId, setClienteId] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  function exibirMensagem(texto, possuiErro = false) {
    setMensagem(texto);
    setErro(possuiErro);
  }

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]:
        name === "documento"
          ? formatarDocumento(value, anterior.tipoPessoa)
          : value,
    }));
  }

  function alterarTipoPessoa(evento) {
    setFormulario((anterior) => ({
      ...anterior,
      tipoPessoa: evento.target.value,
      documento: "",
    }));
  }

  function atualizarEndereco(evento) {
    const { name, value } = evento.target;

    let novoValor = value;

    if (name === "cep") {
      novoValor = formatarCEP(value);
    }

    if (name === "uf") {
      novoValor = value
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();
    }

    setFormulario((anterior) => ({
      ...anterior,
      endereco: {
        ...anterior.endereco,
        [name]: novoValor,
      },
    }));
  }

  function atualizarTelefone(indice, campo, valor) {
    const limites = {
      ddi: 3,
      ddd: 2,
      numero: 9,
    };

    setFormulario((anterior) => ({
      ...anterior,
      telefones: anterior.telefones.map((telefone, i) =>
        i === indice
          ? {
              ...telefone,
              [campo]: somenteNumeros(valor).slice(
                0,
                limites[campo]
              ),
            }
          : telefone
      ),
    }));
  }

  function adicionarTelefone() {
    setFormulario((anterior) => ({
      ...anterior,
      telefones: [
        ...anterior.telefones,
        { ddi: "55", ddd: "", numero: "" },
      ],
    }));
  }

  function removerTelefone(indice) {
    setFormulario((anterior) => ({
      ...anterior,
      telefones: anterior.telefones.filter(
        (_, i) => i !== indice
      ),
    }));
  }

  function atualizarEmail(indice, valor) {
    setFormulario((anterior) => ({
      ...anterior,
      emails: anterior.emails.map((email, i) =>
        i === indice ? valor : email
      ),
    }));
  }

  function adicionarEmail() {
    setFormulario((anterior) => ({
      ...anterior,
      emails: [...anterior.emails, ""],
    }));
  }

  function removerEmail(indice) {
    setFormulario((anterior) => ({
      ...anterior,
      emails: anterior.emails.filter((_, i) => i !== indice),
    }));
  }

  function limparFormulario() {
    setFormulario(cadastroInicial);
    setClienteId(null);
    setDocumentoBusca("");
    setMensagem("");
    setErro(false);
  }

  function consultarCadastro(evento) {
    evento.preventDefault();

    const documento = somenteNumeros(documentoBusca);

    if (![11, 14].includes(documento.length)) {
      exibirMensagem("Informe um CPF ou CNPJ válido.", true);
      return;
    }

    const cliente = obterClientes().find(
      (item) => somenteNumeros(item.documento) === documento
    );

    if (!cliente) {
      setClienteId(null);

      setFormulario({
        ...cadastroInicial,
        tipoPessoa: documento.length === 11
          ? "fisica"
          : "juridica",
        documento: formatarDocumento(
          documento,
          documento.length === 11 ? "fisica" : "juridica"
        ),
      });

      exibirMensagem(
        "Cadastro não encontrado. Preencha os dados abaixo para realizar seu cadastro."
      );

      return;
    }

    setFormulario({
      tipoPessoa: cliente.tipoPessoa,
      nome: cliente.nome,
      documento: cliente.documento,
      telefones: cliente.telefones,
      emails: cliente.emails,
      endereco: cliente.endereco,
    });

    setClienteId(cliente.idCliente);

    exibirMensagem("Cadastro localizado com sucesso!");
  }

  function salvarCadastro(evento) {
    evento.preventDefault();

    const documento = somenteNumeros(formulario.documento);

    const tamanhoEsperado =
      formulario.tipoPessoa === "fisica" ? 11 : 14;

    if (documento.length !== tamanhoEsperado) {
      exibirMensagem("Verifique o CPF ou CNPJ informado.", true);
      return;
    }

    if (somenteNumeros(formulario.endereco.cep).length !== 8) {
      exibirMensagem("Informe um CEP com 8 números.", true);
      return;
    }

    if (formulario.endereco.uf.length !== 2) {
      exibirMensagem("Informe uma UF com duas letras.", true);
      return;
    }

    const telefoneInvalido = formulario.telefones.some(
      (telefone) =>
        !telefone.ddi ||
        telefone.ddd.length !== 2 ||
        ![8, 9].includes(telefone.numero.length)
    );

    if (telefoneInvalido) {
      exibirMensagem("Verifique os telefones informados.", true);
      return;
    }

    const clientes = obterClientes();

    const duplicado = clientes.some(
      (cliente) =>
        somenteNumeros(cliente.documento) === documento &&
        cliente.idCliente !== clienteId
    );

    if (duplicado) {
      exibirMensagem(
        "Já existe um cadastro com esse documento.",
        true
      );
      return;
    }

    const novoCliente = {
      ...formulario,
      idCliente: clienteId ?? Date.now(),
      isFisica: formulario.tipoPessoa === "fisica",
    };

    const listaAtualizada = clienteId
      ? clientes.map((cliente) =>
          cliente.idCliente === clienteId
            ? novoCliente
            : cliente
        )
      : [...clientes, novoCliente];

    localStorage.setItem(
      "equipass-clientes",
      JSON.stringify(listaAtualizada)
    );

    setClienteId(novoCliente.idCliente);

    exibirMensagem(
      clienteId
        ? "Cadastro atualizado com sucesso!"
        : "Cadastro realizado com sucesso!"
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="cadastro-pagina">
      <div className="cadastro-cabecalho">
        <span className="secao-etiqueta">
          ÁREA DO CLIENTE
        </span>

        <h1>Meu cadastro</h1>

        <p>
          Cadastre ou consulte seus dados para utilizar
          os serviços do Equipass.
        </p>
      </div>

      <section className="cadastro-bloco">
        <h2>Já possui cadastro?</h2>

        <p>Informe seu CPF ou CNPJ para localizar seus dados.</p>

        <form
          className="cadastro-busca"
          onSubmit={consultarCadastro}
        >
          <label>
            CPF ou CNPJ
            <input
              type="text"
              inputMode="numeric"
              placeholder="Informe seu documento"
              value={documentoBusca}
              onChange={(evento) => {
                const valor = evento.target.value;

                setDocumentoBusca(
                  formatarDocumento(
                    valor,
                    somenteNumeros(valor).length <= 11
                      ? "fisica"
                      : "juridica"
                  )
                );
              }}
              required
            />
          </label>

          <button type="submit" className="botao-principal">
            Consultar cadastro
          </button>
        </form>
      </section>

      {mensagem && (
        <div
          className={`cadastro-mensagem ${
            erro ? "erro" : "sucesso"
          }`}
          role="status"
        >
          {mensagem}
        </div>
      )}

      <form onSubmit={salvarCadastro}>
        <section className="cadastro-bloco">
          <h2>Dados pessoais</h2>

          <p>Informe os dados de identificação do cliente.</p>

          <div className="cadastro-tipo-pessoa">
            <label>
              <input
                type="radio"
                name="tipoPessoa"
                value="fisica"
                checked={formulario.tipoPessoa === "fisica"}
                onChange={alterarTipoPessoa}
              />
              Pessoa física
            </label>

            <label>
              <input
                type="radio"
                name="tipoPessoa"
                value="juridica"
                checked={formulario.tipoPessoa === "juridica"}
                onChange={alterarTipoPessoa}
              />
              Pessoa jurídica
            </label>
          </div>

          <div className="cadastro-grid">
            <label className="campo-duplo">
              {formulario.tipoPessoa === "fisica"
                ? "Nome completo"
                : "Razão social"} *

              <input
                type="text"
                name="nome"
                value={formulario.nome}
                onChange={atualizarCampo}
                placeholder={
                  formulario.tipoPessoa === "fisica"
                    ? "Informe seu nome completo"
                    : "Informe a razão social"
                }
                required
              />
            </label>

            <label>
              {formulario.tipoPessoa === "fisica"
                ? "CPF"
                : "CNPJ"} *

              <input
                type="text"
                name="documento"
                inputMode="numeric"
                value={formulario.documento}
                onChange={atualizarCampo}
                placeholder={
                  formulario.tipoPessoa === "fisica"
                    ? "000.000.000-00"
                    : "00.000.000/0000-00"
                }
                required
              />
            </label>
          </div>
        </section>

        <section className="cadastro-bloco">
          <h2>Informações de contato</h2>

          <p>Informe seus telefones e endereços de e-mail.</p>

          <h3>Telefones</h3>

          {formulario.telefones.map((telefone, indice) => (
            <div className="cadastro-telefone" key={indice}>
              <label>
                DDI *
                <input
                  type="text"
                  inputMode="numeric"
                  value={telefone.ddi}
                  onChange={(evento) =>
                    atualizarTelefone(
                      indice,
                      "ddi",
                      evento.target.value
                    )
                  }
                  placeholder="55"
                  required
                />
              </label>

              <label>
                DDD *
                <input
                  type="text"
                  inputMode="numeric"
                  value={telefone.ddd}
                  onChange={(evento) =>
                    atualizarTelefone(
                      indice,
                      "ddd",
                      evento.target.value
                    )
                  }
                  placeholder="45"
                  required
                />
              </label>

              <label>
                Número *
                <input
                  type="text"
                  inputMode="numeric"
                  value={telefone.numero}
                  onChange={(evento) =>
                    atualizarTelefone(
                      indice,
                      "numero",
                      evento.target.value
                    )
                  }
                  placeholder="999999999"
                  required
                />
              </label>

              {formulario.telefones.length > 1 && (
                <button
                  type="button"
                  className="cadastro-remover"
                  onClick={() => removerTelefone(indice)}
                >
                  Remover
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="cadastro-adicionar"
            onClick={adicionarTelefone}
          >
            + Adicionar telefone
          </button>

          <h3>E-mails</h3>

          {formulario.emails.map((email, indice) => (
            <div className="cadastro-email" key={indice}>
              <label>
                E-mail {indice + 1} *
                <input
                  type="email"
                  value={email}
                  onChange={(evento) =>
                    atualizarEmail(indice, evento.target.value)
                  }
                  placeholder="exemplo@email.com"
                  required
                />
              </label>

              {formulario.emails.length > 1 && (
                <button
                  type="button"
                  className="cadastro-remover"
                  onClick={() => removerEmail(indice)}
                >
                  Remover
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="cadastro-adicionar"
            onClick={adicionarEmail}
          >
            + Adicionar e-mail
          </button>
        </section>

        <section className="cadastro-bloco">
          <h2>Endereço</h2>

          <p>Informe seu endereço principal.</p>

          <div className="cadastro-grid">
            <label>
              CEP *
              <input
                type="text"
                name="cep"
                inputMode="numeric"
                value={formulario.endereco.cep}
                onChange={atualizarEndereco}
                placeholder="00000-000"
                required
              />
            </label>

            <label>
              Tipo de logradouro *
              <select
                name="tipoLogradouro"
                value={formulario.endereco.tipoLogradouro}
                onChange={atualizarEndereco}
                required
              >
                {tiposLogradouro.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Logradouro *
              <input
                type="text"
                name="logradouro"
                value={formulario.endereco.logradouro}
                onChange={atualizarEndereco}
                placeholder="Nome da rua"
                required
              />
            </label>

            <label>
              Número *
              <input
                type="text"
                name="numero"
                value={formulario.endereco.numero}
                onChange={atualizarEndereco}
                placeholder="123"
                required
              />
            </label>

            <label className="campo-duplo">
              Complemento
              <input
                type="text"
                name="complemento"
                value={formulario.endereco.complemento}
                onChange={atualizarEndereco}
                placeholder="Apartamento, bloco, casa..."
              />
            </label>

            <label>
              Bairro *
              <input
                type="text"
                name="bairro"
                value={formulario.endereco.bairro}
                onChange={atualizarEndereco}
                placeholder="Centro"
                required
              />
            </label>

            <label>
              Cidade *
              <input
                type="text"
                name="cidade"
                value={formulario.endereco.cidade}
                onChange={atualizarEndereco}
                placeholder="Foz do Iguaçu"
                required
              />
            </label>

            <label>
              UF *
              <input
                type="text"
                name="uf"
                value={formulario.endereco.uf}
                onChange={atualizarEndereco}
                placeholder="PR"
                maxLength={2}
                required
              />
            </label>

            <label>
              Estado *
              <input
                type="text"
                name="nomeEstado"
                value={formulario.endereco.nomeEstado}
                onChange={atualizarEndereco}
                placeholder="Paraná"
                required
              />
            </label>
          </div>
        </section>

        <div className="cadastro-acoes">
          <button
            type="button"
            className="cadastro-limpar"
            onClick={limparFormulario}
          >
            Limpar formulário
          </button>

          <button type="submit" className="botao-principal">
            {clienteId ? "Salvar alterações" : "Realizar cadastro"}
            <span>→</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default MeuCadastro;