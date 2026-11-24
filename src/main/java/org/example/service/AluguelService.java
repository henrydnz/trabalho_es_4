package org.example.service;

import org.example.dao.AluguelDao;
import org.example.models.aluguel.Aluguel;
import org.example.models.pessoa.Pessoa;
import org.example.utils.Utils;
import org.models.Endereco;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;

@Service
public class AluguelService {
    private final AluguelDao aluguelDao;
    private final ClienteService clienteService;

    public AluguelService(AluguelDao aluguelDao, ClienteService clienteService) {
        this.aluguelDao = aluguelDao;
        this.clienteService = clienteService;
    }

    public Aluguel cadastrarAluguel(Aluguel aluguel) {
        if(aluguel == null
                || aluguel.getCliente() == null
                || aluguel.getDataPedido() == null
                || aluguel.getDataHoraFimLocacao() == null
                || !aluguel.getDataHoraFimLocacao().isAfter(aluguel.getDataHoraInicioLocacao())
                || aluguel.getTipoEquipamentoSolicitado() == null
                || aluguel.getEnderecoEspecifico() == null
                || aluguel.getEnderecoEspecifico().getComplemento() == null
                || aluguel.getEnderecoEspecifico().getNumeroEndereco() == null
                || aluguel.getEnderecoEspecifico().getEndereco() == null)
            return null;

        aluguel.getEnderecoEspecifico().setComplemento(Utils.formatarStr(aluguel.getEnderecoEspecifico().getComplemento()));
        aluguel.getEnderecoEspecifico().setNumeroEndereco(Utils.formatarStrSv(aluguel.getEnderecoEspecifico().getNumeroEndereco()));

        if(!Utils.verificarEnderecoEspecifico(aluguel.getEnderecoEspecifico()))
            return null;

        Endereco endereco = null;

        try {
            RestClient restClient = RestClient.create("http://localhost:8081/api/enderecos");
            endereco = restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(aluguel.getEnderecoEspecifico().getEndereco())
                    .retrieve()
                    .body(Endereco.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        if (endereco == null || endereco.getId() == null)
            return null;

        aluguel.getEnderecoEspecifico().setEndereco(endereco);

        Pessoa cliente = clienteService.cadastrarPessoa(aluguel.getCliente());

        if(cliente == null)
            return null;

        aluguel.setCliente(cliente);

        return aluguelDao.cadastrarAluguel();
    }

    public Aluguel registrarEntregaAluguel(Integer id, LocalDateTime dtEntrega, Integer idEquipamento) {
        Aluguel verif = aluguelDao.buscarAluguelPorId(id);
        if(verif == null
                || !dtEntrega.isAfter(verif.getDataHoraInicioLocacao())
                || !dtEntrega.isBefore(verif.getDataHoraFimLocacao()))
            return null;

        return aluguelDao.registrarEntregaAluguel(id, dtEntrega, idEquipamento);
    }

    public Aluguel registrarDevolucaoAluguel(Integer id, LocalDateTime dtDevolucao) {

    }

}
