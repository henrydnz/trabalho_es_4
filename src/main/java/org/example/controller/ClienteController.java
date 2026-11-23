package org.example.controller;

import org.example.models.pessoa.Pessoa;
import org.example.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    private final ClienteService clienteService;

    public ClienteController (ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<Pessoa> cadastrarPessoa(@RequestBody Pessoa pessoa) {
        Pessoa pessoaSalva = clienteService.cadastrarPessoa(pessoa);
        if (pessoaSalva == null)
            return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(pessoaSalva);
    }

    @GetMapping
    public ResponseEntity<List<Pessoa>> listarClientes() {
        List<Pessoa> pessoas = clienteService.listarClientes();

        if (pessoas == null || pessoas.isEmpty())
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(pessoas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pessoa> buscarClientePorDocumento(@PathVariable String id) {
        Pessoa pessoa = clienteService.buscarPessoaPorID(id);

        if (pessoa == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(pessoa);
    }

    @GetMapping("/doc/{doc}")
    public ResponseEntity<Pessoa> buscarClientePorDocumento(@PathVariable String doc) {
        Pessoa pessoa = clienteService.buscarPessoaPorDocumento(doc);

        if (pessoa == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(pessoa);
    }
}
