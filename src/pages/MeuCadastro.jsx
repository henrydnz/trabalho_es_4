import { useState } from "react";

import {
  buscarClientePorDocumento,
  cadastrarCliente,
} from "../services/clientesService";

import "../styles/meuCadastro.css";

const cadastroInicial = {
  tipoPessoa: "fisica",
  nome: "",
  documento: "",

  telefones: [
    {
      ddi: "55",
      ddd: "",
      numero: "",
    },
  ],

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

function MeuCadastro() {
  const [formulario, setFormulario] =
    useState(cadastroInicial);

  const [documentoBusca, setDocumentoBusca] =
    useState("");

  const [clienteId, setClienteId] = useState(null);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const [consultando, setConsultando] =
    useState(false);

  const [salvando, setSalvando] =
    useState(false);

  const ocupado = consultando || salvando;
  const cadastroExistente = clienteId !== null;

  function preencherFormulario(cliente) {
    const tipoPessoa = cliente.isFisica
      ? "fisica"
      : "juridica";

    setClienteId(cliente.idCliente);

    setFormulario({
      tipoPessoa,
      nome: cliente.nome,

      documento: formatarDocumento(
        cliente.documento,
        tipoPessoa
      ),

      telefones:
        cliente.telefones.length > 0
          ? cliente.telefones
          : cadastroInicial.telefones,

      emails:
        cliente.emails.length > 0
          ? cliente.emails
          : cadastroInicial.emails,

      endereco: {
        ...cadastroInicial.endereco,
        ...cliente.endereco,

        cep: formatarCEP(
          cliente.endereco?.cep
        ),
      },
    });
  }

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,

      [name]:
        name === "documento"
          ? formatarDocumento(
              value,
              anterior.tipoPessoa
            )
          : value,
    }));
  }

  function alterarTipoPessoa(tipoPessoa) {
    setFormulario((anterior) => ({
      ...anterior,
      tipoPessoa,
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

  function atualizarTelefone(
    indice,
    campo,
    valor
  ) {
    const limites = {
      ddi: 3,
      ddd: 2,
      numero: 9,
    };

    const novoValor = somenteNumeros(valor).slice(
      0,
      limites[campo]
    );

    setFormulario((anterior) => ({
      ...anterior,

      telefones: anterior.telefones.map(
        (telefone, posicao) =>
          posicao === indice
            ? {
                ...telefone,
                [campo]: novoValor,
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

        {
          ddi: "55",
          ddd: "",
          numero: "",
        },
      ],
    }));
  }

  function removerTelefone(indice) {
    setFormulario((anterior) => ({
      ...anterior,

      telefones: anterior.telefones.filter(
        (_, posicao) => posicao !== indice
      ),
    }));
  }

  function atualizarEmail(indice, valor) {
    setFormulario((anterior) => ({
      ...anterior,

      emails: anterior.emails.map(
        (email, posicao) =>
          posicao === indice ? valor : email
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

      emails: anterior.emails.filter(
        (_, posicao) => posicao !== indice
      ),
    }));
  }

  function limparFormulario() {
    setFormulario(cadastroInicial);
    setDocumentoBusca("");
    setClienteId(null);
    setMensagem("");
    setErro("");
  }

  async function consultarCadastro(evento) {
    evento.preventDefault();

    if (ocupado) {
      return;
    }

    setMensagem("");
    setErro("");

    const documento = somenteNumeros(
      documentoBusca
    );

    if (![11, 14].includes(documento.length)) {
      setErro("Informe um CPF ou CNPJ válido.");
      return;
    }

    setConsultando(true);

    try {
      const cliente =
        await buscarClientePorDocumento(documento);

      if (!cliente) {
        const tipoPessoa =
          documento.length === 11
            ? "fisica"
            : "juridica";

        setClienteId(null);

        setFormulario({
          ...cadastroInicial,

          tipoPessoa,

          documento: formatarDocumento(
            documento,
            tipoPessoa
          ),
        });

        setMensagem(
          "Cadastro não encontrado. " +
          "Preencha os dados abaixo para realizar um novo cadastro."
        );

        return;
      }

      preencherFormulario(cliente);

      setMensagem(
        "Cadastro localizado com sucesso!"
      );
    } catch (erro) {
      console.error(erro);

      setErro(
        "Não foi possível consultar o cadastro. " +
        "Verifique a conexão com o servidor."
      );
    } finally {
      setConsultando(false);
    }
  }

  async function salvarCadastro(evento) {
    evento.preventDefault();

    if (ocupado || cadastroExistente) {
      return;
    }

    setErro("");
    setMensagem("");

    const documento = somenteNumeros(
      formulario.documento
    );

    const tamanhoDocumento =
      formulario.tipoPessoa === "fisica"
        ? 11
        : 14;

    if (documento.length !== tamanhoDocumento) {
      setErro("Informe um CPF ou CNPJ válido.");
      return;
    }

    if (!formulario.nome.trim()) {
      setErro("Informe o nome do cliente.");
      return;
    }

    if (
      somenteNumeros(formulario.endereco.cep)
        .length !== 8
    ) {
      setErro("Informe um CEP válido.");
      return;
    }

    if (
      formulario.endereco.uf.length !== 2 ||
      !formulario.endereco.nomeEstado.trim()
    ) {
      setErro(
        "Informe o nome do estado e uma UF com duas letras."
      );

      return;
    }

    const camposEndereco = [
      "tipoLogradouro",
      "logradouro",
      "numero",
      "bairro",
      "cidade",
    ];

    if (
      camposEndereco.some(
        (campo) =>
          !formulario.endereco[campo]?.trim()
      )
    ) {
      setErro(
        "Preencha todos os campos obrigatórios do endereço."
      );

      return;
    }

    const telefoneInvalido =
      formulario.telefones.some(
        (telefone) =>
          !telefone.ddi ||
          telefone.ddd.length !== 2 ||
          ![8, 9].includes(
            telefone.numero.length
          )
      );

    if (telefoneInvalido) {
      setErro(
        "Verifique o DDI, o DDD e o número dos telefones."
      );

      return;
    }

    setSalvando(true);

    try {
      const clienteExistente =
        await buscarClientePorDocumento(documento);

      if (clienteExistente) {
        preencherFormulario(clienteExistente);

        setErro(
          "Já existe um cliente cadastrado com esse documento."
        );

        return;
      }

      const cliente =
        await cadastrarCliente(formulario);

      preencherFormulario(cliente);

      setMensagem(
        "Cadastro realizado com sucesso!"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (erro) {
      console.error(erro);

      if (erro.status === 400) {
        setErro(
          "O servidor não aceitou o cadastro. " +
          "Confira os dados informados e o serviço de endereços."
        );
      } else {
        setErro(
          "Não foi possível salvar o cadastro. " +
          "Verifique se os servidores estão funcionando."
        );
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="cadastro-pagina">
      <div className="cadastro-cabecalho">
        <span className="secao-etiqueta">
          ÁREA DO CLIENTE
        </span>

        <h1>Meu Cadastro</h1>

        <p>
          Cadastre seus dados ou consulte um
          cadastro existente.
        </p>
      </div>

      {mensagem && (
        <p
          className="cadastro-mensagem sucesso"
          role="status"
        >
          {mensagem}
        </p>
      )}

      {erro && (
        <p
          className="cadastro-mensagem erro"
          role="alert"
        >
          {erro}
        </p>
      )}

      <section className="cadastro-bloco">
        <h2>Consultar cadastro</h2>

        <p>
          Já possui cadastro? Informe seu CPF ou CNPJ.
        </p>

        <form
          className="cadastro-busca"
          onSubmit={consultarCadastro}
        >
          <label>
            CPF ou CNPJ

            <input
              type="text"
              inputMode="numeric"
              value={documentoBusca}
              disabled={ocupado}
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
              placeholder="Informe seu documento"
              required
            />
          </label>

          <button
            type="submit"
            className="botao-principal"
            disabled={ocupado}
          >
            {consultando
              ? "Consultando..."
              : "Consultar cadastro"}
          </button>
        </form>
      </section>

      <form onSubmit={salvarCadastro}>
        <fieldset
          disabled={ocupado || cadastroExistente}
          style={{
            border: 0,
            padding: 0,
            margin: 0,
            minWidth: 0,
          }}
        >
          <section className="cadastro-bloco">
            <h2>Dados pessoais</h2>

            <div className="cadastro-tipo-pessoa">
              <label>
                <input
                  type="radio"
                  name="tipoPessoa"
                  checked={
                    formulario.tipoPessoa === "fisica"
                  }
                  onChange={() =>
                    alterarTipoPessoa("fisica")
                  }
                />

                Pessoa física
              </label>

              <label>
                <input
                  type="radio"
                  name="tipoPessoa"
                  checked={
                    formulario.tipoPessoa === "juridica"
                  }
                  onChange={() =>
                    alterarTipoPessoa("juridica")
                  }
                />

                Pessoa jurídica
              </label>
            </div>

            <div className="cadastro-grid">
              <label className="campo-duplo">
                {formulario.tipoPessoa === "fisica"
                  ? "Nome completo *"
                  : "Razão social *"}

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
                  ? "CPF *"
                  : "CNPJ *"}

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
            <h2>Telefones</h2>

            {formulario.telefones.map(
              (telefone, indice) => (
                <div
                  className="cadastro-telefone"
                  key={indice}
                >
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
                      onClick={() =>
                        removerTelefone(indice)
                      }
                    >
                      Remover
                    </button>
                  )}
                </div>
              )
            )}

            {!cadastroExistente && (
              <button
                type="button"
                className="cadastro-adicionar"
                onClick={adicionarTelefone}
              >
                + Adicionar telefone
              </button>
            )}
          </section>

          <section className="cadastro-bloco">
            <h2>E-mails</h2>

            {formulario.emails.map((email, indice) => (
              <div
                className="cadastro-email"
                key={indice}
              >
                <label>
                  E-mail *

                  <input
                    type="email"
                    value={email}
                    onChange={(evento) =>
                      atualizarEmail(
                        indice,
                        evento.target.value
                      )
                    }
                    placeholder="Informe o e-mail"
                    required
                  />
                </label>

                {formulario.emails.length > 1 && (
                  <button
                    type="button"
                    className="cadastro-remover"
                    onClick={() =>
                      removerEmail(indice)
                    }
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}

            {!cadastroExistente && (
              <button
                type="button"
                className="cadastro-adicionar"
                onClick={adicionarEmail}
              >
                + Adicionar e-mail
              </button>
            )}
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
                  value={
                    formulario.endereco.tipoLogradouro
                  }
                  onChange={atualizarEndereco}
                  required
                >
                  <option value="">
                    Selecione
                  </option>

                  {formulario.endereco.tipoLogradouro &&
                    !tiposLogradouro.includes(
                      formulario.endereco.tipoLogradouro
                    ) && (
                      <option
                        value={
                          formulario.endereco.tipoLogradouro
                        }
                      >
                        {formulario.endereco.tipoLogradouro}
                      </option>
                    )}

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
                  maxLength={14}
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
                  maxLength={99}
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
                  placeholder="Informe o estado"
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
                  placeholder="UF"
                  maxLength={2}
                  required
                />
              </label>
            </div>
          </section>
        </fieldset>

        {cadastroExistente && (
          <p className="cadastro-mensagem">
            Cadastro existente. Os dados estão disponíveis
            para consulta.
          </p>
        )}

        <div className="cadastro-acoes">
          <button
            type="button"
            className="cadastro-limpar"
            onClick={limparFormulario}
            disabled={ocupado}
          >
            {cadastroExistente
              ? "Novo cadastro"
              : "Limpar formulário"}
          </button>

          {!cadastroExistente && (
            <button
              type="submit"
              className="botao-principal"
              disabled={ocupado}
            >
              {salvando
                ? "Salvando cadastro..."
                : "Salvar cadastro"}

              <span>→</span>
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default MeuCadastro;