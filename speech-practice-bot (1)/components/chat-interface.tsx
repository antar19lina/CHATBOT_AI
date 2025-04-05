"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Send, Volume2, StopCircle } from "lucide-react"
import BotAvatar from "./bot-avatar"
import UserAvatar from "./user-avatar"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

// Knowledge base for common topics
const knowledgeBase = {
  greeting: [
    "Hello! How can I assist you today?",
    "Hi there! I'm your AI assistant. What can I help you with?",
    "Welcome! Feel free to ask me any questions you have.",
  ],
  introduction:
    "I'm an AI assistant designed to help answer your questions and provide information on a wide range of topics. I can explain concepts, provide definitions, assist with problem-solving, and engage in conversations. Feel free to ask me anything!",
  capabilities:
    "I can help with answering questions, explaining concepts, providing information on various topics, assisting with language learning, and engaging in conversation. I can also read my responses aloud to help with pronunciation and listening comprehension.",
  limitations:
    "While I aim to be helpful, I may not always have the most up-to-date information. I also can't access the internet or external databases in real-time. For complex or specialized topics, consulting with human experts is recommended.",
  language: [
    "Language learning involves practicing speaking, listening, reading, and writing. Regular practice and immersion are key to improving your skills.",
    "When learning a new language, focus on common vocabulary and phrases first. Then gradually build up to more complex grammar and expressions.",
    "Reading books, watching movies, and listening to music in your target language can significantly improve your comprehension and vocabulary.",
  ],
  education: [
    "Effective studying often involves active recall, spaced repetition, and teaching concepts to others.",
    "Different learning styles include visual, auditory, reading/writing, and kinesthetic. Understanding your preferred style can help optimize your learning approach.",
    "Critical thinking skills are essential for academic success and involve analyzing information, questioning assumptions, and forming reasoned judgments.",
  ],
  technology: [
    "Artificial intelligence refers to computer systems designed to perform tasks that typically require human intelligence, such as visual perception, speech recognition, and decision-making.",
    "Machine learning is a subset of AI that involves training algorithms to learn patterns from data and make predictions or decisions without being explicitly programmed.",
    "Natural language processing (NLP) is a field of AI focused on enabling computers to understand, interpret, and generate human language.",
  ],
}

