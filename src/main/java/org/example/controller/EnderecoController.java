package org.example.controller;

import org.example.models.endereco.Endereco;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {
    private final EnderecoService enderecoService;

    public EnderecoController(EnderecoService enderecoService) {
        this.enderecoService = enderecoService;
    }

    @PostMapping
    public ResponseEntity<Endereco> cadastrarEndereco(@RequestBody Endereco endereco){
        Endereco enderecoSalvo = enderecoService.cadastrarEndereco(endereco);

        return ResponseEntity.ok(enderecoSalvo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Endereco> buscarEnderecoPorId(@PathVariable String id){
        Endereco endereco = enderecoService.buscarPorID(id);

        return ResponseEntity.ok(endereco);
    }

    @GetMapping
    public ResponseEntity<Endereco> buscarEnderecoPorCEP(@RequestParam String cep){
        Endereco endereco = enderecoService.buscarPorCEP(cep);

        return ResponseEntity.ok(endereco);
    }
}
