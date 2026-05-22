package com.example.demo.Controller;

import com.example.demo.Model.*;
import com.example.demo.Service.*;
import com.example.demo.dto.ClientDashboardDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientProfileController {

    @Autowired
    private ClientProfileService clientProfileService;

    @GetMapping
    public List<ClientProfile> getAllClients() {
        return clientProfileService.getAllClients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientProfile> getClient(@PathVariable Long id) {
        return ResponseEntity.ok(clientProfileService.getClientById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ClientProfile> getClientByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(clientProfileService.getClientByUserId(userId));
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<ClientDashboardDto> getClientDashboard(@PathVariable Long id) {
        return ResponseEntity.ok(clientProfileService.getDashboard(id));
    }
}
