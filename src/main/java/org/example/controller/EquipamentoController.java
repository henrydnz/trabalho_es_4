package org.example.controller;

import org.example.models.aluguel.Equipamento;
import org.example.models.aluguel.TipoEquipamento;
import org.example.service.EquipamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipamentos")
public class EquipamentoController {
    private final EquipamentoService equipamentoService;

    public EquipamentoController(EquipamentoService equipamentoService){
        this.equipamentoService = equipamentoService;
    }

    @PostMapping
    public ResponseEntity<Equipamento> cadastrarEquipamento(@RequestBody Equipamento equipamento){
        Equipamento equipamentoSalvo = equipamentoService.cadastrarEquipamento(equipamento);

        if (equipamentoSalvo == null)
            return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(equipamentoSalvo);
    }

    @GetMapping
    public ResponseEntity<List<Equipamento>> listarEquipamentos(){
        List<Equipamento> equipamentos = equipamentoService.buscarTodos();

        if (equipamentos == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(equipamentos);
    }

    @GetMapping("/tipos")
    public ResponseEntity<List<TipoEquipamento>> listarEquipamentosTipos(){
        List<TipoEquipamento> tipos = equipamentoService.buscarTipos();

        if (tipos == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(tipos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipamento> buscarEquipamentoPorID(@PathVariable Integer id){
        Equipamento equipamento = equipamentoService.buscarPorID(id);

        if (equipamento == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(equipamento);
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<Equipamento>> listarEquipamentosDisponiveis(){
        List<Equipamento> equipamentos = equipamentoService.buscarDisponiveis();

        if (equipamentos == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(equipamentos);
    }
}
