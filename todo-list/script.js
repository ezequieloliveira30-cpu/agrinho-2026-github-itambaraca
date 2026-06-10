// ==================== TODO APP STATE ====================

const todoApp = {
    todos: [],
    currentFilter: 'all',
    currentSearch: '',
    confirmDelete: null,
    editingId: null
};

// ==================== DOM ELEMENTS ====================

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const categorySelect = document.getElementById('categorySelect');
const clearCompletedBtn = document.getElementById('clearCompleted');
const clearAllBtn = document.getElementById('clearAll');
const sortByDateBtn = document.getElementById('sortByDate');
const totalTasksSpan = document.getElementById('totalTasks');
const completedCountSpan = document.getElementById('completedCount');
const activeTasksSpan = document.getElementById('activeTasks');
const confirmModal = document.getElementById('confirmModal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

// ==================== LOCAL STORAGE ====================

const STORAGE_KEY = 'todoAppData';

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoApp.todos));
}

function loadTodos() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        todoApp.todos = JSON.parse(saved);
    }
}

function saveTheme(isDark) {
    localStorage.setItem('todoDarkMode', isDark);
}

function loadTheme() {
    const isDark = localStorage.getItem('todoDarkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
}

// ==================== UTILITY FUNCTIONS ====================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getCategoryEmoji(category) {
    const emojis = {
        'work': '🏢',
        'personal': '👤',
        'shopping': '🛒',
        'health': '💪',
        'other': '✨'
    };
    return emojis[category] || '✨';
}

// ==================== TODO OPERATIONS ====================

function createTodo(text, category) {
    if (!text.trim()) {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: generateId(),
        text: text.trim(),
        completed: false,
        category: category,
        createdAt: new Date().toISOString()
    };

    todoApp.todos.unshift(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

function toggleTodo(id) {
    const todo = todoApp.todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todoApp.todos = todoApp.todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
    closeModal();
}

function editTodo(id, newText) {
    if (!newText.trim()) {
        alert('Task cannot be empty!');
        return;
    }

    const todo = todoApp.todos.find(t => t.id === id);
    if (todo) {
        todo.text = newText.trim();
        saveTodos();
        todoApp.editingId = null;
        renderTodos();
    }
}

function clearCompleted() {
    if (confirm('Clear all completed tasks?')) {
        todoApp.todos = todoApp.todos.filter(t => !t.completed);
        saveTodos();
        renderTodos();
    }
}

function clearAll() {
    if (confirm('Delete all tasks? This cannot be undone.')) {
        todoApp.todos = [];
        saveTodos();
        renderTodos();
    }
}

function sortByDate() {
    todoApp.todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    saveTodos();
    renderTodos();
}

// ==================== FILTERING & SEARCHING ====================

function getFilteredTodos() {
    let filtered = todoApp.todos;

    // Apply filter
    if (todoApp.currentFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    } else if (todoApp.currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }

    // Apply search
    if (todoApp.currentSearch) {
        filtered = filtered.filter(t => 
            t.text.toLowerCase().includes(todoApp.currentSearch.toLowerCase())
        );
    }

    return filtered;
}

function updateStats() {
    const total = todoApp.todos.length;
    const completed = todoApp.todos.filter(t => t.completed).length;
    const active = total - completed;

    totalTasksSpan.textContent = total;
    completedCountSpan.textContent = completed;
    activeTasksSpan.textContent = active;
}

// ==================== RENDERING ====================

function renderTodos() {
    const filteredTodos = getFilteredTodos();
    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        if (todoApp.editingId === todo.id) {
            li.innerHTML = `
                <div class="edit-mode">
                    <input 
                        type="text" 
                        class="edit-input" 
                        value="${todo.text}"
                        id="editInput"
                    >
                    <button class="btn-save" onclick="saveTodoEdit('${todo.id}')">Save</button>
                    <button class="btn-cancel-edit" onclick="cancelTodoEdit()">Cancel</button>
                </div>
            `;
            // Focus and select text in input
            setTimeout(() => {
                const input = document.getElementById('editInput');
                input.focus();
                input.select();
            }, 0);
        } else {
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo('${todo.id}')"
                >
                <div class="todo-content">
                    <div class="todo-text">${escapeHtml(todo.text)}</div>
                    <div class="todo-date">${formatDate(todo.createdAt)}</div>
                </div>
                <span class="category-badge ${todo.category}">
                    ${getCategoryEmoji(todo.category)} ${todo.category}
                </span>
                <div class="todo-actions">
                    <button class="btn-edit" onclick="startTodoEdit('${todo.id}')" title="Edit">✏️</button>
                    <button class="btn-delete-item" onclick="showDeleteConfirm('${todo.id}')" title="Delete">🗑️</button>
                </div>
            `;
        }

        todoList.appendChild(li);
    });

    updateStats();
}

// ==================== EDIT FUNCTIONS ====================

function startTodoEdit(id) {
    todoApp.editingId = id;
    renderTodos();
}

function saveTodoEdit(id) {
    const input = document.getElementById('editInput');
    editTodo(id, input.value);
}

function cancelTodoEdit() {
    todoApp.editingId = null;
    renderTodos();
}

// ==================== DELETE CONFIRMATION ====================

function showDeleteConfirm(id) {
    todoApp.confirmDelete = id;
    document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this task?';
    confirmModal.classList.add('active');
}

function closeModal() {
    confirmModal.classList.remove('active');
    todoApp.confirmDelete = null;
}

// ==================== EVENT LISTENERS ====================

// Add todo
addBtn.addEventListener('click', () => {
    const category = categorySelect.value;
    createTodo(todoInput.value, category);
});

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const category = categorySelect.value;
        createTodo(todoInput.value, category);
    }
});

// Filter todos
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        todoApp.currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Search todos
searchInput.addEventListener('input', (e) => {
    todoApp.currentSearch = e.target.value;
    renderTodos();
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    saveTheme(isDark);
});

// Clear completed
clearCompletedBtn.addEventListener('click', clearCompleted);

// Clear all
clearAllBtn.addEventListener('click', clearAll);

// Sort by date
sortByDateBtn.addEventListener('click', sortByDate);

// Modal buttons
cancelBtn.addEventListener('click', closeModal);

confirmBtn.addEventListener('click', () => {
    if (todoApp.confirmDelete) {
        deleteTodo(todoApp.confirmDelete);
    }
});

// Close modal on outside click
confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && confirmModal.classList.contains('active')) {
        closeModal();
    }
});

// ==================== UTILITY ====================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    loadTheme();
    renderTodos();
    todoInput.focus();

    console.log('%c📋 To-Do List App Loaded!', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('✅ All your tasks are saved in local storage automatically!');
});
