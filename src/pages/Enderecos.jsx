
import { useState } from "react";

import {
  cadastrarEndereco,
  buscarEnderecosPorCEP,
  buscarEnderecoPorID,
  buscarEnderecoExterno,
  buscarCidadePorID,
} from "../services/enderecosService";

const enderecoInicial = {
  cep: "",
  tipoLogradouro: "",
  logradouro: "",
  bairro: "",
  cidade: "",
  uf: "",
  nomeEstado: "",
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

function formatarCEP(valor) {
  const numeros = somenteNumeros(valor).slice(0, 8);

  if (numeros.length > 5) {
    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
  }

  return numeros;
}

function formatarResultado(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return "Não informado";
  }

  return String(valor);
}

function EnderecoResultado({ endereco }) {
  if (!endereco || typeof endereco !== "object") {
    return <p>{formatarResultado(endereco)}</p>;
  }

  const cidade = endereco.cidade;
  const bairro = endereco.bairro;
  const logradouro = endereco.logradouro;

  const nomeCidade =
    typeof cidade === "string" ? cidade : cidade?.nome;

  const nomeBairro =
    typeof bairro === "string" ? bairro : bairro?.nome;

  const nomeLogradouro =
    typeof logradouro === "string"
      ? logradouro
      : logradouro?.nome;

  const tipoLogradouro =
    endereco.tipoLogradouro?.nome ??
    endereco.tipoLogradouro ??
    logradouro?.tipoLogradouro?.nome;

  const uf =
    endereco.uf ??
    endereco.siglaUf ??
    cidade?.unidadeFederacao?.sigla ??
    endereco.unidadeFederacao?.sigla;

  const nomeEstado =
    cidade?.unidadeFederacao?.nome ??
    endereco.unidadeFederacao?.nome;

  return (
    <div className="endereco-resultado-item">
      {endereco.id !== undefined && (
        <p>
          <strong>ID:</strong> {endereco.id}
        </p>
      )}

      {endereco.idCidade !== undefined && (
        <p>
          <strong>ID da cidade:</strong> {endereco.idCidade}
        </p>
      )}

      {(endereco.cep !== undefined ||
        endereco.CEP !== undefined) && (
        <p>
          <strong>CEP:</strong>{" "}
          {formatarCEP(endereco.cep ?? endereco.CEP)}
        </p>
      )}

      {(tipoLogradouro || nomeLogradouro) && (
        <p>
          <strong>Logradouro:</strong>{" "}
          {[tipoLogradouro, nomeLogradouro]
            .filter(Boolean)
            .join(" ")}
        </p>
      )}

      {nomeBairro && (
        <p>
          <strong>Bairro:</strong> {nomeBairro}
        </p>
      )}

      {nomeCidade && (
        <p>
          <strong>Cidade:</strong> {nomeCidade}
        </p>
      )}

      {uf && (
        <p>
          <strong>UF:</strong> {uf}
        </p>
      )}

      {nomeEstado && (
        <p>
          <strong>Estado:</strong> {nomeEstado}
        </p>
      )}

      {endereco.numero !== undefined && (
        <p>
          <strong>Número:</strong>{" "}
          {formatarResultado(endereco.numero)}
        </p>
      )}

      {endereco.complemento && (
        <p>
          <strong>Complemento:</strong> {endereco.complemento}
        </p>
      )}
    </div>
  );
}

