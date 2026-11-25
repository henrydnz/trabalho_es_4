import { requisicao } from "./api";

function somenteNumeros(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

export function normalizarEndereco(enderecoEspecifico) {
  const endereco = enderecoEspecifico?.endereco;

  return {
    idEndereco: endereco?.id ?? null,
    cep: endereco?.cep ?? "",
    tipoLogradouro:
      endereco?.logradouro?.tipoLogradouro?.nome ?? "",
    logradouro: endereco?.logradouro?.nome ?? "",
    numero: enderecoEspecifico?.numeroEndereco ?? "",
    complemento: enderecoEspecifico?.complemento ?? "",
    bairro: endereco?.bairro?.nome ?? "",
    cidade: endereco?.cidade?.nome ?? "",
    uf: endereco?.cidade?.unidadeFederacao?.sigla ?? "",
    nomeEstado:
      endereco?.cidade?.unidadeFederacao?.nome ?? "",
  };
}

export function montarEnderecoEspecifico(endereco) {
  return {
    endereco: {
      cep: somenteNumeros(endereco.cep),

      cidade: {
        nome: endereco.cidade.trim(),

        unidadeFederacao: {
          sigla: endereco.uf.trim().toUpperCase(),
          nome: endereco.nomeEstado.trim(),
        },
      },

      bairro: {
        nome: endereco.bairro.trim(),
      },

      logradouro: {
        nome: endereco.logradouro.trim(),

        tipoLogradouro: {
          nome: endereco.tipoLogradouro.trim(),
        },
      },
    },

    numeroEndereco: endereco.numero.trim(),
    complemento: endereco.complemento?.trim() ?? "",
  };
}

export function normalizarCliente(cliente) {
  if (!cliente) {
    return null;
  }

  const isFisica =
    cliente.isFisica === true ||
    cliente.isFisica === "true" ||
    cliente.fisica === true;

  return {
    idCliente: cliente.idPessoa,
    nome: cliente.nome ?? "",
    documento: cliente.documento ?? "",
    isFisica,

    tipoPessoa: isFisica
      ? "fisica"
      : "juridica",

    telefones: (cliente.telefoneList ?? []).map(
      (telefone) => ({
        ddi: telefone.nroDDI?.nroDDI ?? "",
        ddd: telefone.nroDDD?.nroDDD ?? "",
        numero: telefone.nroFone ?? "",
      })
    ),

    emails: (cliente.emailList ?? []).map(
      (email) => email.email ?? ""
    ),

    endereco: normalizarEndereco(
      cliente.enderecoEspecifico
    ),
  };
}

export function montarCliente(formulario) {
  return {
    isFisica: formulario.tipoPessoa === "fisica",

    nome: formulario.nome.trim(),

    documento: somenteNumeros(
      formulario.documento
    ),

    telefoneList: formulario.telefones.map(
      (telefone) => ({
        nroDDD: {
          nroDDD: somenteNumeros(telefone.ddd),
        },

        nroDDI: {
          nroDDI: somenteNumeros(telefone.ddi),
        },

        nroFone: somenteNumeros(telefone.numero),
      })
    ),

    emailList: formulario.emails.map(
      (email) => ({
        email: email.trim(),
      })
    ),

    enderecoEspecifico: montarEnderecoEspecifico(
      formulario.endereco
    ),
  };
}

export async function obterClientes() {
  try {
    const dados = await requisicao("/clientes");

    if (dados == null) {
      return [];
    }

    if (!Array.isArray(dados)) {
      throw new Error(
        "Resposta inesperada do servidor."
      );
    }

    return dados.map(normalizarCliente);
  } catch (erro) {
    if (erro.status === 404) {
      return [];
    }

    throw erro;
  }
}

export async function buscarClientePorId(id) {
  try {
    const dados = await requisicao(
      `/clientes/${encodeURIComponent(id)}`
    );

    return normalizarCliente(dados);
  } catch (erro) {
    if (erro.status === 404) {
      return null;
    }

    throw erro;
  }
}

export async function buscarClientePorDocumento(
  documento
) {
  try {
    const numeros = somenteNumeros(documento);

    const dados = await requisicao(
      `/clientes/doc/${numeros}`
    );

    return normalizarCliente(dados);
  } catch (erro) {
    if (erro.status === 404) {
      return null;
    }

    throw erro;
  }
}

export async function cadastrarCliente(formulario) {
  const dados = await requisicao("/clientes", {
    method: "POST",

    body: JSON.stringify(
      montarCliente(formulario)
    ),
  });

  if (!dados || dados.idPessoa == null) {
    throw new Error(
      "O servidor não confirmou o cadastro."
    );
  }

  return normalizarCliente(dados);
}