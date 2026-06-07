package com.example.demo.Repository;

import com.example.demo.Model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // All messages for a project, ordered oldest first
    List<ChatMessage> findByProjectIdOrderBySentAtAsc(Long projectId);
}
