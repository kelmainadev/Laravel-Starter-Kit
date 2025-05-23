<?php

namespace App\Notifications;

use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class TaskUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Task $task,
        public User $updatedBy,
        public array $changes = []
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Task Updated: ' . $this->task->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('A task you\'re involved with has been updated: "' . $this->task->title . '"')
            ->when($this->task->project, function ($message) {
                return $message->line('Project: ' . $this->task->project->name);
            })
            ->when(!empty($this->changes), function ($message) {
                $message->line('Changes made:');
                foreach ($this->changes as $field => $change) {
                    $message->line('• ' . ucfirst(str_replace('_', ' ', $field)) . ': ' . $change['old'] . ' → ' . $change['new']);
                }
                return $message;
            })
            ->line('Updated by: ' . $this->updatedBy->name)
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
        $changesText = '';
        if (!empty($this->changes)) {
            $changesList = [];
            foreach ($this->changes as $field => $change) {
                $changesList[] = ucfirst(str_replace('_', ' ', $field)) . ': ' . $change['old'] . ' → ' . $change['new'];
            }
            $changesText = ' (' . implode(', ', $changesList) . ')';
        }

        return [
            'type' => 'task_updated',
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'task_status' => $this->task->status,
            'project_name' => $this->task->project?->name,
            'changes' => $this->changes,
            'updated_by' => [
                'id' => $this->updatedBy->id,
                'name' => $this->updatedBy->name,
            ],
            'message' => $this->updatedBy->name . ' updated task: "' . $this->task->title . '"' . $changesText,
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
            'type' => 'task_updated',
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
        $channels = [];
        
        // Notify assigned user
        if ($this->task->assigned_to) {
            $channels[] = 'user.' . $this->task->assigned_to;
        }
        
        // Notify task creator if different from updater
        if ($this->task->created_by && $this->task->created_by !== $this->updatedBy->id) {
            $channels[] = 'user.' . $this->task->created_by;
        }
        
        // Notify project owner if different from updater
        if ($this->task->project && $this->task->project->owner_id !== $this->updatedBy->id) {
            $channels[] = 'user.' . $this->task->project->owner_id;
        }
        
        return array_unique($channels);
    }
}
