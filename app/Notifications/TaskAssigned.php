<?php

namespace App\Notifications;

use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class TaskAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Task $task,
        public User $assignedBy
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
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
            ->subject('New Task Assigned: ' . $this->task->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('You have been assigned a new task: "' . $this->task->title . '"')
            ->when($this->task->project, function ($message) {
                return $message->line('Project: ' . $this->task->project->name);
            })
            ->line('Priority: ' . ucfirst($this->task->priority))
            ->when($this->task->due_date, function ($message) {
                return $message->line('Due Date: ' . $this->task->due_date->format('M d, Y'));
            })
            ->line('Assigned by: ' . $this->assignedBy->name)
            ->action('View Task', route('user.tasks.show', $this->task))
            ->line('Thank you for using TaskFlowPro!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'task_assigned',
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'task_priority' => $this->task->priority,
            'project_name' => $this->task->project?->name,
            'due_date' => $this->task->due_date?->format('Y-m-d'),
            'assigned_by' => [
                'id' => $this->assignedBy->id,
                'name' => $this->assignedBy->name,
            ],
            'message' => $this->assignedBy->name . ' assigned you a task: "' . $this->task->title . '"',
            'action_url' => route('user.tasks.show', $this->task),
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => 'task_assigned',
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
        return ['user.' . $this->task->assigned_to];
    }
}
