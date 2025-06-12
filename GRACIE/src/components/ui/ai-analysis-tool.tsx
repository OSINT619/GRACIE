import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileText, Brain, AlertTriangle, CheckCircle, X, Loader2 } from 'lucide-react';

interface AnalysisInstance {
  quote: string;
  explanation: string;
  severity_score: 'Low' | 'Medium' | 'High';
  severity_explanation: string;
}

interface ManipulationTechnique {
  technique: string;
  instances: AnalysisInstance[];
  pattern_insight: string;
}

interface AnalysisResult {
  overall_assessment: string;
  manipulation_techniques: ManipulationTechnique[];
  validation_support_message: string;
  evidence_summary: string;
  extracted_text_from_image?: string;
}

// Comprehensive manipulation technique information
const tacticExplanations = {
  "Gaslighting": {
    definition: "A form of psychological manipulation where the manipulator seeks to sow seeds of doubt in a targeted individual or group, making them question their own memory, perception, or judgment.",
    examples: [
      "Denying events that clearly happened: 'I never said that' when you have clear memory of the conversation",
      "Questioning your memory: 'You're remembering it wrong' or 'That's not how it happened'",
      "Trivializing your feelings: 'You're being too sensitive' or 'You're overreacting'",
      "Diverting blame: 'If you hadn't done X, I wouldn't have had to do Y'"
    ],
    warningSigns: [
      "You constantly second-guess yourself",
      "You feel confused and question your own memory",
      "You apologize frequently, even when you've done nothing wrong",
      "You feel like you're 'walking on eggshells'",
      "You make excuses for the other person's behavior"
    ],
    impact: "Gaslighting can severely damage your self-confidence and ability to trust your own perceptions. Over time, it can lead to anxiety, depression, and a distorted sense of reality.",
    copingStrategies: [
      "Keep a journal of events and conversations",
      "Trust your instincts and feelings",
      "Seek validation from trusted friends or family",
      "Consider professional counseling",
      "Set clear boundaries and stick to them"
    ]
  },
  "Blame Shifting": {
    definition: "A tactic where an individual avoids responsibility for their actions by redirecting fault onto others, circumstances, or external factors.",
    examples: [
      "'It's your fault I got angry' - making you responsible for their emotional reactions",
      "'I wouldn't have done it if you hadn't...' - conditional blame that makes their actions your responsibility",
      "Accusing you of the very behavior they're exhibiting",
      "Bringing up past mistakes to deflect from current issues"
    ],
    warningSigns: [
      "They never take responsibility for their mistakes",
      "Every problem becomes your fault somehow",
      "They turn discussions about their behavior into attacks on you",
      "You find yourself constantly defending your actions",
      "They use phrases like 'You made me do it'"
    ],
    impact: "Blame shifting can make you feel responsible for problems you didn't create, leading to guilt, self-doubt, and an unhealthy sense of responsibility for others' actions.",
    copingStrategies: [
      "Recognize that you're only responsible for your own actions",
      "Don't accept blame for others' choices and behaviors",
      "Use 'I' statements to express how their behavior affects you",
      "Stay focused on the specific issue at hand",
      "Seek support from others who can provide perspective"
    ]
  },
  "Minimization": {
    definition: "Downplaying the significance, impact, or severity of harmful behavior, making the victim feel like their concerns are invalid or exaggerated.",
    examples: [
      "'It wasn't that bad' - dismissing the severity of their actions",
      "'I was just joking' - using humor as an excuse for hurtful behavior",
      "'You're making a big deal out of nothing' - invalidating your emotional response",
      "Comparing their behavior to worse examples to make it seem acceptable"
    ],
    warningSigns: [
      "Your concerns are consistently dismissed as 'no big deal'",
      "They use humor to deflect serious conversations",
      "You're told you're 'too sensitive' when expressing hurt",
      "They compare their behavior to worse examples",
      "You start to doubt whether your feelings are valid"
    ],
    impact: "Minimization can make you question the validity of your own feelings and experiences, potentially leading you to accept unacceptable behavior.",
    copingStrategies: [
      "Trust your feelings - if something hurts, it matters",
      "Don't let others define what should or shouldn't bother you",
      "Seek validation from trusted friends or counselors",
      "Document incidents to maintain perspective on their severity",
      "Set clear boundaries about what behavior is acceptable"
    ]
  },
  "Projection": {
    definition: "A defense mechanism where an individual unconsciously attributes their own thoughts, feelings, or behaviors to another person.",
    examples: [
      "Someone who is lying accusing you of being dishonest",
      "A person feeling insecure attacking your confidence",
      "If they are being critical, they might accuse you of being judgmental"
    ],
    warningSigns: [
      "They accuse you of things they do themselves",
      "Their criticisms of you seem to describe their own behavior",
      "They seem unable to see their own flaws but focus intensely on yours",
      "You feel like you're being blamed for their emotional state",
      "Their accusations don't match your actual behavior"
    ],
    impact: "Projection can be confusing and disorienting, making you question your own behavior and take on responsibility for the other person's issues.",
    copingStrategies: [
      "Recognize projection when accusations don't match your behavior",
      "Don't internalize their projections as truth about yourself",
      "Maintain awareness of your own actual behaviors and motivations",
      "Consider whether their accusations better describe their own behavior",
      "Seek objective feedback from trusted sources"
    ]
  }
};

