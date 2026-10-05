package com.rtps.platform.controller;

import com.rtps.platform.dto.response.ApiResponse;
import com.rtps.platform.dto.response.NotificationDto;
import com.rtps.platform.entity.User;
import com.rtps.platform.service.AuthService;
import com.rtps.platform.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    public NotificationController(NotificationService notificationService, AuthService authService) {
        this.notificationService = notificationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications() {
        User user = authService.getCurrentAuthenticatedUser();
        List<NotificationDto> notifications = notificationService.getUserNotifications(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notifications retrieved", notifications));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        User user = authService.getCurrentAuthenticatedUser();
        long count = notificationService.getUnreadCount(user.getId());
        Map<String, Long> map = new HashMap<>();
        map.put("unreadCount", count);
        return ResponseEntity.ok(ApiResponse.ok("Unread notification count", map));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDto>> markAsRead(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        NotificationDto dto = notificationService.markAsRead(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", dto));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        User user = authService.getCurrentAuthenticatedUser();
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", null));
    }
}
