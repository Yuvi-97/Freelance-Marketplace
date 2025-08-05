package com.example.demo.Service;

import com.example.demo.Model.*;
import com.example.demo.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientProfileService {

    @Autowired
    private ClientProfileRepository clientProfileRepository;

    public ClientProfile createClient(ClientProfile clientProfile) {
        return clientProfileRepository.save(clientProfile);
    }

    public List<ClientProfile> getAllClients() {
        return clientProfileRepository.findAll();
    }

    public ClientProfile getClientById(Long id) {
        return clientProfileRepository.findById(id).orElse(null);
    }
}
