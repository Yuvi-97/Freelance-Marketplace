package com.example.demo.Controller;

import com.example.demo.Model.ChatMessage;
import com.example.demo.Service.ChatService;
import com.example.demo.dto.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * WebSocket endpoint: client sends to /app/chat.send
     * Server broadcasts to /topic/chat/{projectId}
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageDto dto) {
        try {
            ChatMessage saved = chatService.saveMessage(dto);
            messagingTemplate.convertAndSend(
                    "/topic/chat/" + dto.getProjectId(),
                    saved
            );
        } catch (Exception e) {
            System.err.println("Chat error: " + e.getMessage());
        }
    }

    /**
     * REST endpoint: load chat history for a project
     * GET /api/chat/{projectId}/messages?userId={userId}
     */
    @GetMapping("/api/chat/{projectId}/messages")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @PathVariable Long projectId,
            @RequestParam Long userId) {
        return ResponseEntity.ok(chatService.getMessagesForProject(projectId, userId));
    }
}
