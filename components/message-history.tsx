"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Copy } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface HistoryItem {
  id: string
  message_type: string
  generated_message: string
  created_at: string
}

export function MessageHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("message_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (!error && data) {
        setHistory(data)
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return (
      <Card className="border-black">
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">Loading history...</p>
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card className="border-black">
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">No message history yet. Start generating messages to see them here!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <Card key={item.id} className="border-black">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{item.message_type}</CardTitle>
              <span className="text-xs text-gray-600">{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
              {item.generated_message}
            </div>
            <Button
              onClick={() => handleCopy(item.generated_message, item.id)}
              className="w-full bg-black text-white hover:bg-gray-800"
              size="sm"
            >
              {copiedId === item.id ? (
                "Copied!"
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
