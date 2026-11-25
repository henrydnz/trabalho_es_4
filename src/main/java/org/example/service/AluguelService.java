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
import java.util.List;

import static java.lang.Double.max;

@Service
public class AluguelService {
    private final AluguelDao aluguelDao;
    private final ClienteService clienteService;

    public AluguelService(AluguelDao aluguelDao, ClienteService clienteService) {
        this.aluguelDao = aluguelDao;
        this.clienteService = clienteService;
    }

    public Aluguel cadastrarAluguel(Aluguel aluguel) {
        if (aluguel == null
                || aluguel.getCliente() == null
                || aluguel.getDataPedido() == null
                || aluguel.getDataHoraInicioLocacao() == null
                || aluguel.getDataHoraFimLocacao() == null
                || !aluguel.getDataHoraFimLocacao().isAfter(aluguel.getDataHoraInicioLocacao())
                || aluguel.getTipoEquipamentoSolicitado() == null
                || aluguel.getEnderecoEspecifico() == null
                || aluguel.getEnderecoEspecifico().getComplemento() == null
                || aluguel.getEnderecoEspecifico().getNumeroEndereco() == null
                || aluguel.getEnderecoEspecifico().getEndereco() == null) {
            return null;
        }

        aluguel.getEnderecoEspecifico().setComplemento(Utils.formatarStr(aluguel.getEnderecoEspecifico().getComplemento()));
        aluguel.getEnderecoEspecifico().setNumeroEndereco(Utils.formatarStrSv(aluguel.getEnderecoEspecifico().getNumeroEndereco()));

        if (!Utils.verificarEnderecoEspecifico(aluguel.getEnderecoEspecifico())) {
            return null;
        }

        long dias = java.time.temporal.ChronoUnit.DAYS.between(
                aluguel.getDataHoraInicioLocacao().toLocalDate(),
                aluguel.getDataHoraFimLocacao().toLocalDate());

        aluguel.setValorTotal(max(1, dias * aluguel.getTipoEquipamentoSolicitado().getValorDiaria()));

        Endereco endereco = null;

        try {
            RestClient restClient = RestClient.create("http://localhost:8080/api/enderecos");
            endereco = restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(aluguel.getEnderecoEspecifico().getEndereco())
                    .retrieve()
                    .body(Endereco.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        if (endereco == null || endereco.getId() == null) {
            return null;
        }

        aluguel.getEnderecoEspecifico().setEndereco(endereco);

        Pessoa cliente = clienteService.cadastrarCliente(aluguel.getCliente());

        if (cliente == null) {
            return null;
        }

        aluguel.setCliente(cliente);

        Aluguel salvo = aluguelDao.cadastrarAluguel(aluguel);
        return salvo;
    }

    public Aluguel registrarEntregaAluguel(Integer id, LocalDateTime dtEntrega, Integer idEquipamento) {
        Aluguel verif = aluguelDao.buscarAluguelPorID(id);
        if(verif == null
                || !dtEntrega.isAfter(verif.getDataHoraInicioLocacao())
                || !dtEntrega.isBefore(verif.getDataHoraFimLocacao()))
            return null;

        return aluguelDao.registrarEntregaAluguel(id, dtEntrega, idEquipamento);
    }

    public Aluguel registrarDevolucaoAluguel(Integer id, LocalDateTime dtDevolucao, Double valorPago) {
        Aluguel verif = aluguelDao.buscarAluguelPorID(id);
        if(verif == null
                || !dtDevolucao.isAfter(verif.getDataHoraInicioLocacao())
                || !dtDevolucao.isAfter(verif.getDataHoraEntrega()))
            return null;

        return aluguelDao.registrarDevolucaoAluguel(id, dtDevolucao, valorPago);
    }

    public List<Aluguel> listarAlugueis() {
        List<Aluguel> alugueis = aluguelDao.listarAlugueis();
        if (alugueis == null) {
            return null;
        }

        for (Aluguel aluguel : alugueis) {
            preencherDadosExternos(aluguel);
        }

        return alugueis;
    }

    public Aluguel buscarAluguelPorID(Integer id) {
        if (id == null) {
            return null;
        }

        Aluguel aluguel = aluguelDao.buscarAluguelPorID(id);
        return preencherDadosExternos(aluguel);
    }

    public List<Aluguel> buscarAlugueisPorIDCliente(Integer id) {
        if (id == null) {
            return null;
        }

        List<Aluguel> alugueis = aluguelDao.buscarAlugueisPorIDCliente(id);
        if (alugueis == null) {
            return null;
        }

        for (Aluguel aluguel : alugueis) {
            preencherDadosExternos(aluguel);
        }

        return alugueis;
    }

    private Aluguel preencherDadosExternos(Aluguel aluguel) {
        if (aluguel == null) {
            return null;
        }

        if (aluguel.getEnderecoEspecifico() != null) {
            if (aluguel.getEnderecoEspecifico().getEndereco() == null
                    || aluguel.getEnderecoEspecifico().getEndereco().getId() == null) {
                aluguel.getEnderecoEspecifico().setEndereco(null);
            } else {
                try {
                    RestClient restClient = RestClient.create("http://localhost:8080/api/enderecos");
                    Endereco endereco = restClient.get()
                            .uri("/busca/id/{id}", aluguel.getEnderecoEspecifico().getEndereco().getId())
                            .retrieve()
                            .body(Endereco.class);

                    aluguel.getEnderecoEspecifico().setEndereco(endereco);
                } catch (Exception e) {
                    aluguel.getEnderecoEspecifico().setEndereco(null);
                }
            }
        }

        if (aluguel.getCliente() != null && aluguel.getCliente().getIdPessoa() > 0) {
            Pessoa clienteCompleto = clienteService.buscarClientePorID(aluguel.getCliente().getIdPessoa());
            if (clienteCompleto != null) {
                aluguel.setCliente(clienteCompleto);
            }
        }

        return aluguel;
    }
}
