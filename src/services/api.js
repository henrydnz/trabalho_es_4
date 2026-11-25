const API_URL = "http://localhost:8081/api";

export async function requisicao(
  caminho,
  opcoes = {}
) {
  const { headers, ...configuracoes } = opcoes;

  const resposta = await fetch(
    `${API_URL}${caminho}`,
    {
      ...configuracoes,
      headers: {
        Accept: "application/json",
        ...(opcoes.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...headers,
      },
    }
  );

  if (!resposta.ok) {
    const erro = new Error(
      `Erro na requisição: HTTP ${resposta.status}`
    );

    erro.status = resposta.status;

    throw erro;
  }

  const texto = await resposta.text();

  return texto ? JSON.parse(texto) : null;
}