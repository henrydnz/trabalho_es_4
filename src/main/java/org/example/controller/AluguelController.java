package org.example.controller;

import org.example.models.aluguel.Aluguel;
import org.example.service.AluguelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/alugueis")
public class AluguelController {
    private final AluguelService aluguelService;

    public AluguelController(AluguelService aluguelService) {
        this.aluguelService = aluguelService;
    }

    @PostMapping
    public ResponseEntity<Aluguel> cadastrarAluguel (@RequestBody Aluguel aluguel) {
        Aluguel aluguelSalvo = aluguelService.cadastrarAluguel(aluguel);

        if (aluguelSalvo == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(aluguelSalvo);
    }

    @PutMapping("/{id}/entrega")
    public ResponseEntity<Aluguel> registrarEntregaAluguel(@PathVariable Integer id,
                                                           @RequestParam LocalDateTime dtEntrega,
                                                           @RequestParam Integer idEquipamento) {
        Aluguel aluguelEntregue = aluguelService.registrarEntregaAluguel(id, dtEntrega, idEquipamento);

        if (aluguelEntregue == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(aluguelEntregue);
    }

    @PutMapping("/{id}/devolucao")
    public ResponseEntity<Aluguel> registrarDevolucaoAluguel(@PathVariable Integer id,
                                                             @RequestParam LocalDateTime dtDevolucao,
                                                             @RequestParam Double valorPago) {
        Aluguel aluguel = aluguelService.registrarDevolucaoAluguel(id, dtDevolucao, valorPago);

        if (aluguel == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(aluguel);
    }

    @GetMapping
    public ResponseEntity<List<Aluguel>> listarAlugueis() {
        List<Aluguel> alugueis = aluguelService.listarAlugueis();

        if (alugueis == null || alugueis.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(alugueis);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluguel> buscarAluguelPorID(@PathVariable Integer id) {
        Aluguel aluguel = aluguelService.buscarAluguelPorID(id);

        if (aluguel == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(aluguel);
    }

    @GetMapping("/cliente/{id}")
    public ResponseEntity<List<Aluguel>>  buscarAlugueisPorIDCliente(@PathVariable Integer id) {
        List<Aluguel> alugueis = aluguelService.buscarAlugueisPorIDCliente(id);

        if (alugueis == null || alugueis.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(alugueis);
    }
}
