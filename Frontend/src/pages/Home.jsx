"use client"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
  Mic,
  BarChart2,
  FileAudio,
  ArrowRight,
  Zap,
  Award,
  Building,
  BookOpen,
  Lightbulb,
  Users,
} from "lucide-react"
import { motion } from "framer-motion"

const FeatureCard = ({ icon: Icon, title, description, delay, image }) => (
  <motion.div
    className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
  >
    {image && <img src={image} alt={title} className="h-16 w-auto object-contain" />}
    <Icon className="h-12 w-12 text-primary" />
    <h3 className="text-xl font-semibold text-center">{title}</h3>
    <p className="text-muted-foreground text-center text-sm">{description}</p>
  </motion.div>
)

const GalleryCard = ({title, description, delay, image }) => (
  <motion.div
    className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.005 }}
  >
    {image && <img src={image} alt={title} className="h-20 w-auto object-contain" />}
    <h1 className="text-xl font-semibold text-center">{title}</h1>
    <p className="text-muted-foreground text-left">{description}</p>
  </motion.div>
)

function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 text-center py-16">
      <motion.div
        className="space-y-6 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Revolutionize Speech Analysis with AI-Powered Stutter Detection
        </motion.h1>
        <motion.p
          className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Harness the power of artificial intelligence to analyze speech patterns, detect stuttering, and provide
          valuable insights for speech therapy and personal improvement.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl px-4">
        <FeatureCard
          icon={Mic}
          title="Advanced Audio Processing"
          description="State-of-the-art analysis of speech patterns from uploaded or recorded audio samples."
          delay={0.6}
        />
        <FeatureCard
          icon={BarChart2}
          title="Comprehensive Visual Results"
          description="Clear, intuitive visualizations of detected stuttering patterns and frequency data."
          delay={0.8}
        />
        <FeatureCard
          icon={FileAudio}
          title="Precise Transcription"
          description="Accurate speech-to-text conversion with highlighted stuttering indicators for in-depth analysis."
          delay={1}
        />
      </div>
      <div>
      <motion.div
        className="flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105"
        >
          <Link to="/analyze" className="flex items-center">
            Start Your Analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="transition-all duration-300 transform hover:scale-105">
          <Link to="/documentation" className="flex items-center">
            Explore Our Technology
            <Zap className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
      </div>

    <p></p>
    <p></p>

    <div>
    <motion.div
        className="space-y-6 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Our Collaborations
        </motion.h2>
      </motion.div>
    </div>

    {/* Collaboration Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl px-4 bg-gray-50 rounded-lg p-8 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <GalleryCard
          title="Project Vision & Collaboration"
          description="Dassault Systèmes, a global leader in AI-driven simulations and digital healthcare innovations, in collaboration with Vishwakarma Institute of Information Technology (VIIT), is driving forward cutting-edge advancements in speech technology. This project, funded by Dassault Systèmes, aims to revolutionize stutter detection through AI-powered fluency assessment and intervention. By combining technological expertise with academic research, the collaboration ensures a robust, clinically validated, and user-centric approach. With VIIT’s strong foundation in research and AI development, this initiative is set to bridge the gap between computational intelligence and speech-language pathology, creating a transformative solution for speech disorder diagnosis and therapy."
          delay={0.6}
          image="/Images/viit-dass.png"
        />
        <GalleryCard
          title="Consulted Expert - Dr. Namita Joshi"
          description="Dr. Namita Joshi, a distinguished Speech-Language Pathologist with over 23 years of experience, has been instrumental in shaping clinical practices and academic advancements in the field. As the Founder & Director of Sampark ePolyclinic, she specializes in comprehensive speech and language assessments, personalized therapy, and interdisciplinary collaboration. Her expertise extends to mentoring students, publishing research, and contributing to national and international conferences. In our project, Dr. Joshi’s insights have significantly enriched our approach to stutter detection, ensuring a research-backed, user-centric solution for speech fluency assessment and intervention."
          delay={0.8}
          image="/Images/dr-namita-joshi.jpg"
        />
      </motion.div>
      
    </div>
  )
}

export default Home;
