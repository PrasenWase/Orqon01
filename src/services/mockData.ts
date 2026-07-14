/* =============================================
   Mock Data — Orqon
   All data is static/mock. No real API calls.
   ============================================= */

// ---- Types ----
export interface User {
  id: string;
  name: string;
  initials: string;
  role: string;
  avatarUrl?: string;
}

export type TaskStatus = 'to-do' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type ProjectStatus = 'healthy' | 'at-risk' | 'delayed' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  projectTitle: string;
  assignee: User;
  deadline: string;
  description?: string;
}

export interface ActivityItem {
  id: string;
  user: User;
  action: string;
  target: string;
  projectTitle: string;
  timestamp: string;
  type: 'task' | 'comment' | 'file' | 'status' | 'member';
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'ai' | 'task' | 'mention' | 'deadline';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  openTasks: number;
  deadline: string;
  team: User[];
  priority?: TaskPriority;
  aiRecommendation?: {
    text: string;
    actionLabel: string;
    isBlocker?: boolean;
  };
}

// ---- Users ----
export const mockUsers: Record<string, User> = {
  sarah: {
    id: 'u1',
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'Engineering Lead',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah-orqon',
  },
  rahul: {
    id: 'u2',
    name: 'Rahul Shah',
    initials: 'RS',
    role: 'Senior Backend Engineer',
    avatarUrl: 'https://i.pravatar.cc/150?u=rahul-orqon',
  },
  elena: {
    id: 'u3',
    name: 'Elena Marchetti',
    initials: 'EM',
    role: 'Product Designer',
    avatarUrl: 'https://i.pravatar.cc/150?u=elena-orqon',
  },
  marcus: {
    id: 'u4',
    name: 'Marcus Tanner',
    initials: 'MT',
    role: 'DevOps Engineer',
    avatarUrl: 'https://i.pravatar.cc/150?u=marcus-orqon',
  },
  priya: {
    id: 'u5',
    name: 'Priya Nair',
    initials: 'PN',
    role: 'QA Engineer',
    avatarUrl: 'https://i.pravatar.cc/150?u=priya-orqon',
  },
};

// ---- Projects ----
export const mockProjects: Project[] = [
  {
    id: 'p1',
    title: 'Apollo Mobile App',
    description: 'Next-generation fintech mobile platform for Apollo Fintech Solutions.',
    status: 'at-risk',
    progress: 62,
    openTasks: 12,
    deadline: 'Aug 15, 2026',
    team: [mockUsers.sarah, mockUsers.rahul, mockUsers.elena, mockUsers.marcus],
    aiRecommendation: {
      text: 'Backend API has not been updated in 2 days. Critical path delay likely.',
      actionLabel: 'View blocker',
      isBlocker: true,
    },
  },
  {
    id: 'p2',
    title: 'Cyber-Shield Firewall',
    description: 'AI-driven adaptive security layer for enterprise VPC infrastructure.',
    status: 'healthy',
    progress: 88,
    openTasks: 3,
    deadline: 'Aug 30, 2026',
    team: [mockUsers.rahul, mockUsers.marcus],
    aiRecommendation: {
      text: 'Final testing phase — 2 tests remain. On track for delivery.',
      actionLabel: 'View test report',
    },
  },
  {
    id: 'p3',
    title: 'Helios Solar Analytics',
    description: 'Real-time monitoring and analytics for renewable energy grids.',
    status: 'healthy',
    progress: 40,
    openTasks: 18,
    deadline: 'Nov 15, 2026',
    team: [mockUsers.sarah, mockUsers.elena],
    aiRecommendation: {
      text: 'Data ingestion rates are 20% higher than projected. Resize DB?',
      actionLabel: 'Scaling options',
    },
  },
  {
    id: 'p4',
    title: 'Orion Supply Chain',
    description: 'Blockchain-based transparency platform for global logistics.',
    status: 'completed',
    progress: 100,
    openTasks: 0,
    deadline: 'Jul 10, 2026',
    team: [mockUsers.marcus, mockUsers.priya],
    aiRecommendation: {
      text: 'Project ready for final audit. Automate closure report?',
      actionLabel: 'Generate Report',
    },
  },
  {
    id: 'p5',
    title: 'Quantum LLM Training',
    description: 'Optimizing foundational AI models for edge computing deployment.',
    status: 'delayed',
    progress: 10,
    openTasks: 64,
    deadline: 'Dec 20, 2026',
    team: [mockUsers.rahul, mockUsers.sarah, mockUsers.elena],
    aiRecommendation: {
      text: 'Training compute costs exceed budget by 15%. Recommend spot instances.',
      actionLabel: 'Compute dashboard',
      isBlocker: true,
    },
  },
  {
    id: 'p6',
    title: 'Zenith Consumer App',
    description: 'Consumer-facing mobile application for the Zenith financial suite.',
    status: 'at-risk',
    progress: 55,
    openTasks: 22,
    deadline: 'Sep 30, 2026',
    team: [mockUsers.elena, mockUsers.priya],
    aiRecommendation: {
      text: 'Design handoff incomplete. 3 screens pending developer review.',
      actionLabel: 'Open design review',
    },
  },
];

