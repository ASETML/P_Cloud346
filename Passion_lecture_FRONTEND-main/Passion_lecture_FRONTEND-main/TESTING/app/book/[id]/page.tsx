"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import StarRating from "@/components/star-rating"

interface BookPageProps {
  params: {
    id: string
  }
}

export default function BookPage({ params }: BookPageProps) {
  const { id } = params
  const [commentText, setCommentText] = useState("")
  const [rating, setRating] = useState(0)

  // Sample book data
  const book = {
    id,
    title: "The King",
    author: "Hamilton Louis",
    editor: "Socket Edissions",
    pdfLink: "#",
    resume:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consequat tortor eu ultrices. Etiam sed mi mauris. Vivamus hendrerit, lacus quis posuere congue, diam orci. Ut quis semper libero, ac consectetur ex. Sed ac diam neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nam fringilla bibendum vitae mattis enim, laoreet.",
    comments: [
      { id: "1", user: "User1", text: "Great book!", rating: 5 },
      { id: "2", user: "User2", text: "I enjoyed reading this.", rating: 4 },
    ],
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logic to submit comment would go here
    console.log({ commentText, rating })
    setCommentText("")
    setRating(0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-medium-blue mb-6">{book.title}</h1>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-1/3">
            <div className="aspect-square relative mb-4">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt={book.title}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <Link
              href={book.pdfLink}
              className="block text-center bg-primary-green text-black px-4 py-2 rounded-md hover:bg-[#9ed3ac] transition-colors"
            >
              PDF Link
            </Link>
          </div>

          <div className="md:w-2/3">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-medium-blue">Author: {book.author}</h2>
              <p className="text-light-blue-gray">Editor: {book.editor}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-medium-blue mb-2">Resume</h3>
              <p className="text-light-blue-gray">{book.resume}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-medium-blue mb-4">Comments</h3>

              <div className="space-y-4 mb-6">
                {book.comments.map((comment) => (
                  <div key={comment.id} className="bg-card-bg p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">{comment.user}</p>
                      <StarRating initialRating={comment.rating} readOnly />
                    </div>
                    <p className="text-light-blue-gray">{comment.text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card-bg p-4 rounded-lg">
                <h4 className="text-medium-blue font-semibold mb-4">New comment</h4>
                <form onSubmit={handleCommentSubmit}>
                  <div className="mb-4">
                    <StarRating onChange={setRating} />
                  </div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-2 border border-primary-green rounded mb-4"
                    rows={4}
                    placeholder="Write your comment here..."
                  ></textarea>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="bg-delete-btn text-black px-4 py-2 rounded-md hover:bg-[#f37777] transition-colors"
                    >
                      cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-green text-black px-4 py-2 rounded-md hover:bg-[#9ed3ac] transition-colors"
                    >
                      send comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
