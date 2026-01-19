"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, MoreVertical, Phone, Video, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageThread } from "@/components/messages/message-thread"
import type { Message } from "@/components/messages/message-bubble"
import { MessageInput } from "@/components/messages/message-input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MessagePageProps {
  params: Promise<{ conversationId: string }>
}

// Mock data
const mockParticipant = {
  id: "user1",
  firstName: "Maria",
  lastName: "Santos",
  imageUrl: null,
  username: "msantos",
  isOnline: true,
}

const currentUser = {
  id: "me",
  firstName: "Alex",
  lastName: "Chen",
  imageUrl: null,
}

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hey! Are you coming to training tomorrow?",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    isRead: true,
    sender: { id: "user1", firstName: "Maria", lastName: "Santos", imageUrl: null },
  },
  {
    id: "2",
    content: "Yes, I'll be there! What time does it start?",
    createdAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    isRead: true,
    sender: currentUser,
  },
  {
    id: "3",
    content: "7pm as usual. We're doing scrimmage games after warm-up.",
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    isRead: true,
    sender: { id: "user1", firstName: "Maria", lastName: "Santos", imageUrl: null },
  },
  {
    id: "4",
    content: "Perfect! I've been practicing my stick handling. Ready to show off!",
    createdAt: new Date(Date.now() - 0.5 * 3600000).toISOString(),
    isRead: true,
    sender: currentUser,
  },
  {
    id: "5",
    content: "See you at training tomorrow!",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    sender: { id: "user1", firstName: "Maria", lastName: "Santos", imageUrl: null },
  },
]

export default function ConversationPage(_props: MessagePageProps) {
  const [messages, setMessages] = useState(mockMessages)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    setIsSending(true)
    try {
      // In production, send via API
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        createdAt: new Date().toISOString(),
        isRead: false,
        sender: currentUser,
      }
      setMessages([...messages, newMessage])
    } finally {
      setIsSending(false)
    }
  }

  const participant = mockParticipant
  const displayName = [participant.firstName, participant.lastName]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <Card className="shrink-0 rounded-b-none">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/messages"
                className="rounded-lg p-2 hover:bg-accent lg:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Avatar className="h-10 w-10">
                <AvatarImage src={participant.imageUrl || undefined} />
                <AvatarFallback>
                  {participant.firstName?.charAt(0)}
                  {participant.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{displayName}</h2>
                <p className="text-xs text-muted-foreground">
                  {participant.isOnline ? (
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Online
                    </span>
                  ) : (
                    "Offline"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Video className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Info className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Block User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 overflow-hidden rounded-none border-t-0">
        <CardContent className="flex h-full flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4">
            <MessageThread
              messages={messages}
              currentUserId={currentUser.id}
            />
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t bg-background p-4">
            <MessageInput
              onSend={handleSendMessage}
              disabled={isSending}
              placeholder="Type a message..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
