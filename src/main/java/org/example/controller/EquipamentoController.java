package org.example.controller;

import org.example.models.aluguel.Equipamento;
import org.example.models.aluguel.TipoEquipamento;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipamentos")
public class EquipamentoController {
    private final EquipamentoService equipamentoService;

    public EnderecoController(EquipamentoService equipamentoService){
        this.equipamentoService = equipamentoService;
    }

    @PostMapping
    public ResponseEntity<Equipamento> cadastrarEquipamento(@RequestBody Equipamento equipamento){
        Equipamento equipamentoSalvo = equipamentoService.cadastrarEquipamento(equipamento);

        return ResponseEntity.ok(equipamentoSalvo);
    }

    @GetMapping
    public ResponseEntity<List<Equipamento>> listarEquipamentos(){
        List<Equipamento> equipamentos = equipamentoService.buscarTodos();

        return ResponseEntity.ok(equipamentos);
    }

    @GetMapping("/tipos")
    public ResponseEntity<List<TipoEquipamento>> listarEquipamentosTipos(){
        List<TipoEquipamento> tipos = equipamentoService.buscarTipos();

        return ResponseEntity.ok(tipos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipamento> buscarEquipamentoPorID(@PathVariable String id){
        Equipamento equipamento = equipamentoService.buscarPorID(id);

        return ResponseEntity.ok(equipamento);
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<Equipamento>> listarEquipamentosDisponiveis(){
        List<Equipamento> equipamentos = equipamentoService.buscarDisponiveis();

        return ResponseEntity.ok(equipamentos);
    }
}
