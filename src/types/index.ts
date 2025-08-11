export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  dueDate?: string
  userId: string
  createdAt: string
  updatedAt: string
  tags: Tag[]
}

export interface Tag {
  id: string
  name: string
  color: string
  userId: string
  createdAt: string
}

export interface TaskTag {
  taskId: string
  tagId: string
}

export interface FilterState {
  priority: 'all' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'all' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  search: string
  selectedTags: string[]
}

export interface Theme {
  mode: 'light' | 'dark'
}

export interface TaskFormData {
  title: string
  description?: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  dueDate?: string
  tagIds?: string[]
}

export interface CreateTaskData {
  title: string
  description?: string
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  dueDate?: string
  tagIds?: string[]
}

export interface UpdateTaskData {
  title?: string
  description?: string
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  dueDate?: string
  tagIds?: string[]
}
