package org.example.controller;

import org.example.models.pessoa.Pessoa;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final PessoaService pessoaService;

    public ClienteController(PessoaService pessoaService) {
        this.pessoaService = pessoaService;
    }

    @PostMapping
    public ResponseEntity<Pessoa> cadastrarCliente(@RequestBody Pessoa cliente) {
        Pessoa clienteSalvo = pessoaService.cadastrarCliente(cliente);

        return ResponseEntity.ok().body(clienteSalvo);
    }

    @GetMapping
    public ResponseEntity<List<Pessoa>> listarCliente() {
        List<Pessoa> clientes = pessoaService.buscarTodos();

        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pessoa> buscarClientePorID(@PathVariable String id) {
        Pessoa cliente = pessoaService.buscarPorID(id);

        return ResponseEntity.ok().body(cliente);
    }

    @GetMapping
    public ResponseEntity<Pessoa> buscarClientePorCPF(@RequestParam String cpf) {
        Pessoa cliente = pessoaService.buscarPorCPF(cpf);

        return ResponseEntity.ok().body(cliente);
    }


}
