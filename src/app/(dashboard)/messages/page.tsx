"use client"

import { useState } from "react"
import { MessageCircle, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ConversationList, type Conversation } from "@/components/messages/conversation-list"

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    participantId: "user1",
    participant: {
      id: "user1",
      firstName: "Maria",
      lastName: "Santos",
      imageUrl: null,
      username: "msantos",
    },
    lastMessage: {
      id: "msg1",
      content: "See you at training tomorrow!",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isRead: false,
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    participantId: "user2",
    participant: {
      id: "user2",
      firstName: "James",
      lastName: "Wilson",
      imageUrl: null,
      username: "jwilson",
    },
    lastMessage: {
      id: "msg2",
      content: "Thanks for the tips on breath holding!",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    participantId: "user3",
    participant: {
      id: "user3",
      firstName: "Sarah",
      lastName: "Lee",
      imageUrl: null,
      username: "slee",
    },
    lastMessage: {
      id: "msg3",
      content: "Are you going to the competition next month?",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation] = useState<Conversation | null>(null)
  const [isLoading] = useState(false)

  const filteredConversations = mockConversations.filter((conv) => {
    const name = [conv.participant.firstName, conv.participant.lastName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
    return name.includes(searchQuery.toLowerCase())
  })

  const unreadCount = mockConversations.reduce((sum, c) => sum + c.unreadCount, 0)

  const handleSelectConversation = (conversation: Conversation) => {
    // Navigate to conversation
    window.location.href = `/messages/${conversation.id}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Messages</h1>
          <p className="mt-1 text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
              : "Connect with other players"}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              <ConversationList
                conversations={filteredConversations}
                selectedId={selectedConversation?.id}
                onSelect={handleSelectConversation}
                isLoading={isLoading}
                emptyMessage="No conversations yet. Start a new message!"
              />
            </CardContent>
          </Card>
        </div>

        {/* Message View Placeholder */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex items-center justify-center">
            <CardContent className="text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Select a Conversation</h3>
              <p className="mt-2 text-muted-foreground">
                Choose a conversation from the list to view messages.
              </p>
              <Button className="mt-6">
                <Plus className="mr-2 h-4 w-4" />
                Start New Conversation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
