package org.example.service;

import org.example.dao.ClienteDao;
import org.example.models.pessoa.Pessoa;
import org.models.Endereco;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ClienteService {
    private final ClienteDao clienteDao;

    private final RestClient restClient = RestClient.create("http://localhost:8081/api/enderecos");

    public ClienteService(ClienteDao clienteDao) {
        this.clienteDao = clienteDao;
    }

    public Pessoa cadastrarPessoa(Pessoa pessoa){
        if(pessoa == null){
            return null;
        }

        if(pessoa.getNome() ==  null
                || pessoa.getFisica() ==  null
                || pessoa.getEmailList() == null
                || pessoa.getEmailList() == null
                || pessoa.getDocumento() == null
                || pessoa.getEnderecoEspecifico() == null)
            return null;

        if (!verificarTelefones(pessoa.getTelefoneList())
                && !verificarEmails(pessoa.getEmailList())
                && !verificarDocumento(pessoa.getFisica(), pessoa.getDocumento())
                && !verificarNome(pessoa.getFisica(), pessoa.getNome()))
            return null;

        try {
            Endereco endereco = restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(pessoa.getEnderecoEspecifico().getEndereco())
                    .retrieve()
                    .body(Endereco.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }





        return clienteDao.cadastrarPessoa(pessoa);
    }
}
