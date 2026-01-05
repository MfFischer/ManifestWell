'use client';

/**
 * Health Dashboard Component
 * Displays health data from Apple Health / Google Fit
 */

import { useState } from 'react';
import { 
  Footprints, 
  Heart, 
  Flame, 
  Moon, 
  Brain,
  Watch,
  Smartphone,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useHealth } from '@/lib/hooks/useHealth';

interface HealthDashboardProps {
  /** Step goal for the day */
  stepGoal?: number;
  /** Calorie goal for the day */
  calorieGoal?: number;
  /** Show connect prompt if not authorized */
  showConnectPrompt?: boolean;
}

export function HealthDashboard({ 
  stepGoal = 10000, 
  calorieGoal = 500,
  showConnectPrompt = true 
}: HealthDashboardProps) {
  const { 
    platform,
    isAvailable, 
    isAuthorized, 
    isLoading, 
    error,
    steps,
    activeCalories,
    avgHeartRate,
    todaySummary,
    requestAuth,
    refresh 
  } = useHealth();

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    await requestAuth();
    setIsConnecting(false);
  };

  const stepProgress = Math.min((steps / stepGoal) * 100, 100);
  const calorieProgress = Math.min((activeCalories / calorieGoal) * 100, 100);

  const platformName = platform === 'ios' ? 'Apple Health' : 
                       platform === 'android' ? 'Health Connect' : 
                       'Health App';
  
  const PlatformIcon = platform === 'ios' ? Watch : Smartphone;

  // Not available on web
  if (platform === 'web') {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Health Integration</p>
            <p className="text-sm">Available on iOS and Android apps</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show connect prompt if not authorized
  if (!isAuthorized && showConnectPrompt) {
    return (
      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlatformIcon className="w-5 h-5 text-purple-600" />
            Connect {platformName}
          </CardTitle>
          <CardDescription>
            Sync your steps, heart rate, and workouts automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Auto-log walking and running activities
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Track meditation in {platformName}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                See heart rate during sessions
              </li>
            </ul>
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting || !isAvailable}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Connect {platformName}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            {!isAvailable && (
              <p className="text-xs text-muted-foreground text-center">
                {platformName} is not available on this device
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show health data
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <PlatformIcon className="w-5 h-5 text-purple-600" />
            Today's Health
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={refresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        {/* Steps */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Steps</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {steps.toLocaleString()} / {stepGoal.toLocaleString()}
            </span>
          </div>
          <Progress value={stepProgress} className="h-2" />
        </div>

        {/* Active Calories */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Active Calories</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {activeCalories} / {calorieGoal} kcal
            </span>
          </div>
          <Progress value={calorieProgress} className="h-2" />
        </div>

        {/* Heart Rate */}
        {avgHeartRate && (
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Avg Heart Rate</span>
            </div>
            <span className="text-lg font-bold text-red-600">{avgHeartRate} BPM</span>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Moon className="w-4 h-4 mx-auto mb-1 text-indigo-500" />
            <p className="text-xs text-muted-foreground">Sleep</p>
            <p className="font-semibold">{todaySummary?.sleepMinutes ? `${Math.round(todaySummary.sleepMinutes / 60)}h` : '--'}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Brain className="w-4 h-4 mx-auto mb-1 text-purple-500" />
            <p className="text-xs text-muted-foreground">Mindful</p>
            <p className="font-semibold">{todaySummary?.mindfulMinutes || 0} min</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

