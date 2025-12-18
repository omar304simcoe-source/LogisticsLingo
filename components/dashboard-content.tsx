"use client"

import { useState } from "react"
import { LoadDetailsForm, type LoadDetails } from "./load-details-form"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Truck, LogOut, Copy, CheckCircle2, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SavedTemplates } from "./saved-templates"
import { MessageHistory } from "./message-history"

interface DashboardContentProps {
  user: any
  profile: any
}

export function DashboardContent({ user, profile }: DashboardContentProps) {
  const [generatedMessage, setGeneratedMessage] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentLoadDetails, setCurrentLoadDetails] = useState<LoadDetails | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleGenerateMessage = async (details: LoadDetails) => {
    setCurrentLoadDetails(details)
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      })

      const data = await response.json()
      if (data.error) {
        alert(data.error)
      } else {
        setGeneratedMessage(data.message)
      }
    } catch (error) {
      alert("Failed to generate message")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !generatedMessage || !currentLoadDetails) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/save-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateName,
          messageType: currentLoadDetails.messageType,
          templateContent: generatedMessage,
        }),
      })

      const data = await response.json()
      if (data.error) {
        alert(data.error)
      } else {
        alert("Template saved successfully!")
        setShowSaveDialog(false)
        setTemplateName("")
      }
    } catch (error) {
      alert("Failed to save template")
    } finally {
      setIsSaving(false)
    }
  }

  const canSaveTemplates = profile?.subscription_tier === "pro" || profile?.subscription_tier === "agency"

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-primary">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">LogisticsLingo</h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-sm">
                <span className="font-semibold">Plan:</span>{" "}
                {profile?.subscription_tier === "free" && "Free (3 messages)"}
                {profile?.subscription_tier === "pro" && "Pro"}
                {profile?.subscription_tier === "agency" && "Agency"}
              </div>
              {profile?.subscription_tier === "free" && (
                <Button size="sm" asChild>
                  <a href="/pricing">Upgrade</a>
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="generator" className="text-xs sm:text-sm">
              Message Generator
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-xs sm:text-sm">
              Templates
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Load Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <LoadDetailsForm onSubmit={handleGenerateMessage} isLoading={isGenerating} />
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="h-full">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Generated Message</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    {generatedMessage ? (
                      <div className="space-y-4">
                        <div className="bg-secondary p-4 rounded border min-h-[300px] sm:min-h-[400px] overflow-auto whitespace-pre-wrap font-mono text-sm">
                          {generatedMessage}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button onClick={handleCopy} className="flex-1 text-sm sm:text-base">
                            {copied ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy to Clipboard
                              </>
                            )}
                          </Button>
                          {canSaveTemplates && (
                            <Button
                              onClick={() => setShowSaveDialog(true)}
                              variant="outline"
                              className="flex-1 text-sm sm:text-base"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Template
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] text-muted-foreground">
                        Your generated message will appear here
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <SavedTemplates canSave={canSaveTemplates} />
          </TabsContent>

          <TabsContent value="history">
            <MessageHistory />
          </TabsContent>
        </Tabs>
      </main>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Save Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Standard Check-in"
                  className="w-full px-3 py-2 border border-primary rounded"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleSaveTemplate} disabled={isSaving} className="flex-1">
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button onClick={() => setShowSaveDialog(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
