
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizResult from '@/components/quiz/QuizResult';
import { quizQuestions, getQuizResult } from '@/data/quizData';
import { PersonalityTraits, QuizResult as QuizResultType } from '@/types/quiz';
import { BrainCircuit, ArrowRight } from 'lucide-react';

const PersonalityQuiz: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userTraits, setUserTraits] = useState<Record<string, number>>({
    emotional: 0,
    analytical: 0,
    social: 0,
    creative: 0
  });
  const [quizResult, setQuizResult] = useState<QuizResultType | null>(null);

  const handleStartQuiz = () => {
    setStarted(true);
    setCurrentQuestionIndex(0);
    setUserTraits({
      emotional: 0,
      analytical: 0,
      social: 0,
      creative: 0
    });
    setQuizResult(null);
  };

  const handleAnswer = (optionId: string) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const selectedOption = currentQuestion.options.find(option => option.id === optionId);
    
    if (selectedOption) {
      setUserTraits(prev => ({
        ...prev,
        [selectedOption.trait]: prev[selectedOption.trait] + selectedOption.value
      }));
      
      // Move to next question or finish quiz
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Calculate and show result
        const updatedTraits = {
          ...userTraits,
          [selectedOption.trait]: userTraits[selectedOption.trait] + selectedOption.value
        };
        const result = getQuizResult(updatedTraits);
        setQuizResult(result);
      }
    }
  };

  const renderContent = () => {
    if (!started) {
      return (
        <div className="max-w-3xl mx-auto text-center p-6 bg-white/80 dark:bg-chetna-darker/80 backdrop-blur-sm rounded-2xl shadow-md animate-fade-in">
          <div className="mx-auto bg-chetna-primary text-white w-20 h-20 flex items-center justify-center rounded-full mb-6">
            <BrainCircuit size={40} />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-chetna-primary">Discover Your Inner Self</h1>
          <p className="mb-6 text-lg">
            Take the Chetna Quest to uncover your personality traits, strengths, emotional tendencies, 
            and get personalized insights for your mental wellness journey.
          </p>
          
          <div className="flex flex-col space-y-4 max-w-sm mx-auto">
            <div className="bg-chetna-bubble/50 dark:bg-chetna-dark/30 p-3 rounded-lg text-left">
              <p>✨ 5 fun questions about your choices and reactions</p>
            </div>
            <div className="bg-chetna-bubble/50 dark:bg-chetna-dark/30 p-3 rounded-lg text-left">
              <p>🧩 Discover your unique personality type</p>
            </div>
            <div className="bg-chetna-bubble/50 dark:bg-chetna-dark/30 p-3 rounded-lg text-left">
              <p>📝 Get personalized journal prompts and insights</p>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="mt-8 bg-gradient-to-r from-chetna-primary to-chetna-primary/90 hover:opacity-90"
            onClick={handleStartQuiz}
          >
            Start My Quest <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    } else if (quizResult) {
      return <QuizResult result={quizResult} onRetakeQuiz={handleStartQuiz} />;
    } else {
      return (
        <div className="w-full max-w-3xl mx-auto">
          <QuizProgress 
            currentQuestion={currentQuestionIndex + 1} 
            totalQuestions={quizQuestions.length} 
          />
          <QuizQuestion 
            question={quizQuestions[currentQuestionIndex]} 
            onAnswer={handleAnswer} 
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDE1D3] dark:from-chetna-dark dark:to-chetna-darker">
      <Helmet>
        <title>Chetna Quest - Discover Your Personality | Chetna AI</title>
        <meta name="description" content="Take the Chetna Quest to discover your personality type, strengths, challenges, and get personalized insights for your mental wellness journey." />
        <link rel="canonical" href="https://chetna.live/quiz" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
};

export default PersonalityQuiz;
