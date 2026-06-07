package com.example.demo.dto;

import lombok.Data;

@Data
public class ChatMessageDto {
    private Long projectId;
    private Long senderId;
    private String content;
}
