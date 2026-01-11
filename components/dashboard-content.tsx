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
  // stats removed from here
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
    } catch {
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
        setShowSaveDialog(false)
        setTemplateName("")
      }
    } catch {
      alert("Failed to save template")
    } finally {
      setIsSaving(false)
    }
  }

  const canSaveTemplates =
    profile?.subscription_tier === "pro" || profile?.subscription_tier === "agency"

  return (
    <div className="bg-transparent space-y-6">

      {/* Plan Status */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="text-sm">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
            Current Plan:
          </span>{" "}
          <span className="ml-2 font-medium">
            {profile?.subscription_tier === "free" && "Free (3 messages)"}
            {profile?.subscription_tier === "pro" && "Pro Plan"}
            {profile?.subscription_tier === "agency" && "Agency Plan"}
          </span>
        </div>

        {profile?.subscription_tier === "free" && (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
            <a href="/pricing">Upgrade</a>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 h-12">
          <TabsTrigger value="generator">Message Generator</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Load Details</CardTitle>
              </CardHeader>
              <CardContent>
                <LoadDetailsForm
                  onSubmit={handleGenerateMessage}
                  isLoading={isGenerating}
                />
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Generated Message</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedMessage ? (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-md border min-h-[400px] overflow-auto whitespace-pre-wrap font-mono text-sm">
                      {generatedMessage}
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleCopy} className="flex-1">
                        {copied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>

                      {canSaveTemplates && (
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setShowSaveDialog(true)}
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