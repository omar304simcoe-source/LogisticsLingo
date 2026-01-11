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

interface UsageData {
  subscription_tier: string
  messages_today: number
}

// Removed the globalTotal prop requirement
export function MessageHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [usage, setUsage] = useState<UsageData | null>(null)

  const supabase = createClient()
  const PAGE_SIZE = 10

  useEffect(() => {
    fetchUsage()
  }, [])

  useEffect(() => {
    fetchHistory(page)
  }, [page])

  async function fetchUsage() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_tier, messages_today")
        .eq("id", user.id)
        .single()

      if (!error && data) {
        setUsage(data)
      }
    } catch (error) {
      console.error("Error fetching usage:", error)
    }
  }

  async function fetchHistory(pageNum: number) {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const from = (pageNum - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, error, count } = await supabase
        .from("message_history")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (!error && data) {
        setHistory(data)
        setTotalPages(count ? Math.ceil(count / PAGE_SIZE) : 1)
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

  return (
    <div>
      {/* Reverted Usage counter (no global stats) */}
      {usage && (
        <Card className="mb-6 border-black bg-white shadow-sm">
          <CardContent className="py-4">
            <p className="text-sm">
              Plan: <span className="font-bold uppercase tracking-wider">{usage.subscription_tier}</span>
            </p>
            {usage.subscription_tier === "free" ? (
              <p className="text-xs text-gray-600">
                Messages used today: {usage.messages_today} / 3
              </p>
            ) : (
              <p className="text-xs text-green-600 font-medium text-[10px] uppercase">Unlimited messages 🚀</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* History List */}
      {isLoading ? (
        <Card className="border-black">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Loading history...</p>
          </CardContent>
        </Card>
      ) : history.length === 0 ? (
        <Card className="border-black">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 text-sm">
              No message history yet. Start generating messages to see them here!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="border-black">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">{item.message_type}</CardTitle>
                    <span className="text-xs text-gray-500 uppercase">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
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
                        <Copy className="h-4 w-4 mr-2" /> Copy Message
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              size="sm"
              variant="outline"
              className="border-black"
            >
              Prev
            </Button>
            <span className="text-xs font-bold uppercase">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              size="sm"
              variant="outline"
              className="border-black"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}