"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Trash2, Copy, Lock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Template {
  id: string
  template_name: string
  message_type: string
  template_content: string
  created_at: string
}

interface SavedTemplatesProps {
  canSave: boolean
}

export function SavedTemplates({ canSave }: SavedTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (canSave) {
      fetchTemplates()
    } else {
      setIsLoading(false)
    }
  }, [canSave])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("saved_templates")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setTemplates(data)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return

    try {
      const { error } = await supabase.from("saved_templates").delete().eq("id", id)

      if (!error) {
        setTemplates(templates.filter((t) => t.id !== id))
      }
    } catch (error) {
      console.error("Error deleting template:", error)
    }
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!canSave) {
    return (
      <Card className="border-black">
        <CardContent className="py-12 text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-4">Upgrade to Pro or Agency to save custom templates</p>
          <Button asChild className="bg-black text-white hover:bg-gray-800">
            <a href="/pricing">Upgrade Now</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-black">
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">Loading templates...</p>
        </CardContent>
      </Card>
    )
  }

  if (templates.length === 0) {
    return (
      <Card className="border-black">
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">No saved templates yet. Generate a message and save it as a template!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="border-black">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{template.template_name}</span>
              <span className="text-xs font-normal text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {template.message_type}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
              {template.template_content}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleCopy(template.template_content, template.id)}
                className="flex-1 bg-black text-white hover:bg-gray-800"
                size="sm"
              >
                {copiedId === template.id ? (
                  "Copied!"
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </>
                )}
              </Button>
              <Button onClick={() => handleDelete(template.id)} variant="outline" className="border-black" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
