package com.example.demo.Model;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clientName;
    private String company;
    private String contactEmail;
    private String phone;
    private String profileUrl;
    @OneToMany(mappedBy = "client")
    private List<Project> postedProjects;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
