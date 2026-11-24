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

        if (!verificarTelefones(pessoa.getTelefoneList())
                || !verificarEmails(pessoa.getEmailList())
                || !verificarDocumento(pessoa.getFisica(), pessoa.getDocumento())
                || !verificarEnderecoEspecifico(pessoa.getEnderecoEspecifico())
                || !verificarNome(pessoa.getFisica(), pessoa.getNome()))
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

    public boolean verificarTelefones(List<Telefone> telefones) {
        if (telefones == null || telefones.isEmpty()) {
            return false;
        }

        for (Telefone telefone : telefones) {
            if (telefone == null
                    || telefone.getNroFone() == null
                    || telefone.getNroDDD() == null
                    || telefone.getNroDDI() == null) {
                return false;
            }

            String fone = telefone.getNroFone().trim();
            String ddd = telefone.getNroDDD().getNroDDD().trim();
            String ddi = telefone.getNroDDI().getNroDDI().trim();

            if (!fone.matches("\\d{8,9}") || !ddd.matches("\\d{2}") || !ddi.matches("\\d{1,3}")) {
                return false;
            }
        }
        return true;
    }

    public boolean verificarEmails(List<Email> emails) {
        if (emails == null || emails.isEmpty()) {
            return false;
        }

        for (Email email : emails) {
            if (email == null || email.getEmail() == null) {
                return false;
            }

            String enderecoEmail = email.getEmail().trim();
            if (!enderecoEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                return false;
            }
        }
        return true;
    }

    public boolean verificarDocumento(Boolean isFisica, String documento) {
        if (isFisica == null || documento == null) {
            return false;
        }

        String docLimpo = documento.trim();
        if (isFisica) {
            return docLimpo.matches("\\d{11}");
        }
        return docLimpo.matches("\\d{14}");
    }

    public boolean verificarEnderecoEspecifico(EnderecoEspecifico endereco) {
        if (endereco == null
                || endereco.getNumeroEndereco() == null
                || endereco.getNumeroEndereco().isBlank()
                || endereco.getNumeroEndereco().trim().length() > 14) {
            return false;
        }

        return endereco.getComplemento() == null || endereco.getComplemento().length() <= 99;
    }

    public boolean verificarNome(Boolean isFisica, String nome) {
        if (isFisica == null || nome == null || nome.isBlank()) {
            return false;
        }

        if (isFisica) {
            return nome.trim().matches("[\\p{L}\\s]+");
        }
        return true;
    }
}
