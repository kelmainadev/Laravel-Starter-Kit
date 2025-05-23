<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;

class TaskProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users by role
        $users = User::all();
        $regularUsers = User::role('user')->get();
        $adminUsers = User::role('admin')->get();
        $superadminUsers = User::role('superadmin')->get();

        // Sample projects data
        $projectsData = [
            [
                'name' => 'Website Redesign',
                'description' => 'Complete redesign of the company website with modern UI/UX',
                'status' => 'active',
                'priority' => 'high',
                'start_date' => Carbon::now()->subDays(10),
                'due_date' => Carbon::now()->addDays(30),
                'budget' => 15000.00,
                'tags' => ['web', 'design', 'ui/ux'],
                'notes' => 'Focus on mobile-first approach and accessibility',
            ],
            [
                'name' => 'Mobile App Development',
                'description' => 'Develop native mobile app for iOS and Android',
                'status' => 'planning',
                'priority' => 'urgent',
                'start_date' => Carbon::now()->addDays(5),
                'due_date' => Carbon::now()->addDays(90),
                'budget' => 50000.00,
                'tags' => ['mobile', 'ios', 'android'],
                'notes' => 'Need to finalize wireframes first',
            ],
            [
                'name' => 'Database Migration',
                'description' => 'Migrate legacy database to new cloud infrastructure',
                'status' => 'active',
                'priority' => 'medium',
                'start_date' => Carbon::now()->subDays(20),
                'due_date' => Carbon::now()->addDays(15),
                'budget' => 8000.00,
                'tags' => ['database', 'migration', 'cloud'],
                'notes' => 'Critical to minimize downtime',
            ],
            [
                'name' => 'Marketing Campaign Q1',
                'description' => 'Launch comprehensive marketing campaign for Q1',
                'status' => 'completed',
                'priority' => 'medium',
                'start_date' => Carbon::now()->subDays(60),
                'due_date' => Carbon::now()->subDays(10),
                'budget' => 25000.00,
                'tags' => ['marketing', 'campaign', 'q1'],
                'notes' => 'Successfully exceeded targets by 15%',
            ],
            [
                'name' => 'API Integration',
                'description' => 'Integrate third-party APIs for enhanced functionality',
                'status' => 'on_hold',
                'priority' => 'low',
                'start_date' => Carbon::now()->addDays(20),
                'due_date' => Carbon::now()->addDays(60),
                'budget' => 5000.00,
                'tags' => ['api', 'integration', 'backend'],
                'notes' => 'Waiting for vendor documentation updates',
            ],
        ];

        // Create projects
        $createdProjects = [];
        foreach ($projectsData as $index => $projectData) {
            // Assign owners based on role distribution
            if ($index < 2 && !$adminUsers->isEmpty()) {
                $owner = $adminUsers->random();
            } elseif ($index < 4 && !$regularUsers->isEmpty()) {
                $owner = $regularUsers->random();
            } else {
                $owner = $users->random();
            }

            $project = Project::create([
                'name' => $projectData['name'],
                'description' => $projectData['description'],
                'owner_id' => $owner->id,
                'status' => $projectData['status'],
                'priority' => $projectData['priority'],
                'start_date' => $projectData['start_date'],
                'due_date' => $projectData['due_date'],
                'budget' => $projectData['budget'],
                'tags' => $projectData['tags'],
                'notes' => $projectData['notes'],
                'progress' => $projectData['status'] === 'completed' ? 100 : rand(10, 80),
            ]);

            $createdProjects[] = $project;

            // Add random members to projects
            $availableUsersCollection = $users->where('id', '!=', $owner->id);
            $memberCount = min(rand(1, 2), $availableUsersCollection->count());
            $availableUsers = $memberCount > 0 ? $availableUsersCollection->random($memberCount) : collect();
            
            foreach ($availableUsers as $member) {
                $project->members()->attach($member->id, [
                    'role' => ['member', 'manager', 'viewer'][rand(0, 2)],
                    'joined_at' => Carbon::now()->subDays(rand(1, 30)),
                ]);
            }
        }

        // Sample tasks data
        $tasksData = [
            // Website Redesign Project Tasks
            [
                'title' => 'Design Homepage Mockup',
                'description' => 'Create high-fidelity mockups for the new homepage design',
                'status' => 'completed',
                'priority' => 'high',
                'due_date' => Carbon::now()->subDays(5),
                'estimated_hours' => 16,
                'actual_hours' => 18,
                'tags' => ['design', 'homepage', 'mockup'],
                'notes' => 'Approved by stakeholders',
            ],
            [
                'title' => 'Implement Responsive Layout',
                'description' => 'Code the responsive layout using CSS Grid and Flexbox',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => Carbon::now()->addDays(7),
                'estimated_hours' => 24,
                'actual_hours' => 12,
                'tags' => ['frontend', 'responsive', 'css'],
                'notes' => 'Mobile layout needs adjustment',
            ],
            [
                'title' => 'Content Strategy Review',
                'description' => 'Review and update content strategy for the new design',
                'status' => 'todo',
                'priority' => 'medium',
                'due_date' => Carbon::now()->addDays(14),
                'estimated_hours' => 8,
                'tags' => ['content', 'strategy', 'review'],
                'notes' => 'Coordinate with marketing team',
            ],

            // Mobile App Development Tasks
            [
                'title' => 'Setup Development Environment',
                'description' => 'Configure React Native development environment',
                'status' => 'completed',
                'priority' => 'urgent',
                'due_date' => Carbon::now()->subDays(2),
                'estimated_hours' => 4,
                'actual_hours' => 6,
                'tags' => ['setup', 'react-native', 'environment'],
            ],
            [
                'title' => 'Design App Architecture',
                'description' => 'Plan the overall app architecture and data flow',
                'status' => 'in_review',
                'priority' => 'urgent',
                'due_date' => Carbon::now()->addDays(3),
                'estimated_hours' => 12,
                'actual_hours' => 10,
                'tags' => ['architecture', 'planning', 'mobile'],
            ],
            [
                'title' => 'Create User Authentication Flow',
                'description' => 'Implement login, registration, and password reset functionality',
                'status' => 'todo',
                'priority' => 'high',
                'due_date' => Carbon::now()->addDays(10),
                'estimated_hours' => 20,
                'tags' => ['authentication', 'security', 'mobile'],
            ],

            // Database Migration Tasks
            [
                'title' => 'Data Backup and Export',
                'description' => 'Create complete backup of legacy database',
                'status' => 'completed',
                'priority' => 'urgent',
                'due_date' => Carbon::now()->subDays(15),
                'estimated_hours' => 6,
                'actual_hours' => 8,
                'tags' => ['backup', 'export', 'database'],
            ],
            [
                'title' => 'Schema Migration Script',
                'description' => 'Write scripts to migrate database schema to new format',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => Carbon::now()->addDays(5),
                'estimated_hours' => 16,
                'actual_hours' => 8,
                'tags' => ['migration', 'schema', 'script'],
            ],
            [
                'title' => 'Performance Testing',
                'description' => 'Test database performance after migration',
                'status' => 'todo',
                'priority' => 'medium',
                'due_date' => Carbon::now()->addDays(12),
                'estimated_hours' => 8,
                'tags' => ['testing', 'performance', 'database'],
            ],

            // Standalone tasks (not in projects)
            [
                'title' => 'Update Documentation',
                'description' => 'Update API documentation with latest changes',
                'status' => 'todo',
                'priority' => 'low',
                'due_date' => Carbon::now()->addDays(20),
                'estimated_hours' => 4,
                'tags' => ['documentation', 'api'],
                'notes' => 'Include examples for new endpoints',
            ],
            [
                'title' => 'Security Audit',
                'description' => 'Conduct comprehensive security audit of the platform',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => Carbon::now()->addDays(7),
                'estimated_hours' => 16,
                'actual_hours' => 6,
                'tags' => ['security', 'audit', 'platform'],
            ],
        ];

        // Create tasks
        foreach ($tasksData as $index => $taskData) {
            // Assign to projects (first 9 tasks) or standalone (last 2)
            $projectId = null;
            if ($index < 3) {
                $projectId = $createdProjects[0]->id; // Website Redesign
            } elseif ($index < 6) {
                $projectId = $createdProjects[1]->id; // Mobile App
            } elseif ($index < 9) {
                $projectId = $createdProjects[2]->id; // Database Migration
            }

            // Select creator and assignee
            $creator = $users->random();
            $assignedTo = $users->random();

            // If task is in a project, prefer project members
            if ($projectId) {
                $project = collect($createdProjects)->where('id', $projectId)->first();
                $projectUsers = collect([$project->owner])->merge($project->members);
                
                if ($projectUsers->isNotEmpty()) {
                    $creator = $projectUsers->random();
                    $assignedTo = $projectUsers->random();
                }
            }

            $task = Task::create([
                'title' => $taskData['title'],
                'description' => $taskData['description'],
                'project_id' => $projectId,
                'assigned_to' => $assignedTo->id,
                'created_by' => $creator->id,
                'status' => $taskData['status'],
                'priority' => $taskData['priority'],
                'due_date' => $taskData['due_date'],
                'estimated_hours' => $taskData['estimated_hours'],
                'actual_hours' => $taskData['actual_hours'] ?? null,
                'progress' => $this->getProgressByStatus($taskData['status']),
                'tags' => $taskData['tags'],
                'notes' => $taskData['notes'] ?? null,
                'completed_at' => $taskData['status'] === 'completed' ? Carbon::now()->subDays(rand(1, 10)) : null,
            ]);
        }

        // Update project progress based on tasks
        foreach ($createdProjects as $project) {
            $project->updateProgress();
        }

        $this->command->info('TaskProjectSeeder completed successfully!');
        $this->command->info('Created ' . count($createdProjects) . ' projects and ' . count($tasksData) . ' tasks.');
    }

    private function getProgressByStatus($status)
    {
        return match($status) {
            'todo' => 0,
            'in_progress' => rand(20, 70),
            'in_review' => rand(80, 95),
            'completed' => 100,
            'cancelled' => 0,
            default => 0,
        };
    }
}
