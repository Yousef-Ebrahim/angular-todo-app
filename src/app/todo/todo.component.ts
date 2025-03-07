import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'todo',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  animations: [
    trigger('taskAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateX(50px)' })
        ),
      ]),
    ]),
  ],
  standalone: true,
})
export class TodoComponent {
  newTask: string = '';
  filterStatus: string = 'all';
  tasks: { name: string; completed: boolean; isEditing: false }[] = [];
  filteredTasks: { name: string; completed: boolean; isEditing: false }[] = [];

  constructor(private toastr: ToastrService) {}
  ngOnInit(): void {
    this.loadTasks();
  }

  addTask() {
    if (this.newTask.trim() !== '') {
      this.tasks.push({
        name: this.newTask,
        completed: false,
        isEditing: false,
      });
      this.newTask = '';
      this.saveTasks();
      this.filterTasks();
      this.toastr.success('✅ Add Task Successfully');
    }
  }

  toggleTask(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
    this.saveTasks();
    this.filterTasks();
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
    this.saveTasks();
    this.filterTasks();

    this.toastr.error('🗑️ Delete this task');
  }
  confirmDelete(index: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.removeTask(index);
    }
  }
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    } else {
      this.tasks = [];
    }
    this.filterTasks();
  }

  setFilter(status: string) {
    this.filterStatus = status;
    this.filterTasks();
  }

  filterTasks() {
    if (this.filterStatus === 'all') {
      this.filteredTasks = [...this.tasks];
    } else if (this.filterStatus === 'completed') {
      this.filteredTasks = this.tasks.filter((task) => task.completed);
    } else {
      this.filteredTasks = this.tasks.filter((task) => !task.completed);
    }
  }
  editTask(task: any) {
    task.isEditing = true;
  }

  saveEdit(task: any) {
    task.isEditing = false;
    this.saveTasks();
    this.toastr.warning('⚠️ Done Edit');
  }
}
