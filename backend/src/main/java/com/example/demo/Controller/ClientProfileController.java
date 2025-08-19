package com.example.demo.Controller;

import com.example.demo.Model.*;
import com.example.demo.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientProfileController {

    @Autowired
    private ClientProfileService clientProfileService;

    @PostMapping
    public ClientProfile createClient(@RequestBody ClientProfile clientProfile) {
        return clientProfileService.createClient(clientProfile);
    }

    @GetMapping
    public List<ClientProfile> getAllClients() {
        return clientProfileService.getAllClients();
    }

    @GetMapping("/{id}")
    public ClientProfile getClient(@PathVariable Long id) {
        return clientProfileService.getClientById(id);
    }

    @GetMapping("/user/{userId}")
    public ClientProfile getClientByUserId(@PathVariable Long userId) {
        return clientProfileService.getClientByUserId(userId);
    }

}