function Enderecos() {
  const [formulario, setFormulario] = useState(enderecoInicial);
  const [mensagemCadastro, setMensagemCadastro] = useState("");
  const [erroCadastro, setErroCadastro] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);

  const [tipoBusca, setTipoBusca] = useState("cep");
  const [valorBusca, setValorBusca] = useState("");
  const [resultados, setResultados] = useState(null);
  const [mensagemBusca, setMensagemBusca] = useState("");
  const [erroBusca, setErroBusca] = useState(false);
  const [buscando, setBuscando] = useState(false);

  function atualizarCampo(evento) {
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
      [name]: novoValor,
    }));
  }

  async function salvarEndereco(evento) {
    evento.preventDefault();

    setMensagemCadastro("");
    setErroCadastro(false);

    const cep = somenteNumeros(formulario.cep);

    if (cep.length !== 8) {
      setMensagemCadastro("Informe um CEP com 8 números.");
      setErroCadastro(true);
      return;
    }

    if (formulario.uf.length !== 2) {
      setMensagemCadastro("Informe uma UF válida com 2 letras.");
      setErroCadastro(true);
      return;
    }

    const camposObrigatorios = [
      formulario.tipoLogradouro,
      formulario.logradouro,
      formulario.bairro,
      formulario.cidade,
      formulario.nomeEstado,
    ];

    if (camposObrigatorios.some((campo) => !campo.trim())) {
      setMensagemCadastro("Preencha todos os campos obrigatórios.");
      setErroCadastro(true);
      return;
    }

    const endereco = {
      cep,
      cidade: {
        nome: formulario.cidade.trim(),
        unidadeFederacao: {
          sigla: formulario.uf.trim(),
          nome: formulario.nomeEstado.trim(),
        },
      },
      bairro: {
        nome: formulario.bairro.trim(),
      },
      logradouro: {
        tipoLogradouro: {
          nome: formulario.tipoLogradouro.trim(),
        },
        nome: formulario.logradouro.trim(),
      },
    };

    setCadastrando(true);

    try {
      const resposta = await cadastrarEndereco(endereco);

      const id = resposta?.id;

      setMensagemCadastro(
        id !== undefined && id !== null
          ? `Endereço cadastrado com sucesso! ID: ${id}`
          : "Endereço cadastrado com sucesso!"
      );

      setFormulario(enderecoInicial);
    } catch (erro) {
      setMensagemCadastro(
        erro.message || "Não foi possível cadastrar o endereço."
      );
      setErroCadastro(true);
    } finally {
      setCadastrando(false);
    }
  }

  function alterarTipoBusca(evento) {
    setTipoBusca(evento.target.value);
    setValorBusca("");
    setResultados(null);
    setMensagemBusca("");
    setErroBusca(false);
  }

  function atualizarValorBusca(evento) {
    const valor = evento.target.value;

    if (tipoBusca === "cep" || tipoBusca === "externo") {
      setValorBusca(formatarCEP(valor));
    } else {
      setValorBusca(somenteNumeros(valor));
    }
  }

  async function executarBusca(evento) {
    evento.preventDefault();

    setResultados(null);
    setMensagemBusca("");
    setErroBusca(false);

    const valor = valorBusca.trim();

    if (!valor) {
      setMensagemBusca("Informe um valor para realizar a consulta.");
      setErroBusca(true);
      return;
    }

    if (tipoBusca === "cep" || tipoBusca === "externo") {
      if (somenteNumeros(valor).length !== 8) {
        setMensagemBusca("Informe um CEP com 8 números.");
        setErroBusca(true);
        return;
      }
    } else if (!Number.isSafeInteger(Number(valor)) || Number(valor) <= 0) {
      setMensagemBusca("Informe um ID válido, maior que zero.");
      setErroBusca(true);
      return;
    }

    setBuscando(true);

    try {
      let resposta;

      switch (tipoBusca) {
        case "cep":
          resposta = await buscarEnderecosPorCEP(valor);
          break;

        case "id":
          resposta = await buscarEnderecoPorID(valor);
          break;

        case "externo":
          resposta = await buscarEnderecoExterno(valor);
          break;

        case "cidade":
          resposta = await buscarCidadePorID(valor);
          break;

        default:
          throw new Error("Tipo de consulta inválido.");
      }

      const lista = Array.isArray(resposta)
        ? resposta
        : resposta
          ? [resposta]
          : [];

      if (lista.length === 0) {
        setMensagemBusca("Nenhum resultado encontrado.");
      } else {
        setResultados(lista);
        setMensagemBusca(
          lista.length === 1
            ? "1 resultado encontrado."
            : `${lista.length} resultados encontrados.`
        );
      }
    } catch (erro) {
      setMensagemBusca(
        erro.message || "Não foi possível realizar a consulta."
      );
      setErroBusca(true);
    } finally {
      setBuscando(false);
    }
  }

  const buscaPorCEP =
    tipoBusca === "cep" || tipoBusca === "externo";

  return (
    <div className="enderecos-pagina">
      <h1>Gerenciamento de Endereços</h1>

      <p>
        Cadastre endereços e consulte informações pelo sistema
        ou pelo serviço externo ViaCEP.
      </p>

      <section className="enderecos-bloco">
        <h2>Cadastrar endereço</h2>

        <form
          className="enderecos-formulario"
          onSubmit={salvarEndereco}
        >
          <label>
            CEP *
            <input
              type="text"
              name="cep"
              value={formulario.cep}
              onChange={atualizarCampo}
              placeholder="85851-000"
              maxLength={9}
              required
            />
          </label>

          <label>
            Tipo de logradouro *
            <select
              name="tipoLogradouro"
              value={formulario.tipoLogradouro}
              onChange={atualizarCampo}
              required
            >
              <option value="">Selecione</option>

              {tiposLogradouro.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nome do logradouro *
            <input
              type="text"
              name="logradouro"
              value={formulario.logradouro}
              onChange={atualizarCampo}
              placeholder="Ex.: Sete de Setembro"
              required
            />
          </label>

          <label>
            Bairro *
            <input
              type="text"
              name="bairro"
              value={formulario.bairro}
              onChange={atualizarCampo}
              placeholder="Ex.: Centro"
              required
            />
          </label>

          <label>
            Cidade *
            <input
              type="text"
              name="cidade"
              value={formulario.cidade}
              onChange={atualizarCampo}
              placeholder="Ex.: Toledo"
              required
            />
          </label>

          <label>
            UF *
            <input
              type="text"
              name="uf"
              value={formulario.uf}
              onChange={atualizarCampo}
              placeholder="PR"
              maxLength={2}
              required
            />
          </label>

          <label>
            Nome do estado *
            <input
              type="text"
              name="nomeEstado"
              value={formulario.nomeEstado}
              onChange={atualizarCampo}
              placeholder="Ex.: Paraná"
              required
            />
          </label>

          <button type="submit" disabled={cadastrando}>
            {cadastrando ? "Cadastrando..." : "Cadastrar endereço"}
          </button>
        </form>

        {mensagemCadastro && (
          <p
            className="enderecos-mensagem"
            role="status"
            style={{
              color: erroCadastro ? "#b42318" : "#18794e",
            }}
          >
            {mensagemCadastro}
          </p>
        )}
      </section>

      <section className="enderecos-bloco">
        <h2>Consultar endereços</h2>

        <form
          className="enderecos-formulario"
          onSubmit={executarBusca}
        >
          <label>
            Tipo de consulta
            <select
              value={tipoBusca}
              onChange={alterarTipoBusca}
            >
              <option value="cep">Buscar endereço por CEP</option>
              <option value="id">Buscar endereço por ID</option>
              <option value="externo">
                Consultar endereço externo (ViaCEP)
              </option>
              <option value="cidade">
                Buscar cidade por ID
              </option>
            </select>
          </label>

          <label>
            {buscaPorCEP ? "CEP" : "ID"}
            <input
              type="text"
              value={valorBusca}
              onChange={atualizarValorBusca}
              placeholder={
                buscaPorCEP ? "00000-000" : "Digite o ID"
              }
              required
            />
          </label>

          <button type="submit" disabled={buscando}>
            {buscando ? "Consultando..." : "Consultar"}
          </button>
        </form>

        {mensagemBusca && (
          <p
            className="enderecos-mensagem"
            role="status"
            style={{
              color: erroBusca ? "#b42318" : "inherit",
            }}
          >
            {mensagemBusca}
          </p>
        )}

        {resultados && resultados.length > 0 && (
          <div className="enderecos-resultados">
            <h3>Resultados da consulta</h3>

            {resultados.map((resultado, indice) => (
              <EnderecoResultado
                key={resultado?.id ?? indice}
                endereco={resultado}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Enderecos;
