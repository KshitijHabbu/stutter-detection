"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button"; // Assuming you still use Shadcn Button
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Assuming you still use Shadcn Card
// REMOVED: import { Slider } from "@/components/ui/slider"; // No longer needed
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileAudio,
  BarChart2,
  Award,
  ArrowLeft,
  Clock,
  AlertCircle,
  FileText,
  Repeat,
  Pause,
  Volume2,
  Play,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Assuming you still use Shadcn Accordion
import { useAuth } from "../contexts/AuthContext";

// Define the API base URL
const API_BASE_URL = "http://localhost:5000";

export function Results() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // Audio player state
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const location = useLocation();
  const taskId = new URLSearchParams(location.search).get("task_id");
  const { userType, isPatient, isSLP } = useAuth();

  // ... (useEffect for fetching results remains the same) ...
   useEffect(() => {
    if (!taskId) {
      setError("No task ID provided");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let timeoutId = null;

    async function fetchResults() {
      // Reset state on new fetch attempt? Optional, but can be good UX.
      // setIsLoading(true);
      // setError(null);

      try {
        const statusResponse = await fetch(
          `${API_BASE_URL}/task_status/${taskId}`
        );
        // Basic error handling for fetch itself
        if (!statusResponse.ok) {
           throw new Error(`HTTP error! status: ${statusResponse.status}`);
        }
        const statusData = await statusResponse.json();

        console.log("Task status response:", statusData);

        if (!isMounted) return;

        if (statusData.status === "completed") {
          const resultResponse = await fetch(
            `${API_BASE_URL}/get_result/${taskId}`
          );
           if (!resultResponse.ok) {
              throw new Error(`HTTP error! status: ${resultResponse.status}`);
           }
          const resultData = await resultResponse.json();

          console.log("Full result data:", resultData);

          if (!isMounted) return;

          // Safely access properties, providing defaults
          const stutteringFrequency = [
            { type: "Repetitions", frequency: resultData.num_repetitions ?? 0 },
            { type: "Blocks", frequency: resultData.num_blocks ?? 0 },
            { type: "Prolongations", frequency: resultData.num_prolongations ?? 0 },
            { type: "Fillers", frequency: resultData.num_fillers ?? 0 },
          ];

          const passageComparison = resultData.passage_comparison || null;

          const visualizationSrc = resultData.visualization
            ? `data:image/png;base64,${resultData.visualization}`
            : null;

          const audioSrc = resultData.audio
            ? `data:audio/wav;base64,${resultData.audio}`
            : null;

          setResults({
            spectrogram: visualizationSrc,
            transcription: resultData.transcription || "Transcription not available.",
            stutteringFrequency,
            stutterEvents: resultData.stutter_events || [],
            overallScore: resultData.fluency_score ?? 0,
            severity: resultData.severity || "Not Specified",
            passageComparison,
            audio: audioSrc,
          });
          setIsLoading(false);
          setError(null); // Clear previous errors on success
        } else if (statusData.status === "failed") {
          setError(`Analysis failed: ${statusData.error || "Unknown error"}`);
          setIsLoading(false);
        } else { // status is 'pending' or 'processing'
          // Still loading, check again
           setIsLoading(true); // Ensure loading state is true
           setError(null); // Clear errors while pending
          timeoutId = setTimeout(fetchResults, 5000);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        if (!isMounted) return;

        // Show error but keep retrying
        // Avoid showing "Retrying..." if it was a final failure status
        const errorMessage = `Connection or processing error: ${error.message}.`;
        // Check if results exist to avoid overwriting a potential "failed" status message
        if (!results && status !== 'failed') {
             setError(`${errorMessage} Retrying...`);
        } else if (status !== 'failed') {
            // If results already exist or status failed, just log maybe? Or show simpler error.
            setError(errorMessage);
        }
        setIsLoading(false); // Show error, stop loading indicator temporarily
        // Retry logic might need refinement based on error type
        if (!error.message.includes("HTTP error")) { // Avoid retrying on server errors like 404/500 immediately
            timeoutId = setTimeout(fetchResults, 5000);
        }
      }
    }

    fetchResults();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [taskId]); // Rerun effect if taskId changes

  // --- Audio Player Logic ---

  // Toggle Play/Pause
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => console.error("Play error:", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Update state when audio metadata loads (duration)
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Update current time state as audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Reset play state when audio ends
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0); // Reset time to beginning
  };

  // Handle seeking when the *native* range input value changes
  const handleSeek = (event) => {
    if (audioRef.current) {
      const newTime = parseFloat(event.target.value); // Get value from event target
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime); // Update state immediately for responsiveness
    }
  };

  // Helper function to format time
  const formatTime = (seconds) => {
     if (isNaN(seconds) || !isFinite(seconds)) { // Added isFinite check
      return "00:00";
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  // --- End Audio Player Logic ---

  // ... (getStutterIcon, getStutterColor functions remain the same) ...
    // Helper function to get icon for stutter type
  const getStutterIcon = (type) => {
    switch (type?.toLowerCase()) { // Added safety check and toLowerCase
      case "repetition":
        return <Repeat className="h-5 w-5 text-blue-500" />;
      case "block":
        return <Pause className="h-5 w-5 text-red-500" />;
      case "prolongation":
        return <Volume2 className="h-5 w-5 text-green-500" />;
      case "filler": // Added case for fillers if present in events
         return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />; // Default icon
    }
  };

  // Helper function to get color for stutter type
  const getStutterColor = (type) => {
     switch (type?.toLowerCase()) { // Added safety check and toLowerCase
       case "repetition":
        return "bg-blue-100 border-blue-300";
      case "block":
        return "bg-red-100 border-red-300";
      case "prolongation":
        return "bg-green-100 border-green-300";
      case "filler":
        return "bg-yellow-100 border-yellow-300";
      default:
        return "bg-gray-100 border-gray-300"; // Default color
    }
  };

  // Error state display
  if (error && !isLoading) { // Only show final error if not actively loading/retrying
     return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="mb-6 max-w-md">{error}</p>
         <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4" // Use Shadcn button if available
        >
            <Link to="/analyze" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Analyze New Recording
            </Link>
        </Button>
      </div>
    );
  }

  // Loading state display
  if (isLoading || !results) { // Show loading if explicitly loading OR if results aren't populated yet
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium">Analyzing your speech data...</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait, this may take a moment...</p>
        {error && <p className="text-sm text-red-500 mt-4">{error}</p>} {/* Show retrying errors here */}
      </div>
    );
  }


  // --- Common Audio Player Component using native input range ---
  const renderAudioPlayer = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold flex items-center">
          <FileAudio className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary" />
          {isPatient ? "Your Recording" : "Original Recording"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Hidden HTML5 Audio element controlled by React state and refs */}
        <audio
          ref={audioRef}
          src={results.audio}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
          preload="metadata"
          className="hidden"
        />
        {results.audio ? (
             <div className="flex items-center space-x-2 md:space-x-4 w-full">
                 {/* Play/Pause Button */}
                 <Button // Using Shadcn button still
                     onClick={toggleAudio}
                     variant="ghost"
                     size="icon"
                     className="rounded-full flex-shrink-0"
                     disabled={duration === 0} // Disable only if duration isn't loaded
                     aria-label={isPlaying ? "Pause" : "Play"}
                 >
                     {isPlaying ? (
                     <Pause className="h-5 w-5 md:h-6 md:w-6" />
                     ) : (
                     <Play className="h-5 w-5 md:h-6 md:w-6" />
                     )}
                 </Button>

                 {/* Current Time */}
                 <span className="text-xs md:text-sm text-muted-foreground w-10 md:w-12 text-right tabular-nums flex-shrink-0">
                     {formatTime(currentTime)}
                 </span>

                 {/* Native HTML Range Input for Progress Bar / Scrubber */}
                 <input
                     type="range"
                     min="0"
                     max={duration || 0} // Set max to duration, default 0 if not loaded
                     step="0.1" // Fine-grained seeking
                     value={currentTime}
                     onChange={handleSeek} // Use the updated handler
                     disabled={duration === 0} // Disable if duration isn't loaded
                     className="flex-grow h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50" // Basic styling + accent color
                     aria-label="Audio progress"
                 />

                 {/* Total Duration */}
                 <span className="text-xs md:text-sm text-muted-foreground w-10 md:w-12 text-left tabular-nums flex-shrink-0">
                     {formatTime(duration)}
                 </span>
             </div>
        ) : (
           <p className="text-sm text-muted-foreground text-center">Audio recording not available for this analysis.</p>
        )}
      </CardContent>
    </Card>
  );
  // --- End Common Audio Player Component ---


  // --- Patient View ---
  if (isPatient) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-6 md:space-y-8 py-8 px-4" // Slightly reduced spacing
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
          Your Speech Analysis Results
        </h1>

        {/* Severity Display */}
        <div className="text-center text-lg md:text-xl font-semibold">
          Stuttering Severity:{" "}
          <span className="text-primary">{results.severity}</span>
        </div>

        {/* Transcription */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary" />
                Transcription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base text-muted-foreground bg-muted p-3 md:p-4 rounded-lg shadow-inner max-h-60 overflow-y-auto">
                {results.transcription}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disfluency Chart */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary" />
                Disfluency Types
              </CardTitle>
               <CardDescription>How often different disfluency types were detected.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 md:h-64"> {/* Slightly adjusted height */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.stutteringFrequency} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="type" fontSize="12px"/>
                    <YAxis type="number" allowDecimals={false} fontSize="12px" />
                    <Tooltip contentStyle={{fontSize: '12px', padding: '4px 8px'}}/>
                    <Legend wrapperStyle={{fontSize: '12px'}}/>
                    <Bar dataKey="frequency" fill="hsl(var(--primary))" name="Count" barSize={30}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
                 <p className="text-xs text-muted-foreground mt-2 text-center">Higher bars indicate more frequent disfluencies.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fluency Score */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center">
                <Award className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary" />
                Overall Fluency Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2">
                <div className="w-full bg-muted rounded-full h-3 md:h-4 mr-3 overflow-hidden">
                  <motion.div
                    className="bg-primary h-3 md:h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${results.overallScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <span className="text-lg font-semibold">
                  {results.overallScore}%
                </span>
              </div>
               <p className="text-xs md:text-sm text-muted-foreground">A higher score generally indicates smoother speech in this recording.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Audio Player */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {renderAudioPlayer()}
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center pt-4"
        >
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105"
          >
            <Link to="/analyze" className="flex items-center px-6 py-2 text-base">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Analyze Another
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    );
  }
  // --- End Patient View ---


  // --- SLP View ---
  // (SLP view structure remains largely the same, just uses renderAudioPlayer which now contains the native slider)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6 md:space-y-8 py-8 px-4" // Adjusted spacing
    >
      <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
        Detailed Analysis Results
      </h1>

      {/* Severity Display */}
      <div className="text-center text-lg md:text-xl font-semibold">
        Stuttering Severity:{" "}
        <span className="text-primary">{results.severity}</span>
      </div>

      {/* Spectrogram */}
      <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <FileAudio className="mr-2 h-6 w-6 text-primary" />
              Spectrogram
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.spectrogram ? (
              <img
                src={results.spectrogram}
                alt="Spectrogram"
                className="w-full rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-64 bg-muted flex items-center justify-center rounded-lg">
                <p className="text-muted-foreground">
                  Spectrogram not available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      {/* Transcription */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-semibold flex items-center">
              <FileText className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary" />
              Transcription
            </CardTitle>
              <CardDescription>Text generated from the speech recording.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base text-muted-foreground bg-muted p-3 md:p-4 rounded-lg shadow-inner max-h-60 overflow-y-auto">
              {results.transcription}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disfluency Chart */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary" />
                Disfluency Frequency
              </CardTitle>
               <CardDescription>Count of different disfluency types detected.</CardDescription>
            </CardHeader>
             <CardContent>
              <div className="h-60 md:h-64"> {/* Slightly adjusted height */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.stutteringFrequency} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="type" fontSize="12px"/>
                    <YAxis type="number" allowDecimals={false} fontSize="12px" />
                    <Tooltip contentStyle={{fontSize: '12px', padding: '4px 8px'}}/>
                    <Legend wrapperStyle={{fontSize: '12px'}}/>
                    <Bar dataKey="frequency" fill="hsl(var(--primary))" name="Count" barSize={30}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      {/* Stutter Events Section */}
      {results.stutterEvents && results.stutterEvents.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center">
                <Clock className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary" />
                Disfluency Events Timeline
              </CardTitle>
              <CardDescription>
                Detailed breakdown of each disfluency event detected.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-3 max-h-80 overflow-y-auto pr-2">
                {results.stutterEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`p-2 md:p-3 rounded-lg border ${getStutterColor(
                      event.type
                    )} flex items-start text-xs md:text-sm`}
                  >
                    <div className="mr-2 md:mr-3 mt-0.5 flex-shrink-0">
                      {getStutterIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1 flex-wrap gap-x-2">
                        <h4 className="font-semibold capitalize">
                          {event.type}{" "}
                          {event.subtype ? `(${event.subtype})` : ""}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                          {formatTime(event.start)} - {formatTime(event.end)} (
                          {event.duration?.toFixed(2)}s) {/* Optional chaining */}
                        </span>
                      </div>
                       {event.text && (
                        <p className="text-xs mt-1 italic text-gray-600">Context: "{event.text}"</p>
                      )}
                      {event.count > 1 && (
                        <p className="text-xs">Count: {event.count}</p>
                      )}
                       {event.confidence !== undefined && event.confidence !== null && ( // Check confidence better
                           <p className="text-xs">
                                Confidence: {(event.confidence * 100).toFixed(0)}%
                           </p>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Passage Comparison Section */}
      {results.passageComparison && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary" /> {/* Placeholder icon */}
                Passage Comparison
              </CardTitle>
              <CardDescription>
                Comparison between expected text and actual transcription.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center p-3 md:p-4 bg-muted rounded-lg">
                     <div>
                          <p className="text-xs md:text-sm font-medium text-muted-foreground">Similarity</p>
                          <p className="text-xl md:text-2xl font-bold text-primary">
                               {results.passageComparison.similarity_score !== undefined
                                   ? `${(results.passageComparison.similarity_score * 100).toFixed(1)}%`
                                   : "N/A"
                               }
                          </p>
                     </div>
                     <div>
                         <p className="text-xs md:text-sm font-medium text-muted-foreground">Word Count</p>
                         <p className="text-sm md:text-base font-semibold">
                             Spoken: {results.passageComparison.spoken_word_count ?? 'N/A'} /
                             Ref: {results.passageComparison.reference_word_count ?? 'N/A'}
                          </p>
                     </div>
                    <div>
                         <p className="text-xs md:text-sm font-medium text-muted-foreground">Discrepancies</p>
                         <p className="text-xl md:text-2xl font-bold">
                            {results.passageComparison.discrepancy_count ?? 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Discrepancy Details Accordion */}
                {results.passageComparison.discrepancies && results.passageComparison.discrepancies.length > 0 && (
                   <Accordion type="single" collapsible className="w-full">
                     <AccordionItem value="discrepancies">
                       <AccordionTrigger className="text-sm md:text-base hover:no-underline">
                         View Discrepancy Details ({results.passageComparison.discrepancies.length})
                       </AccordionTrigger>
                       <AccordionContent>
                         <div className="max-h-60 overflow-y-auto p-2 border rounded-md space-y-2 bg-background">
                           {results.passageComparison.discrepancies
                             .slice(0, 50)
                             .map((disc, index) => (
                               <div key={index} className="p-2 border-b text-xs md:text-sm">
                                 <p className="font-medium capitalize mb-1">
                                   {disc.type}:
                                 </p>
                                 {disc.reference && (
                                   <p className="text-red-600 line-through">
                                     Ref: {disc.reference}
                                   </p>
                                 )}
                                 {disc.transcribed && (
                                   <p className="text-green-600">
                                     Said: {disc.transcribed}
                                   </p>
                                 )}
                               </div>
                             ))}
                           {results.passageComparison.discrepancies.length > 50 && (
                             <p className="text-center text-xs text-muted-foreground mt-2">
                               Showing first 50 of {results.passageComparison.discrepancies.length} discrepancies
                             </p>
                           )}
                         </div>
                       </AccordionContent>
                     </AccordionItem>
                   </Accordion>
                )}
                 {!results.passageComparison.discrepancies || results.passageComparison.discrepancies.length === 0 && (
                    <p className="text-sm text-center text-muted-foreground mt-2">No discrepancies found.</p>
                 )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Fluency Score */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center">
                <Award className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary" />
                Overall Fluency Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2">
                <div className="w-full bg-muted rounded-full h-3 md:h-4 mr-3 overflow-hidden">
                  <motion.div
                    className="bg-primary h-3 md:h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${results.overallScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }} // Match patient view delay
                  />
                </div>
                <span className="text-lg font-semibold">
                  {results.overallScore}%
                </span>
              </div>
               <p className="text-xs md:text-sm text-muted-foreground">Represents overall speech fluency based on disfluency analysis.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Audio Player - Placed earlier for SLP */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {renderAudioPlayer()} {/* Uses the common audio player with native input */}
        </motion.div>


      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }} // Last item
        className="flex justify-center pt-4"
      >
        <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105"
          >
            <Link to="/analyze" className="flex items-center px-6 py-2 text-base">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Analyze Another
            </Link>
          </Button>
      </motion.div>
    </motion.div>
  );
   // --- End SLP View ---
}

export default Results;