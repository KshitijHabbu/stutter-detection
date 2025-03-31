"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import sentencesData from "@/data/sentences.json"

const ReadableText = ({ gradeLevel }) => {
  const [currentText, setCurrentText] = useState("")
  const [sentences, setSentences] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setSentences(sentencesData[gradeLevel] || [])
    setCurrentIndex(0)
  }, [gradeLevel])

  useEffect(() => {
    if (sentences.length > 0) {
      setCurrentText(sentences[currentIndex])
    }
  }, [sentences, currentIndex])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sentences.length) % sentences.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-primary/20">
      <h3 className="text-lg font-semibold mb-4 text-primary">Read the following text:</h3>
      <div className="min-h-[100px] flex items-center justify-center mb-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-medium text-foreground text-center"
          >
            {currentText}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          variant="outline"
          className="flex items-center transition-all duration-300 hover:scale-105"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          variant="outline"
          className="flex items-center transition-all duration-300 hover:scale-105"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default ReadableText

