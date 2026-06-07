package com.example.demo.Service;

import com.example.demo.Model.ChatMessage;
import com.example.demo.Model.Project;
import com.example.demo.Model.ProjectStatus;
import com.example.demo.Model.User;
import com.example.demo.Repository.ChatMessageRepository;
import com.example.demo.Repository.ProjectRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    /**
     * Validates that the sender is either the client or the assigned freelancer
     * for this project, and that the project is in an active state.
     */
    public ChatMessage saveMessage(ChatMessageDto dto) {
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Only allow chat on ASSIGNED or IN_PROGRESS projects
        if (project.getStatus() != ProjectStatus.ASSIGNED
                && project.getStatus() != ProjectStatus.IN_PROGRESS) {
            throw new RuntimeException("Chat is only available for active projects");
        }

        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // Verify sender is authorized (client or assigned freelancer)
        boolean isClient = project.getClient() != null
                && project.getClient().getUser() != null
                && project.getClient().getUser().getId().equals(dto.getSenderId());

        boolean isFreelancer = project.getAssignedFreelancer() != null
                && project.getAssignedFreelancer().getUser() != null
                && project.getAssignedFreelancer().getUser().getId().equals(dto.getSenderId());

        if (!isClient && !isFreelancer) {
            throw new RuntimeException("Unauthorized: You are not a participant in this project");
        }

        ChatMessage message = new ChatMessage();
        message.setProject(project);
        message.setSender(sender);
        message.setContent(dto.getContent().trim());

        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getMessagesForProject(Long projectId, Long requestingUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Verify requester is authorized
        boolean isClient = project.getClient() != null
                && project.getClient().getUser() != null
                && project.getClient().getUser().getId().equals(requestingUserId);

        boolean isFreelancer = project.getAssignedFreelancer() != null
                && project.getAssignedFreelancer().getUser() != null
                && project.getAssignedFreelancer().getUser().getId().equals(requestingUserId);

        if (!isClient && !isFreelancer) {
            throw new RuntimeException("Unauthorized: You are not a participant in this project");
        }

        return chatMessageRepository.findByProjectIdOrderBySentAtAsc(projectId);
    }
}