interface LearnMoreModalProps {
  technique: string;
  isOpen: boolean;
  onClose: () => void;
}

const LearnMoreModal = ({ technique, isOpen, onClose }: LearnMoreModalProps) => {
  const info = tacticExplanations[technique as keyof typeof tacticExplanations];
  
  if (!info) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="frosted-glass-container max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-sky-400 flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Understanding {technique}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Comprehensive information about this manipulation technique
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Definition */}
            <div className="frosted-glass-container p-4">
              <h3 className="text-lg font-semibold text-sky-400 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Definition
              </h3>
              <p className="text-gray-300 leading-relaxed">{info.definition}</p>
            </div>

            {/* Examples */}
            <div className="frosted-glass-container p-4">
              <h3 className="text-lg font-semibold text-sky-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Common Examples
              </h3>
              <ul className="space-y-2">
                {info.examples.map((example, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <span className="text-sky-400 mt-1">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning Signs */}
            <div className="frosted-glass-container p-4">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Warning Signs
              </h3>
              <ul className="space-y-2">
                {info.warningSigns.map((sign, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">⚠</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Impact */}
            <div className="frosted-glass-container p-4">
              <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Psychological Impact
              </h3>
              <p className="text-gray-300 leading-relaxed">{info.impact}</p>
            </div>

            {/* Coping Strategies */}
            <div className="frosted-glass-container p-4">
              <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Coping Strategies
              </h3>
              <ul className="space-y-2">
                {info.copingStrategies.map((strategy, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Resources */}
            <div className="frosted-glass-container p-4 border border-sky-500/30">
              <h3 className="text-lg font-semibold text-sky-400 mb-3">Need Support?</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>National Domestic Violence Hotline:</strong> 1-800-799-7233</p>
                <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                <p><strong>SAMHSA National Helpline:</strong> 1-800-662-4357</p>
                <p className="text-sky-400 mt-3">Remember: You deserve to be treated with respect and kindness. Trust your instincts.</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export const AIAnalysisTool = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToResults = () => {
    const resultsElement = document.getElementById('analysis-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToModalContent = () => {
    setTimeout(() => {
      const modalContent = document.querySelector('[role="dialog"]');
      if (modalContent) {
        modalContent.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const handleTechniqueClick = (technique: string) => {
    setSelectedTechnique(technique);
    setIsModalOpen(true);
    scrollToModalContent();
  };

  const handleModalClose = () => {
    setSelectedTechnique(null);
    setIsModalOpen(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setTextInput('');
        setError(null);
      } else {
        setError('Please select a valid image file (PNG, JPG, GIF, WEBP)');
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertFileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve({ base64, mimeType: file.type });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!textInput.trim() && !selectedFile) {
      setError('Please enter text or upload an image to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
      }

      const analysisSchema = {
        type: "OBJECT",
        properties: {
          "overall_assessment": { "type": "STRING" },
          "manipulation_techniques": {
            "type": "ARRAY",
            "items": {
              "type": "OBJECT",
              "properties": {
                "technique": { "type": "STRING" },
                "instances": {
                  "type": "ARRAY",
                  "items": {
                    "type": "OBJECT",
                    "properties": {
                      "quote": { "type": "STRING" },
                      "explanation": { "type": "STRING" },
                      "severity_score": { "type": "STRING", "enum": ["Low", "Medium", "High"] },
                      "severity_explanation": { "type": "STRING" }
                    },
                    "required": ["quote", "explanation", "severity_score", "severity_explanation"]
                  }
                },
                "pattern_insight": { "type": "STRING" }
              },
              "required": ["technique", "instances", "pattern_insight"]
            }
          },
          "validation_support_message": { "type": "STRING" },
          "evidence_summary": { "type": "STRING" },
          "extracted_text_from_image": { "type": "STRING" }
        },
        "required": ["overall_assessment", "manipulation_techniques", "validation_support_message", "evidence_summary"]
      };

      let systemPrompt: string;
      const baseInstruction = `You are an expert in analyzing conversations for psychological manipulation tactics. Your primary goal is to help users understand if they are experiencing manipulation. Analyze the conversation for instances of Blame Shifting, Minimization, Projection, and Gaslighting. For each instance, provide the exact quote, an explanation of why it's an example of the technique, a severity score (Low, Medium, High), and an explanation for that severity. Also, provide an overall assessment of the conversation, a supportive message for the user, a summary of how this analysis can help in evidence collection, and any recognized patterns for each technique. Your response MUST conform to the provided JSON schema. Ensure all descriptions and explanations are clear and easy to understand for a layperson. If the input does not contain clear examples of manipulation, state that clearly and gently in the 'overall_assessment'.`;

      let requestContents: any[] = [];

      if (selectedFile) {
        const { base64, mimeType } = await convertFileToBase64(selectedFile);
        systemPrompt = `First, carefully extract all text from the provided image. Preserve the original formatting and speaker attribution if apparent. Then, using ONLY the extracted text, perform the analysis as described below. ${baseInstruction} Include the extracted text in the 'extracted_text_from_image' field of your JSON response. If the image does not contain a discernible conversation or the text is unclear, state that in 'overall_assessment' and 'extracted_text_from_image'.`;
        
        requestContents.push({
          role: "user",
          parts: [
            { text: systemPrompt },
            { inlineData: { mimeType, data: base64 } }
          ]
        });
      } else {
        systemPrompt = `${baseInstruction}\nConversation to analyze:\n---\n${textInput}\n---`;
        requestContents.push({
          role: "user",
          parts: [{ text: systemPrompt }]
        });
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: requestContents,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema
          }
        })
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const analysisData = JSON.parse(result.candidates[0].content.parts[0].text);
        setAnalysisResult(analysisData);
      } else {
        throw new Error('Invalid API response structure.');
      }

    } catch (err: any) {
      console.error('Analysis API Error:', err);
      setError(`Analysis Failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="frosted-glass-container">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-sky-400 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8" />
            GRACIE Analysis Matrix
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Advanced AI-powered analysis for detecting psychological manipulation patterns
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="frosted-tabs grid w-full grid-cols-2">
              <TabsTrigger value="text" className="frosted-tab-trigger">
                <FileText className="w-4 h-4 mr-2" />
                Text Analysis
              </TabsTrigger>
              <TabsTrigger value="image" className="frosted-tab-trigger">
                <Upload className="w-4 h-4 mr-2" />
                Image Analysis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Enter conversation text to analyze:
                </label>
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your conversation here..."
                  className="frosted-input min-h-[120px] resize-none"
                  disabled={isAnalyzing || !!selectedFile}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Upload conversation screenshot:
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isAnalyzing}
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="frosted-button"
                      disabled={isAnalyzing}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                    {selectedFile && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">{selectedFile.name}</span>
                        <Button
                          onClick={clearFile}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          disabled={isAnalyzing}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="frosted-glass-container p-4">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {error && (
            <Alert className="frosted-alert border-red-500/50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sky-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing conversation patterns...</span>
              </div>
              <Progress value={progress} className="frosted-progress" />
            </div>
          )}
          
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!textInput.trim() && !selectedFile)}
            className="frosted-button w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Activate Analysis Matrix
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <div id="analysis-results" className="analysis-results space-y-6">
          {analysisResult.extracted_text_from_image && (
            <Card className="frosted-glass-container">
              <CardHeader>
                <CardTitle className="text-xl text-sky-400">Extracted Text from Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="frosted-glass-container p-4 bg-gray-800/50">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                    {analysisResult.extracted_text_from_image}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="frosted-glass-container">
            <CardHeader>
              <CardTitle className="text-xl text-sky-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Overall Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">{analysisResult.overall_assessment}</p>
            </CardContent>
          </Card>

          <Card className="frosted-glass-container">
            <CardHeader>
              <CardTitle className="text-xl text-sky-400 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Validation & Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">{analysisResult.validation_support_message}</p>
            </CardContent>
          </Card>

          {analysisResult.manipulation_techniques && analysisResult.manipulation_techniques.length > 0 && (
            <Card className="frosted-glass-container">
              <CardHeader>
                <CardTitle className="text-xl text-sky-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Manipulation Techniques Identified
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {analysisResult.manipulation_techniques.map((technique, index) => (
                  <div key={index} className="space-y-4 pb-6 border-b border-gray-600 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-sky-400">{technique.technique}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="frosted-button text-xs"
                        onClick={() => handleTechniqueClick(technique.technique)}
                      >
                        Learn More
                      </Button>
                    </div>
                    
                    {technique.instances && technique.instances.length > 0 && (
                      <div className="space-y-3">
                        {technique.instances.map((instance, instanceIndex) => (
                          <div key={instanceIndex} className="frosted-glass-container p-4 border-l-4 border-sky-500">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-4">
                                <blockquote className="text-gray-200 italic flex-1">
                                  "{instance.quote}"
                                </blockquote>
                                <Badge variant={getSeverityBadgeVariant(instance.severity_score)} className="shrink-0">
                                  {instance.severity_score}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400">
                                <strong>Explanation:</strong> {instance.explanation}
                              </p>
                              <p className="text-sm text-gray-400">
                                <strong>Severity:</strong> <span className={getSeverityColor(instance.severity_score)}>{instance.severity_score}</span> - {instance.severity_explanation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {technique.pattern_insight && (
                      <div className="frosted-glass-container p-4 bg-sky-500/10">
                        <p className="text-sm text-gray-300">
                          <strong className="text-sky-400">Pattern Insight:</strong> {technique.pattern_insight}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="frosted-glass-container">
            <CardHeader>
              <CardTitle className="text-xl text-sky-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Evidence Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">{analysisResult.evidence_summary}</p>
            </CardContent>
          </Card>

          {/* Learn More Button */}
          <div className="text-center pt-6">
            <button
              onClick={scrollToResults}
              className="frosted-button px-6 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              Learn more about these results
            </button>
          </div>
        </div>
      )}

      {/* Learn More Modal */}
      {selectedTechnique && (
        <LearnMoreModal
          technique={selectedTechnique}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};