// ---- Tasks ----
export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Implement 2FA with biometric lock screen',
    status: 'in-progress',
    priority: 'high',
    projectId: 'p1',
    projectTitle: 'Apollo Mobile App',
    assignee: mockUsers.rahul,
    deadline: 'Jul 13, 2026',
    description: 'Integrate biometric authentication into the 2FA flow. Support Face ID and fingerprint on iOS and Android.',
  },
  {
    id: 't2',
    title: 'Design onboarding flow for new users',
    status: 'review',
    priority: 'high',
    projectId: 'p1',
    projectTitle: 'Apollo Mobile App',
    assignee: mockUsers.elena,
    deadline: 'Jul 14, 2026',
  },
  {
    id: 't3',
    title: 'Set up CI/CD pipeline for staging',
    status: 'to-do',
    priority: 'medium',
    projectId: 'p2',
    projectTitle: 'Cyber-Shield Firewall',
    assignee: mockUsers.marcus,
    deadline: 'Jul 18, 2026',
  },
  {
    id: 't4',
    title: 'Fix memory leak in real-time data feed',
    status: 'in-progress',
    priority: 'high',
    projectId: 'p3',
    projectTitle: 'Helios Solar Analytics',
    assignee: mockUsers.sarah,
    deadline: 'Jul 12, 2026',
  },
  {
    id: 't5',
    title: 'Write API documentation for v3 endpoints',
    status: 'to-do',
    priority: 'low',
    projectId: 'p5',
    projectTitle: 'Quantum LLM Training',
    assignee: mockUsers.priya,
    deadline: 'Jul 20, 2026',
  },
  {
    id: 't6',
    title: 'Conduct security penetration test',
    status: 'done',
    priority: 'high',
    projectId: 'p2',
    projectTitle: 'Cyber-Shield Firewall',
    assignee: mockUsers.marcus,
    deadline: 'Jul 8, 2026',
  },
];

// ---- Activity Feed ----
export const mockActivity: ActivityItem[] = [
  {
    id: 'a1',
    user: mockUsers.sarah,
    action: 'completed',
    target: 'DB schema migration script',
    projectTitle: 'Apollo Mobile App',
    timestamp: '2m ago',
    type: 'task',
  },
  {
    id: 'a2',
    user: mockUsers.rahul,
    action: 'commented on',
    target: 'Biometric lock screen ticket',
    projectTitle: 'Apollo Mobile App',
    timestamp: '14m ago',
    type: 'comment',
  },
  {
    id: 'a3',
    user: mockUsers.marcus,
    action: 'uploaded',
    target: 'infra-v2-final.pdf',
    projectTitle: 'Cyber-Shield Firewall',
    timestamp: '1h ago',
    type: 'file',
  },
  {
    id: 'a4',
    user: mockUsers.elena,
    action: 'moved task to',
    target: 'Review — Onboarding flow',
    projectTitle: 'Apollo Mobile App',
    timestamp: '2h ago',
    type: 'status',
  },
  {
    id: 'a5',
    user: mockUsers.priya,
    action: 'joined',
    target: 'Zenith Consumer App',
    projectTitle: 'Zenith Consumer App',
    timestamp: '3h ago',
    type: 'member',
  },
];

// ---- Notifications ----
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Blocker Detected',
    body: 'Apollo Mobile App backend API stale for 48h. Action required.',
    timestamp: '5m ago',
    read: false,
    type: 'ai',
  },
  {
    id: 'n2',
    title: 'Task Assigned',
    body: 'Rahul Shah assigned you "Review API auth layer" in Apollo.',
    timestamp: '1h ago',
    read: false,
    type: 'task',
  },
  {
    id: 'n3',
    title: 'Deadline Tomorrow',
    body: '"Fix memory leak" is due tomorrow — Helios Solar Analytics.',
    timestamp: '3h ago',
    read: false,
    type: 'deadline',
  },
  {
    id: 'n4',
    title: 'Mentioned in comment',
    body: 'Elena mentioned you in Onboarding flow discussion.',
    timestamp: '5h ago',
    read: true,
    type: 'mention',
  },
  {
    id: 'n5',
    title: 'AI Insight Ready',
    body: 'Weekly project health report generated. 2 projects need attention.',
    timestamp: '1d ago',
    read: true,
    type: 'ai',
  },
];
