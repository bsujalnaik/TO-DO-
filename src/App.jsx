import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filter, setFilter] = useState('All');
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    deadline: '',
    priority: 'Medium',
    status: 'Not Started',
    notes: ''
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('professionalTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('professionalTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTask = () => {
    if (newTask.name.trim()) {
      setTasks(prev => [...prev, { ...newTask, id: Date.now() }]);
      setNewTask({
        name: '',
        description: '',
        deadline: '',
        priority: 'Medium',
        status: 'Not Started',
        notes: ''
      });
      setIsAddingTask(false);
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleUpdateTask = (id, field, value) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const filteredTasks = filter === 'All'
    ? tasks
    : filter === 'Completed'
      ? tasks.filter(task => task.status === 'Completed')
      : tasks.filter(task => task.priority === filter);

  const priorities = ['High', 'Medium', 'Low']; const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#dc2626';
      case 'Medium': return '#ea580c';
      case 'Low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const statuses = ['Not Started', 'In Progress', 'Completed', 'On Hold'];



  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1 className="title">Task Manager</h1>
          <p className="subtitle">Organize your priorities with clarity and precision</p>
        </header>

        {/* Controls */}
        <div className="controls">
          <div className="filter-group">
            <label className="filter-label">Filter by Priority:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
                onClick={() => setFilter('All')}
              >
                All
              </button>
              {priorities.map(priority => (
                <button
                  key={priority}
                  className={`filter-btn ${filter === priority ? 'active' : ''}`}
                  onClick={() => setFilter(priority)}
                >
                  {priority}
                </button>
              ))}
              <button
                className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`}
                onClick={() => setFilter('Completed')}
              >
                Completed
              </button>
            </div>
          </div>

          <button
            className="add-task-btn"
            onClick={() => setIsAddingTask(!isAddingTask)}
          >
            {isAddingTask ? 'Cancel' : '+ Add New Task'}
          </button>
        </div>

        {/* Add Task Form */}
        {isAddingTask && (
          <div className="task-form">
            <h3 className="form-title">Create New Task</h3>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Task Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={newTask.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter task name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={newTask.deadline}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={newTask.status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Provide task details..."
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={newTask.notes}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Additional notes or comments..."
                rows="2"
              />
            </div>

            <button
              className="submit-btn"
              onClick={handleAddTask}
              disabled={!newTask.name.trim()}
            >
              Save Task
            </button>
          </div>
        )}

        {/* Tasks List */}
        <div className="tasks-section">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-text">No tasks found</p>
              <p className="empty-subtext">
                {filter === 'Completed'
                  ? 'No completed tasks yet'
                  : filter !== 'All'
                    ? `No tasks with ${filter} priority`
                    : 'Click "Add New Task" to get started'}
              </p>
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <div className="task-title-row">
                      <h3 className="task-name">{task.name}</h3>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete task"
                      >
                        ×
                      </button>
                    </div>
                    <div
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority} Priority
                    </div>
                  </div>

                  <div className="task-body">
                    {task.description && (
                      <div className="task-field">
                        <label className="field-label">Description</label>
                        <p className="field-value">{task.description}</p>
                      </div>
                    )}

                    <div className="task-meta">
                      <div className="task-field">
                        <label className="field-label">Status</label>
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateTask(task.id, 'status', e.target.value)}
                          className="inline-select"
                        >
                          {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {task.deadline && (
                        <div className="task-field">
                          <label className="field-label">Deadline</label>
                          <p className="field-value deadline">
                            {new Date(task.deadline).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>

                    {task.notes && (
                      <div className="task-field">
                        <label className="field-label">Notes</label>
                        <p className="field-value notes">{task.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>Total Tasks: <strong>{tasks.length}</strong></p>
          <p>Active: <strong>{tasks.filter(t => t.status === 'In Progress').length}</strong></p>
          <p>Completed: <strong>{tasks.filter(t => t.status === 'Completed').length}</strong></p>
        </footer>
      </div>
    </div>
  );
}

export default App;