// Function to generate a response based on user input
function generateResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  // Check for greetings
  if (lowerInput.match(/^(hi|hello|hey|greetings).*/i)) {
    return knowledgeBase.greeting[Math.floor(Math.random() * knowledgeBase.greeting.length)]
  }

  // Check for questions about the assistant
  if (
    lowerInput.includes("who are you") ||
    lowerInput.includes("what are you") ||
    lowerInput.includes("introduce yourself")
  ) {
    return knowledgeBase.introduction
  }

  if (
    lowerInput.includes("what can you do") ||
    lowerInput.includes("your capabilities") ||
    lowerInput.includes("help me with")
  ) {
    return knowledgeBase.capabilities
  }

  if (
    lowerInput.includes("limitations") ||
    lowerInput.includes("what can't you do") ||
    lowerInput.includes("unable to")
  ) {
    return knowledgeBase.limitations
  }

  // Check for language learning questions
  if (
    lowerInput.includes("learn language") ||
    lowerInput.includes("language learning") ||
    lowerInput.includes("improve english") ||
    lowerInput.includes("speak better")
  ) {
    return knowledgeBase.language[Math.floor(Math.random() * knowledgeBase.language.length)]
  }

  // Check for education questions
  if (
    lowerInput.includes("study") ||
    lowerInput.includes("learn") ||
    lowerInput.includes("education") ||
    lowerInput.includes("school") ||
    lowerInput.includes("college")
  ) {
    return knowledgeBase.education[Math.floor(Math.random() * knowledgeBase.education.length)]
  }

  // Check for technology questions
  if (
    lowerInput.includes("ai") ||
    lowerInput.includes("artificial intelligence") ||
    lowerInput.includes("machine learning") ||
    lowerInput.includes("technology")
  ) {
    return knowledgeBase.technology[Math.floor(Math.random() * knowledgeBase.technology.length)]
  }

  // Default responses for other queries
  const defaultResponses = [
    `That's an interesting question about "${input.slice(0, 30)}...". While I don't have specific information on this topic, I can help you explore it further. Could you provide more details or specify what aspect you're most interested in?`,
    `Thank you for asking about "${input.slice(0, 30)}...". This is a topic I'd like to help with. To provide a more accurate response, could you clarify what specific information you're looking for?`,
    `I understand you're asking about "${input.slice(0, 30)}...". To give you the most helpful response, could you tell me what you already know about this topic and what you're hoping to learn?`,
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant. I can help answer your questions and provide information on various topics. I'll also read my responses aloud to help with pronunciation and comprehension. What would you like to know?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (synth && utteranceRef.current) {
        synth.cancel()
      }
    }
  }, [])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === "" || isProcessing) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Simulate AI thinking
    setTimeout(() => {
      // Generate AI response
      const responseContent = generateResponse(userMessage.content)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsProcessing(false)

      // Speak the bot's response
      speakText(responseContent)
    }, 1500)
  }

  // Text-to-speech function
  const speakText = (text: string) => {
    if (synth) {
      // Cancel any ongoing speech
      synth.cancel()

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9 // Slightly slower for clarity
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Store reference to current utterance
      utteranceRef.current = utterance

      // Set speaking state
      setIsSpeaking(true)

      // Add event listener for when speech ends
      utterance.onend = () => {
        setIsSpeaking(false)
        utteranceRef.current = null
      }

      // Start speaking
      synth.speak(utterance)
    }
  }

  // Stop speaking
  const stopSpeaking = () => {
    if (synth) {
      synth.cancel()
      setIsSpeaking(false)
      utteranceRef.current = null
    }
  }

  // Speak a message again when requested
  const handleSpeakAgain = (text: string) => {
    speakText(text)
  }

  // Handle textarea key press (submit on Enter without Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto bg-blue-900/30 backdrop-blur-md border-blue-700/50 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-800/50 to-indigo-800/50 border-b border-blue-700/50 flex items-center justify-between">
        <div className="flex items-center">
          <BotAvatar />
          <div className="ml-3">
            <h3 className="font-medium text-white">AI Assistant</h3>
            <p className="text-xs text-blue-200">Powered by SpeakPal AI</p>
          </div>
        </div>

        {isSpeaking ? (
          <Button
            variant="outline"
            size="sm"
            onClick={stopSpeaking}
            className="bg-red-500/20 border-red-500/50 hover:bg-red-500/30 text-white"
          >
            <StopCircle size={16} className="mr-1" /> Stop Speaking
          </Button>
        ) : null}
      </div>

      <div className="h-[400px] md:h-[500px] overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
            <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className="flex-shrink-0 mt-1">{message.role === "user" ? <UserAvatar /> : <BotAvatar />}</div>

              <div
                className={`mx-2 p-3 rounded-lg ${
                  message.role === "user" ? "bg-blue-600 text-white" : "bg-blue-800/40 text-white"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}

                {message.role === "assistant" && (
                  <button
                    onClick={() => handleSpeakAgain(message.content)}
                    className="mt-2 text-blue-300 hover:text-blue-100 text-xs flex items-center"
                    aria-label="Speak message again"
                  >
                    <Volume2 size={12} className="mr-1" />
                    Listen
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start mb-4">
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <BotAvatar />
              </div>
              <div className="mx-2 p-3 rounded-lg bg-blue-800/40 text-white">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-blue-300 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-300 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-300 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-blue-700/50">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="bg-blue-950/50 border-blue-700/50 text-white placeholder:text-blue-300/50 min-h-[60px] resize-none"
            disabled={isProcessing}
            rows={1}
          />

          <div className="flex justify-between items-center">
            <p className="text-xs text-blue-300/70">Press Enter to send, Shift+Enter for new line</p>
            <Button
              type="submit"
              disabled={isProcessing || input.trim() === ""}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <Send size={16} className="mr-2" /> Send
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

