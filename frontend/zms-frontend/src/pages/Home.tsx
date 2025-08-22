import { useAuth } from '../contexts/AuthContext'

export const Home = () => {
  const { user, signOut } = useAuth()

  const stats = [
    { label: 'Total Animals', value: '127', icon: '🦁' },
    { label: 'Active Enclosures', value: '15', icon: '🏠' },
    { label: 'Staff Members', value: '24', icon: '👥' },
    { label: 'Daily Reports', value: '8', icon: '📊' },
  ]

  const quickActions = [
    { 
      title: 'Animal Onboarding', 
      description: 'Register new animals with details, enclosure, and diet plans',
      icon: '➕',
      action: () => console.log('Navigate to animal onboarding')
    },
    { 
      title: 'Daily Care Records', 
      description: 'Submit daily observations and feeding records',
      icon: '📝',
      action: () => console.log('Navigate to care records')
    },
    { 
      title: 'Medical Records', 
      description: 'View and update animal medical history',
      icon: '🏥',
      action: () => console.log('Navigate to medical records')
    },
    { 
      title: 'Analytics Dashboard', 
      description: 'View insights and reports across the zoo',
      icon: '📈',
      action: () => console.log('Navigate to analytics')
    },
  ]

  const recentActivities = [
    { activity: 'Leo (Lion) - Daily observation submitted', time: '2 hours ago', type: 'observation' },
    { activity: 'New animal: Bella (Elephant) registered', time: '4 hours ago', type: 'registration' },
    { activity: 'Medical checkup completed for Max (Tiger)', time: '6 hours ago', type: 'medical' },
    { activity: 'Diet plan updated for Penguins enclosure', time: '1 day ago', type: 'diet' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening at the zoo today
          </p>
        </div>
        <button
          onClick={signOut}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow cursor-pointer hover:border-blue-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{action.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'observation' ? 'bg-blue-500' :
                      activity.type === 'registration' ? 'bg-green-500' :
                      activity.type === 'medical' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.activity}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t px-4 py-3">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all activities →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alert Section */}
      <div className="mt-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-amber-600 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Daily Checklist Reminder
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Don't forget to complete today's animal welfare checks and feeding schedules.
              </p>
            </div>
            <div className="ml-auto">
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm transition-colors">
                View Checklist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}