<?php

namespace App\Notifications;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class ProjectInvitation extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Project $project,
        public User $invitedBy,
        public string $role = 'member'
    ) {}

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Project Invitation: ' . $this->project->name)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('You have been invited to join the project: "' . $this->project->name . '"')
            ->line('Role: ' . ucfirst($this->role))
            ->when($this->project->description, function ($message) {
                return $message->line('Description: ' . $this->project->description);
            })
            ->line('Priority: ' . ucfirst($this->project->priority))
            ->when($this->project->due_date, function ($message) {
                return $message->line('Due Date: ' . $this->project->due_date->format('M d, Y'));
            })
            ->line('Invited by: ' . $this->invitedBy->name)
            ->action('View Project', route('user.projects.show', $this->project))
            ->line('Thank you for using TaskFlowPro!');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'project_invitation',
            'project_id' => $this->project->id,
            'project_name' => $this->project->name,
            'project_priority' => $this->project->priority,
            'role' => $this->role,
            'due_date' => $this->project->due_date?->format('Y-m-d'),
            'invited_by' => [
                'id' => $this->invitedBy->id,
                'name' => $this->invitedBy->name,
            ],
            'message' => $this->invitedBy->name . ' invited you to join project: "' . $this->project->name . '" as ' . $this->role,
            'action_url' => route('user.projects.show', $this->project),
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => 'project_invitation',
            'data' => $this->toArray($notifiable),
            'read_at' => null,
            'created_at' => now(),
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return ['user.' . $notifiable->id];
    }
}
