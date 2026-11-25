
const API = "http://localhost:8080/api/enderecos";

async function requisicao(url, opcoes = {}) {
  let resposta;

  try {
    resposta = await fetch(url, opcoes);
  } catch {
    throw new Error(
      "Não foi possível realizar a operação. Verifique sua conexão e tente novamente."
    );
  }

  const texto = await resposta.text();
  let dados = null;

  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = texto;
    }
  }

  if (!resposta.ok) {
    let mensagem = "";

    if (dados && typeof dados === "object") {
      mensagem = dados.mensagem || dados.message || "";
    }

    if (!mensagem) {
      switch (resposta.status) {
        case 400:
          mensagem = "Dados inválidos. Confira as informações.";
          break;

        case 404:
          mensagem = "Nenhum resultado encontrado.";
          break;

        case 500:
          mensagem = "Não foi possível concluir a operação. Tente novamente mais tarde.";
          break;

        default:
          mensagem = `Não foi possível realizar a operação (erro ${resposta.status}).`;
      }
    }

    throw new Error(mensagem);
  }

  return dados;
}

export function cadastrarEndereco(endereco) {
  return requisicao(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(endereco),
  });
}

export function buscarEnderecosPorCEP(cep) {
  const numeros = String(cep).replace(/\D/g, "");

  return requisicao(`${API}/busca/cep/${numeros}`);
}

export function buscarEnderecoPorID(id) {
  return requisicao(`${API}/busca/id/${encodeURIComponent(id)}`);
}

export function buscarEnderecoExterno(cep) {
  const numeros = String(cep).replace(/\D/g, "");

  return requisicao(`${API}/externo/${numeros}`);
}

export function buscarCidadePorID(id) {
  return requisicao(`${API}/cidade/id/${encodeURIComponent(id)}`);
}
