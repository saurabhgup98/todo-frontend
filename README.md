# Todo App

A beautiful, modern todo application built with React, TypeScript, and Tailwind CSS. Features include task management, filtering, tags, priority levels, and dark/light theme support.

## ✨ Features

### 🎯 Core Features
- **Task Management**: Create, edit, delete, and mark tasks as complete
- **Priority System**: High, Medium, Low priority levels with color coding
- **Status Tracking**: Pending, In Progress, Completed, Cancelled
- **Due Dates**: Set and track task deadlines with overdue indicators
- **Tags System**: Organize tasks with custom tags and colors

### 🔍 Filtering & Search
- **Priority Filters**: Filter by High, Medium, Low, or All priorities
- **Status Filters**: Filter by task status
- **Tag Filters**: Filter by selected tags
- **Search**: Global search across task titles and descriptions
- **My Tasks**: Focus on personal tasks (ready for team features)

### 🎨 Design & UX
- **Responsive Design**: Mobile-first approach with tablet and desktop support
- **Dark/Light Theme**: Beautiful themes with smooth transitions
- **Modern UI**: Clean, intuitive interface with hover effects
- **Color Coding**: Visual priority and status indicators
- **Smooth Animations**: CSS transitions and micro-interactions

### 📱 Mobile Responsive
- **Mobile Menu**: Collapsible sidebar for mobile devices
- **Touch Friendly**: Optimized for touch interactions
- **Responsive Layout**: Adapts to all screen sizes

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful icons

### Styling
- **Tailwind CSS** - Utility classes for rapid UI development
- **Custom Components** - Reusable button, card, and input components
- **Dark Mode** - CSS classes with localStorage persistence
- **Responsive Design** - Mobile-first approach

### State Management
- **React Hooks** - useState, useEffect for local state
- **Context API** - Ready for global state management

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
todo-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Layout/        # Layout components
│   │   ├── Tasks/         # Task-related components
│   │   └── UI/            # Reusable UI components
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main App component
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🎨 Design System

### Color Palette

#### Light Mode
- **Primary**: Blue (#3B82F6)
- **Background**: White (#FFFFFF)
- **Surface**: Light Gray (#F9FAFB)
- **Text**: Dark Gray (#1F2937)
- **Borders**: Light Gray (#E5E7EB)

#### Dark Mode
- **Primary**: Blue (#60A5FA)
- **Background**: Dark Gray (#111827)
- **Surface**: Medium Gray (#1F2937)
- **Text**: Light Gray (#F9FAFB)
- **Borders**: Dark Gray (#374151)

### Priority Colors
- **High**: Red (#EF4444)
- **Medium**: Yellow (#F59E0B)
- **Low**: Green (#10B981)

### Status Colors
- **Pending**: Gray (#6B7280)
- **In Progress**: Blue (#3B82F6)
- **Completed**: Green (#10B981)
- **Cancelled**: Red (#EF4444)

## 🔮 Future Features

### Planned Enhancements
- **User Authentication**: Login/register system
- **Database Integration**: MySQL with Prisma ORM
- **Backend API**: Node.js/Express server
- **Team Collaboration**: Multi-user support
- **Real-time Updates**: WebSocket integration
- **File Attachments**: Upload files to tasks
- **Task Templates**: Quick task creation
- **Export/Import**: CSV/JSON data export
- **Mobile App**: React Native version

### Multi-User Features
- **User Management**: User profiles and settings
- **Team Workspaces**: Shared project spaces
- **Task Assignment**: Assign tasks to team members
- **Activity Feed**: Team activity tracking
- **Notifications**: Real-time task updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the amazing utility-first CSS framework
- **Lucide React** for the beautiful icon set
- **Vite** for the fast build tool
- **React Team** for the incredible framework

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
