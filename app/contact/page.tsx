"use client"

import type React from "react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Send, Mail } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <PageHeader title="Contact" subtitle="Get in Touch" backgroundImage="/images/background-1.jpg" />

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Card className="bg-black/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-light mb-6 text-white">Send a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-300">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-600 text-white focus:border-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-600 text-white focus:border-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-gray-300">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="bg-gray-800 border-gray-600 text-white focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gray-300">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="bg-gray-800 border-gray-600 text-white focus:border-gray-400 resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-white text-black hover:bg-gray-200">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="bg-black/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-light mb-4 text-white">Mailing List</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Subscribe to receive updates about new releases, tour dates, and exclusive content.
                  </p>
                  <Button asChild className="w-full bg-amber-500 text-black hover:bg-amber-400 font-medium">
                    <a href="#mailing-list">
                      <Mail className="mr-2 h-4 w-4" />
                      Join Mailing List
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
