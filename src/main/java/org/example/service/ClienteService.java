package org.example.service;

import org.example.dao.ClienteDao;
import org.example.models.pessoa.Email;
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

    public Pessoa cadastrarCliente(Pessoa cliente) {
        if (cliente == null) {
            return null;
        }

        if (cliente.getNome() == null
                || cliente.getFisica() == null
                || cliente.getEmailList() == null
                || cliente.getTelefoneList() == null
                || cliente.getDocumento() == null
                || cliente.getEnderecoEspecifico() == null
                || cliente.getEnderecoEspecifico().getEndereco() == null
                || cliente.getEnderecoEspecifico().getNumeroEndereco() == null) {
            return null;
        }

        for (Email email : cliente.getEmailList()) {
            if (email == null) {
                return null;
            }
            email.setEmail(Utils.formatarStrSv(email.getEmail()));
        }

        for (Telefone telefone : cliente.getTelefoneList()) {
            if (telefone == null || telefone.getNroDDD() == null || telefone.getNroDDI() == null) {
                return null;
            }
            telefone.setNroFone(Utils.formatarStrNum(telefone.getNroFone()));
            telefone.getNroDDD().setNroDDD(Utils.formatarStrNum(telefone.getNroDDD().getNroDDD()));
            telefone.getNroDDI().setNroDDI(Utils.formatarStrNum(telefone.getNroDDI().getNroDDI()));
        }

        cliente.setDocumento(Utils.formatarStrNum(cliente.getDocumento()));
        cliente.setNome(Utils.formatarStrSv(cliente.getNome()));

        cliente.getEnderecoEspecifico().setComplemento(Utils.formatarStr(cliente.getEnderecoEspecifico().getComplemento()));
        cliente.getEnderecoEspecifico().setNumeroEndereco(Utils.formatarStrSv(cliente.getEnderecoEspecifico().getNumeroEndereco()));

        Endereco endereco = null;

        try {
            RestClient restClient = RestClient.create("http://localhost:8080/api/enderecos");
            endereco = restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(cliente.getEnderecoEspecifico().getEndereco())
                    .retrieve()
                    .body(Endereco.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        if (endereco == null || endereco.getId() == null) {
            return null;
        }

        cliente.getEnderecoEspecifico().setEndereco(endereco);

        Pessoa salvo = clienteDao.cadastrarCliente(cliente);
        return salvo;
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
