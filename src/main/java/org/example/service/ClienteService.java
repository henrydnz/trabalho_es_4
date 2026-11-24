package org.example.service;

import org.example.dao.ClienteDao;
import org.example.models.pessoa.Email;
import org.example.models.pessoa.EnderecoEspecifico;
import org.example.models.pessoa.Pessoa;
import org.example.models.pessoa.Telefone;
import org.example.utils.Utils;
import org.models.Endereco;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class ClienteService {
    private final ClienteDao clienteDao;

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
                || pessoa.getTelefoneList() == null
                || pessoa.getDocumento() == null
                || pessoa.getEnderecoEspecifico() == null
                || pessoa.getEnderecoEspecifico().getEndereco() == null){}
            return null;

         pessoa.setDocumento(Utils.formatarStrNum(pessoa.getDocumento()));
         pessoa.setNome(Utils.formatarStrSv(pessoa.getNome()));

         for (Email email : pessoa.getEmailList()) {
             email.setEmail(Utils.formatarStrSv(email.getEmail()));
         }

         for (Telefone telefone : pessoa.getTelefoneList()) {
             telefone.setNroFone(Utils.formatarStrNum(telefone.getNroFone()));
         }
         pessoa.getEnderecoEspecifico().setComplemento(Utils.formatarStr(pessoa.getEnderecoEspecifico().getComplemento()));
         pessoa.getEnderecoEspecifico().setNumeroEndereco(Utils.formatarStrSv(pessoa.getEnderecoEspecifico().getNumeroEndereco()));

        if (!Utils.verificarTelefones(pessoa.getTelefoneList())
                || !Utils.verificarEmails(pessoa.getEmailList())
                || !Utils.verificarDocumento(pessoa.getFisica(), pessoa.getDocumento())
                || !Utils.verificarEnderecoEspecifico(pessoa.getEnderecoEspecifico())
                || !Utils.verificarNome(pessoa.getFisica(), pessoa.getNome()))
            return null;

        Endereco endereco = null;

        try {
            RestClient restClient = RestClient.create("http://localhost:8081/api/enderecos");
            endereco = restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(pessoa.getEnderecoEspecifico().getEndereco())
                    .retrieve()
                    .body(Endereco.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

         if (endereco == null || endereco.getId() == null)
             return null;

         pessoa.getEnderecoEspecifico().setEndereco(endereco);


        return clienteDao.cadastrarPessoa(pessoa);
    }

    public List<Pessoa> listarClientes() {
        return clienteDao.listarClientes();
    }

    public Pessoa buscarClientePorID(Integer id){
        return clienteDao.buscarClientePorID(id);
    }

    public Pessoa buscarClientePorDocumento(String documento){
        if(documento == null || documento.isEmpty())
            return null;

        String doc = Utils.formatarStrNum(documento);

        boolean isFisica = doc.length() == 11;

        if(isFisica)
            return clienteDao.buscarClientePorCPF(doc);

        return clienteDao.buscarClientePorCNPJ(doc);
    }
}
