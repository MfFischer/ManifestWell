# ManifestWell - Mind-Body Wellness Web Application

A comprehensive wellness application combining nutrition tracking, fitness logging, meditation sessions, and manifestation techniques for holistic health and well-being.

## 🌟 Features

### Dashboard
- Personalized greeting with daily wellness overview
- Quick stats tracking (calories, activities, meditation time, streaks)
- Today's schedule with activity timeline
- Goal progress visualization
- Quick action buttons for common tasks

### Nutrition Tracking
- Log meals (breakfast, lunch, dinner, snacks)
- Track calories, protein, carbs, and fat
- Daily summary with macro breakdown
- Edit and delete meal entries
- Visual progress toward daily calorie goals

### Fitness Tracking
- Log workouts with multiple activity types
- Track duration, calories burned, and intensity
- Daily activity statistics
- Support for cardio, strength, yoga, walking, running, cycling, swimming
- Edit and delete workout entries

### Meditation & Mindfulness
- Guided meditation sessions with video integration
- Multiple meditation types: Breathing, Mindfulness, Visualization, Sleep, Stress Relief
- YouTube video integration for guided sessions
- Session completion tracking with ratings
- Personal notes for each session

### Manifestation Techniques
- **Silva Method**: Alpha state visualization practices
- **Quantum Jumping**: Alternate reality visualization
- **Visualization**: Future self and vision board meditations
- **Affirmations**: Power affirmation practices
- **Gratitude**: Gratitude manifestation exercises
- Step-by-step instructions for each technique
- YouTube video integration for guided practices
- Intention setting and feeling tracking

### Wellness Journal
- Rich journal entry creation
- Mood tracking (happy, grateful, calm, stressed, anxious, excited, peaceful)
- Tag-based organization
- Search and filter functionality
- Private/public entry options
- Date-based sorting

### Goals
- Create personalized wellness goals
- Track progress across multiple categories
- Support for fitness, nutrition, meditation, manifestation goals
- Target values and current progress tracking
- Active/completed/paused goal status
- Deadline management
- Progress visualization with progress bars

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Database**: Prisma ORM with SQLite
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## 📁 Project Structure

```
manifestwell/
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   │   ├── activities/    # Fitness/activity tracking
│   │   │   ├── meals/        # Nutrition tracking
│   │   │   ├── meditations/  # Meditation sessions
│   │   │   ├── manifestations/# Manifestation sessions
│   │   │   ├── journal/      # Journal entries
│   │   │   └── goals/        # Goal management
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx          # Main dashboard page
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── nutrition-tracker.tsx
│   │   ├── fitness-tracker.tsx
│   │   ├── meditation-module.tsx
│   │   ├── manifestation-module.tsx
│   │   ├── journal-module.tsx
│   │   └── goals-module.tsx
│   └── lib/
│       ├── db.ts             # Prisma client
│       └── utils.ts         # Utility functions
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static assets
```

## 🗄️ Database Schema

### Users
- Profile information (name, email, avatar, bio)

### Meals
- Meal logging with nutrition tracking
- Type (breakfast, lunch, dinner, snack)
- Calories and macro breakdown

### Activities
- Workout tracking
- Type (cardio, strength, yoga, etc.)
- Duration, calories burned, intensity

### Meditation Sessions
- Session tracking
- Type, duration, video URL
- Completion status and ratings

### Manifestation Sessions
- Technique tracking (Silva Method, Quantum Jumping, etc.)
- Intention setting
- Feeling/emotion tracking

### Journal Entries
- Rich text entries
- Mood and tag support
- Privacy settings

### Goals
- Goal creation and tracking
- Category classification
- Target and current values
- Status management (active, completed, paused)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Bun (recommended) or npm/yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   bun run db:push
   bun run db:generate
   ```

5. Run the development server:
   ```bash
   bun run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Adaptive navigation (sidebar on desktop, drawer on mobile)
- Touch-friendly interface (44px minimum touch targets)
- Responsive grid layouts
- Optimized for tablets and smartphones

## 🎨 Design System

- **Color Palette**: Purple and orange gradient theme
- **Typography**: Geist Sans and Geist Mono fonts
- **Components**: shadcn/ui for consistent design
- **Dark Mode**: Support for light and dark themes
- **Accessibility**: WCAG AA compliant with proper ARIA labels

## 🔐 Privacy & Security

- All journal entries default to private
- Local SQLite database (no cloud storage)
- GDPR-compliant data handling
- HIPAA-ready for health data

## 📹 Video Integration

The application integrates with YouTube for:
- Guided meditation sessions
- Manifestation technique tutorials
- Breathing exercises
- Sleep meditations

When videos are not available, users are directed to the journal for reflection.

## 🎯 Usage Tips

### For Beginners
1. Start with the meditation module for basic breathing exercises
2. Use the journal to track your mood and progress
3. Set simple, achievable goals

### For Advanced Users
1. Practice Silva Method and Quantum Jumping techniques
2. Combine multiple wellness activities daily
3. Use goal tracking to maintain long-term motivation

### Best Practices
- Log meals consistently for accurate tracking
- Complete daily journaling to identify patterns
- Practice manifestation techniques with clear intentions
- Review and update goals regularly

## 🔧 Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run db:push` - Push database schema changes
- `bun run db:generate` - Generate Prisma client

## 📝 Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Cloud database integration
- [ ] Social features and community sharing
- [ ] AI-powered wellness recommendations
- [ ] Wearable device integration (biofeedback)
- [ ] Push notifications for reminders
- [ ] Advanced analytics and insights
- [ ] Export functionality (PDF, CSV)
- [ ] Mobile app (Flutter version)

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding user authentication (NextAuth.js)
- Implementing proper error handling
- Adding comprehensive testing
- Setting up CI/CD pipeline
- Adding monitoring and analytics

## 📄 License

This project is for demonstration purposes.

## 🙏 Acknowledgments

- Inspired by MyFitnessPal and Calm
- Built with Next.js, Tailwind CSS, and shadcn/ui
- Video content from YouTube

---

**ManifestWell** - Your journey to holistic wellness starts here! 🌟✨
