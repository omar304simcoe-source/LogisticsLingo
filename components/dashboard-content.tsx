"use client"

import { useState } from "react"
import { LoadDetailsForm, type LoadDetails } from "./load-details-form"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Copy, CheckCircle2, Save } from "lucide-react"
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
    <div className="bg-transparent">
      {/* Plan Status Indicator */}
      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="text-sm">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Current Plan:</span>{" "}
          <span className="ml-2 font-medium">
            {profile?.subscription_tier === "free" && "Free (3 messages remaining)"}
            {profile?.subscription_tier === "pro" && "Pro Plan"}
            {profile?.subscription_tier === "agency" && "Agency Plan"}
          </span>
        </div>
        {profile?.subscription_tier === "free" && (
          <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
            <a href="/pricing">Upgrade Account</a>
          </Button>
        )}
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 h-12">
          <TabsTrigger value="generator" className="text-sm font-medium">
            Message Generator
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-sm font-medium">
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm font-medium">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Load Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <LoadDetailsForm onSubmit={handleGenerateMessage} isLoading={isGenerating} />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Generated Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedMessage ? (
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-md border min-h-[400px] overflow-auto whitespace-pre-wrap font-mono text-sm text-slate-800">
                        {generatedMessage}
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleCopy} className="flex-1">
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
                            className="flex-1"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Template
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center min-h-[400px] text-muted-foreground border-2 border-dashed rounded-md">
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

      {/* Save Template Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          <Card className="max-w-md w-full shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Save as Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-slate-700">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Afternoon Status Update"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSaveTemplate} disabled={isSaving} className="flex-1 bg-blue-600">
                  {isSaving ? "Saving..." : "Save Template"}
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