'use client';

import { useState } from 'react';
import { Bell, BellOff, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { formatReminderTime, REMINDER_ICONS, REMINDER_LABELS } from '@/lib/notifications';
import type { Reminder } from '@/lib/notifications';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

interface ReminderItemProps {
  reminder: Reminder;
  onToggle: (enabled: boolean) => void;
  onTimeChange: (hour: number, minute: number) => void;
  onDelete?: () => void;
  isCustom?: boolean;
}

function ReminderItem({ reminder, onToggle, onTimeChange, onDelete, isCustom }: ReminderItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTime, setTempTime] = useState(
    `${reminder.time.hour.toString().padStart(2, '0')}:${reminder.time.minute.toString().padStart(2, '0')}`
  );

  const handleTimeSubmit = () => {
    const [hours, minutes] = tempTime.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      onTimeChange(hours, minutes);
    }
    setIsEditing(false);
  };

  const icon = REMINDER_ICONS[reminder.type] || REMINDER_ICONS.custom;
  const label = isCustom ? reminder.title : REMINDER_LABELS[reminder.type];

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-xl" role="img" aria-label={reminder.type}>
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{label}</p>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="time"
                value={tempTime}
                onChange={(e) => setTempTime(e.target.value)}
                className="w-32 h-8 text-sm"
              />
              <Button size="sm" variant="outline" onClick={handleTimeSubmit}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Clock className="w-3 h-3" />
              {formatReminderTime(reminder.time.hour, reminder.time.minute)}
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isCustom && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
        <Switch
          checked={reminder.enabled}
          onCheckedChange={onToggle}
        />
      </div>
    </div>
  );
}

interface AddReminderDialogProps {
  onAdd: (reminder: Omit<Reminder, 'id' | 'type'>) => void;
}

function AddReminderDialog({ onAdd }: AddReminderDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [time, setTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const [hours, minutes] = time.split(':').map(Number);
    onAdd({
      enabled: true,
      time: { hour: hours, minute: minutes },
      title: title.trim(),
      body: body.trim() || `Time for ${title.trim()}!`,
      days: selectedDays,
    });

    // Reset form
    setTitle('');
    setBody('');
    setTime('09:00');
    setSelectedDays([]);
    setOpen(false);
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Reminder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Reminder</DialogTitle>
          <DialogDescription>
            Create a personalized reminder for your wellness routine.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Take vitamins"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Message (optional)</Label>
            <Input
              id="body"
              placeholder="e.g., Don't forget your daily vitamins!"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Days (leave empty for daily)</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant={selectedDays.includes(day.value) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Add Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ReminderSettings() {
  const {
    settings,
    permissionStatus,
    isLoading,
    error,
    requestPermission,
    toggleEnabled,
    updateReminder,
    addCustomReminder,
    removeReminder,
  } = useNotifications();

  // Separate default reminders from custom ones
  const defaultReminders = settings.reminders.filter((r) => r.type !== 'custom');
  const customReminders = settings.reminders.filter((r) => r.type === 'custom');

  // Group default reminders by category
  const mealReminders = defaultReminders.filter((r) =>
    ['breakfast', 'lunch', 'dinner', 'snack'].includes(r.type)
  );
  const wellnessReminders = defaultReminders.filter((r) =>
    ['meditation', 'journal', 'water'].includes(r.type)
  );

  const handleToggleReminder = async (reminderId: string, enabled: boolean) => {
    await updateReminder(reminderId, { enabled });
  };

  const handleTimeChange = async (reminderId: string, hour: number, minute: number) => {
    await updateReminder(reminderId, { time: { hour, minute } });
  };

  const handleRemoveReminder = async (reminderId: string) => {
    await removeReminder(reminderId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {settings.enabled ? (
            <Bell className="w-5 h-5 text-violet-500" />
          ) : (
            <BellOff className="w-5 h-5 text-muted-foreground" />
          )}
          Reminders
        </CardTitle>
        <CardDescription>
          Get notified for meals, meditation, and journaling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission warning */}
        {permissionStatus === 'denied' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Notifications are blocked. Please enable them in your device settings.
            </AlertDescription>
          </Alert>
        )}

        {permissionStatus === 'unsupported' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Notifications are not supported on this device/browser.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Global toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Enable Reminders</Label>
            <p className="text-sm text-muted-foreground">
              {settings.enabled ? 'Reminders are active' : 'All reminders are paused'}
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={toggleEnabled}
            disabled={isLoading || permissionStatus === 'denied' || permissionStatus === 'unsupported'}
          />
        </div>

        {/* Request permission button */}
        {permissionStatus === 'prompt' && !settings.enabled && (
          <Button
            variant="outline"
            className="w-full"
            onClick={requestPermission}
            disabled={isLoading}
          >
            <Bell className="w-4 h-4 mr-2" />
            Enable Notifications
          </Button>
        )}

        {settings.enabled && (
          <>
            <Separator />

            {/* Meal Reminders */}
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Meal Reminders</h4>
              <div className="divide-y">
                {mealReminders.map((reminder) => (
                  <ReminderItem
                    key={reminder.id}
                    reminder={reminder}
                    onToggle={(enabled) => handleToggleReminder(reminder.id, enabled)}
                    onTimeChange={(hour, minute) => handleTimeChange(reminder.id, hour, minute)}
                  />
                ))}
              </div>
            </div>

            <Separator />

            {/* Wellness Reminders */}
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Wellness Reminders</h4>
              <div className="divide-y">
                {wellnessReminders.map((reminder) => (
                  <ReminderItem
                    key={reminder.id}
                    reminder={reminder}
                    onToggle={(enabled) => handleToggleReminder(reminder.id, enabled)}
                    onTimeChange={(hour, minute) => handleTimeChange(reminder.id, hour, minute)}
                  />
                ))}
              </div>
            </div>

            {/* Custom Reminders */}
            {customReminders.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Custom Reminders</h4>
                  <div className="divide-y">
                    {customReminders.map((reminder) => (
                      <ReminderItem
                        key={reminder.id}
                        reminder={reminder}
                        onToggle={(enabled) => handleToggleReminder(reminder.id, enabled)}
                        onTimeChange={(hour, minute) => handleTimeChange(reminder.id, hour, minute)}
                        onDelete={() => handleRemoveReminder(reminder.id)}
                        isCustom
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Add custom reminder */}
            <AddReminderDialog onAdd={addCustomReminder} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
