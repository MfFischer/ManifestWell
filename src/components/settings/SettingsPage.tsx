'use client'

import { useState } from 'react'
import {
  Settings, Moon, Sun, Download, Trash2, ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { PinSetup, useAppLock } from '@/components/app-lock'
import { ReminderSettings } from '@/components/settings/ReminderSettings'
import { exportAllDataAsJson } from '@/lib/data/export'
import { clearAllUserData } from '@/lib/data/import'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

export function SettingsPage() {
  const { config, refreshConfig } = useAppLock()
  const { theme, setTheme: setNextTheme } = useTheme()
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const result = await exportAllDataAsJson()
      if (result.success) {
        toast.success(`Data exported to ${result.filename}`)
      } else {
        toast.error(result.error || 'Export failed')
      }
    } catch {
      toast.error('Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAllData = async () => {
    setIsDeleting(true)
    try {
      await clearAllUserData()
      toast.success('All data deleted')
    } catch {
      toast.error('Failed to delete data')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-violet-500" />
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your app preferences</p>
        </div>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setNextTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      {config && <PinSetup config={config} onConfigChange={refreshConfig} />}

      {/* Reminders */}
      <ReminderSettings />

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Management</CardTitle>
          <CardDescription>Export, import, or delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-3" />
            {isExporting ? 'Exporting...' : 'Export All Data'}
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-3" />
                Delete All Data
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your meals, activities, journal entries, 
                  and other data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAllData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Everything'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong>ManifestWell</strong> v1.0.0</p>
          <p>Your personal wellness companion</p>
          <p className="text-xs mt-4">
            All data is stored locally on your device. No cloud sync.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

