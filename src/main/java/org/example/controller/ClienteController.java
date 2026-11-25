package org.example.controller;

import org.example.models.pessoa.Pessoa;
import org.example.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {
    private final ClienteService clienteService;

    public ClienteController (ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<Pessoa> cadastrarCliente(@RequestBody Pessoa cliente) {
        Pessoa clienteSalvo = clienteService.cadastrarCliente(cliente);

        if (clienteSalvo == null)
            return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(clienteSalvo);
    }

    @GetMapping
    public ResponseEntity<List<Pessoa>> listarClientes() {
        List<Pessoa> clientes = clienteService.listarClientes();

        if (clientes == null || clientes.isEmpty())
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pessoa> buscarClientePorID(@PathVariable Integer id) {
        Pessoa cliente = clienteService.buscarClientePorID(id);

        if (cliente == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(cliente);
    }

    @GetMapping("/doc/{doc}")
    public ResponseEntity<Pessoa> buscarClientePorDocumento(@PathVariable String doc) {
        Pessoa cliente = clienteService.buscarClientePorDocumento(doc);

        if (cliente == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(cliente);
    }
}
