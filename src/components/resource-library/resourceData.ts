export const categories = [
  { id: 'articles', label: 'Articles', icon: 'BookOpen' },
  { id: 'exercises', label: 'Exercises', icon: 'Brain' },
  { id: 'videos', label: 'Videos', icon: 'Play' },
  { id: 'worksheets', label: 'Worksheets', icon: 'Download' },
];

export const resources = {
  articles: [
    {
      title: "Understanding Anxiety: A Complete Guide",
      description: "Learn about anxiety symptoms, causes, and effective management strategies",
      category: "Anxiety",
      readTime: "8 min read",
      tags: ["anxiety", "mental health", "coping"],
      difficulty: "Beginner",
      rating: 4.8,
      content: `
        <h2>Understanding Anxiety</h2>
        <p>Anxiety is a natural response to stress and can be beneficial in some situations. However, when anxiety becomes overwhelming or persistent, it may indicate an anxiety disorder.</p>
        
        <h3>Common Symptoms</h3>
        <ul>
          <li>Excessive worry or fear</li>
          <li>Restlessness or feeling on edge</li>
          <li>Difficulty concentrating</li>
          <li>Physical symptoms like rapid heartbeat</li>
        </ul>
        
        <h3>Management Strategies</h3>
        <p>There are several effective ways to manage anxiety:</p>
        <ul>
          <li><strong>Deep breathing exercises</strong> - Help calm the nervous system</li>
          <li><strong>Progressive muscle relaxation</strong> - Reduces physical tension</li>
          <li><strong>Mindfulness meditation</strong> - Helps stay present and grounded</li>
          <li><strong>Regular exercise</strong> - Natural anxiety reducer</li>
        </ul>
      `
    },
    {
      title: "Building Emotional Resilience",
      description: "Techniques to bounce back from life's challenges with strength",
      category: "Resilience",
      readTime: "12 min read",
      tags: ["resilience", "emotional health", "recovery"],
      difficulty: "Intermediate",
      rating: 4.9,
      content: `
        <h2>Building Emotional Resilience</h2>
        <p>Emotional resilience is the ability to adapt and bounce back from adversity, trauma, or stress.</p>
        
        <h3>Key Components</h3>
        <ul>
          <li>Self-awareness and emotional regulation</li>
          <li>Strong support networks</li>
          <li>Problem-solving skills</li>
          <li>Adaptability and flexibility</li>
        </ul>
      `
    },
    {
      title: "Mindful Living in Modern Times",
      description: "Incorporating mindfulness practices into your daily routine",
      category: "Mindfulness",
      readTime: "6 min read",
      tags: ["mindfulness", "meditation", "daily life"],
      difficulty: "Beginner",
      rating: 4.7,
      content: `
        <h2>Mindful Living</h2>
        <p>Mindfulness is about being fully present in the moment, aware of where you are and what you're doing.</p>
        
        <h3>Daily Practices</h3>
        <ul>
          <li>Mindful breathing</li>
          <li>Body scan meditation</li>
          <li>Mindful eating</li>
          <li>Walking meditation</li>
        </ul>
      `
    }
  ],
  exercises: [
    {
      title: "5-4-3-2-1 Grounding Technique",
      description: "A simple exercise to manage anxiety and stay present",
      category: "Anxiety",
      duration: "5 minutes",
      tags: ["anxiety", "grounding", "mindfulness"],
      difficulty: "Beginner",
      rating: 4.9,
      steps: [
        "Take a deep breath and look around you",
        "Name 5 things you can see",
        "Name 4 things you can touch",
        "Name 3 things you can hear",
        "Name 2 things you can smell",
        "Name 1 thing you can taste"
      ]
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Reduce physical tension and promote relaxation",
      category: "Stress",
      duration: "15 minutes",
      tags: ["stress", "relaxation", "body awareness"],
      difficulty: "Beginner",
      rating: 4.8,
      steps: [
        "Find a comfortable position and close your eyes",
        "Start with your toes - tense for 5 seconds, then relax",
        "Move to your feet - tense and relax",
        "Continue with calves, thighs, abdomen",
        "Progress to hands, arms, shoulders",
        "Finish with neck and face muscles",
        "Take a moment to notice the relaxation"
      ]
    },
    {
      title: "Breathing Exercises for Calm",
      description: "Various breathing techniques for different situations",
      category: "Breathing",
      duration: "10 minutes",
      tags: ["breathing", "calm", "anxiety"],
      difficulty: "Beginner",
      rating: 4.7,
      steps: [
        "Sit comfortably with your back straight",
        "Place one hand on chest, one on belly",
        "Breathe in slowly through your nose for 4 counts",
        "Hold your breath for 4 counts",
        "Exhale slowly through your mouth for 6 counts",
        "Repeat this cycle 10 times",
        "Notice how you feel afterwards"
      ]
    }
  ],
  videos: [
    {
      title: "Introduction to Meditation",
      description: "A beginner-friendly guide to starting your meditation practice",
      category: "Meditation",
      duration: "15 minutes",
      tags: ["meditation", "beginner", "mindfulness"],
      difficulty: "Beginner",
      rating: 4.8,
      videoUrl: "https://www.youtube.com/embed/ZToicYcHIOU"
    },
    {
      title: "Dealing with Depression",
      description: "Expert insights on understanding and managing depression",
      category: "Depression",
      duration: "25 minutes",
      tags: ["depression", "expert", "management"],
      difficulty: "Intermediate",
      rating: 4.9,
      videoUrl: "https://www.youtube.com/embed/mb85GMxNtNk"
    },
    {
      title: "Anxiety Management Techniques",
      description: "Practical strategies for managing anxiety in daily life",
      category: "Anxiety",
      duration: "18 minutes",
      tags: ["anxiety", "techniques", "practical"],
      difficulty: "Beginner",
      rating: 4.7,
      videoUrl: "https://www.youtube.com/embed/WWloIAQpMcQ"
    }
  ],
  worksheets: [
    {
      title: "Daily Mood Tracker",
      description: "Track your mood patterns and identify triggers",
      category: "Mood",
      format: "PDF",
      tags: ["mood", "tracking", "patterns"],
      difficulty: "Beginner",
      rating: 4.6,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #7c3aed;">Daily Mood Tracker</h1>
          <p style="text-align: center; margin-bottom: 30px;">Track your daily moods to identify patterns and triggers</p>
          
          <div style="margin-bottom: 30px;">
            <h3>Instructions:</h3>
            <p>Rate your mood on a scale of 1-10 each day and note any significant events or triggers.</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #d1d5db; padding: 10px; text-align: left;">Date</th>
                <th style="border: 1px solid #d1d5db; padding: 10px; text-align: left;">Mood (1-10)</th>
                <th style="border: 1px solid #d1d5db; padding: 10px; text-align: left;">Notes/Triggers</th>
              </tr>
            </thead>
            <tbody>
              ${Array.from({ length: 14 }, (_, i) => `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 10px; height: 40px;"></td>
                  <td style="border: 1px solid #d1d5db; padding: 10px; height: 40px;"></td>
                  <td style="border: 1px solid #d1d5db; padding: 10px; height: 40px;"></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div>
            <h3>Mood Scale Reference:</h3>
            <ul>
              <li>1-2: Very Low (Depressed, hopeless)</li>
              <li>3-4: Low (Sad, down)</li>
              <li>5-6: Neutral (Okay, stable)</li>
              <li>7-8: Good (Happy, positive)</li>
              <li>9-10: Excellent (Joyful, energetic)</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: "Anxiety Thought Challenge Worksheet",
      description: "Challenge negative thoughts and develop balanced thinking",
      category: "Anxiety",
      format: "PDF",
      tags: ["anxiety", "CBT", "thoughts"],
      difficulty: "Intermediate",
      rating: 4.8,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #7c3aed;">Anxiety Thought Challenge Worksheet</h1>
          <p style="text-align: center; margin-bottom: 30px;">Challenge anxious thoughts and develop more balanced thinking patterns</p>
          
          <div style="margin-bottom: 30px;">
            <h3>How to Use This Worksheet:</h3>
            <ol>
              <li>Write down your anxious thought</li>
              <li>Identify the emotion and rate its intensity (1-10)</li>
              <li>Examine the evidence for and against the thought</li>
              <li>Create a more balanced, realistic thought</li>
              <li>Rate your emotion again after the challenge</li>
            </ol>
          </div>
          
          <div style="border: 2px solid #7c3aed; padding: 20px; margin-bottom: 20px;">
            <h3>Thought Challenge #1</h3>
            <p><strong>Anxious Thought:</strong></p>
            <div style="border: 1px solid #ccc; height: 60px; margin-bottom: 15px;"></div>
            
            <p><strong>Emotion & Intensity (1-10):</strong></p>
            <div style="border: 1px solid #ccc; height: 40px; margin-bottom: 15px;"></div>
            
            <p><strong>Evidence FOR this thought:</strong></p>
            <div style="border: 1px solid #ccc; height: 80px; margin-bottom: 15px;"></div>
            
            <p><strong>Evidence AGAINST this thought:</strong></p>  
            <div style="border: 1px solid #ccc; height: 80px; margin-bottom: 15px;"></div>
            
            <p><strong>More Balanced Thought:</strong></p>
            <div style="border: 1px solid #ccc; height: 80px; margin-bottom: 15px;"></div>
            
            <p><strong>New Emotion & Intensity (1-10):</strong></p>
            <div style="border: 1px solid #ccc; height: 40px;"></div>
          </div>
          
          <div style="border: 2px solid #7c3aed; padding: 20px; margin-bottom: 20px;">
            <h3>Thought Challenge #2</h3>
            <p><strong>Anxious Thought:</strong></p>
            <div style="border: 1px solid #ccc; height: 60px; margin-bottom: 15px;"></div>
            
            <p><strong>Emotion & Intensity (1-10):</strong></p>
            <div style="border: 1px solid #ccc; height: 40px; margin-bottom: 15px;"></div>
            
            <p><strong>Evidence FOR this thought:</strong></p>
            <div style="border: 1px solid #ccc; height: 80px; margin-bottom: 15px;"></div>
            
            <p><strong>Evidence AGAINST this thought:</strong></p>  
            <div style="border: 1px solid #ccc; height: 80px; margin-bottom: 15px;"></div>
            
            <p><strong>More Balanced Thought:</strong></p>
            <div style="border: 1px solid #ccc; height: 80px; margin-bottom: 15px;"></div>
            
            <p><strong>New Emotion & Intensity (1-10):</strong></p>
            <div style="border: 1px solid #ccc; height: 40px;"></div>
          </div>
        </div>
      `
    },
    {
      title: "Stress Management Action Plan",
      description: "Create a personalized plan for managing stress",
      category: "Stress",
      format: "PDF",
      tags: ["stress", "planning", "management"],
      difficulty: "Intermediate",
      rating: 4.7,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #7c3aed;">Stress Management Action Plan</h1>
          <p style="text-align: center; margin-bottom: 30px;">Develop your personalized stress management strategy</p>
          
          <div style="margin-bottom: 30px;">
            <h3>My Stress Triggers:</h3>
            <div style="border: 1px solid #ccc; height: 100px; margin-bottom: 15px;"></div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3>Warning Signs I'm Getting Stressed:</h3>
            <div style="display: flex; gap: 20px;">
              <div style="flex: 1;">
                <p><strong>Physical:</strong></p>
                <div style="border: 1px solid #ccc; height: 80px;"></div>
              </div>
              <div style="flex: 1;">
                <p><strong>Emotional:</strong></p>
                <div style="border: 1px solid #ccc; height: 80px;"></div>
              </div>
              <div style="flex: 1;">
                <p><strong>Behavioral:</strong></p>
                <div style="border: 1px solid #ccc; height: 80px;"></div>
              </div>
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3>My Stress Management Toolkit:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="border: 1px solid #d1d5db; padding: 10px; text-align: left;">Technique</th>
                  <th style="border: 1px solid #d1d5db; padding: 10px; text-align: left;">When to Use</th>
                  <th style="border: 1px solid #d1d5db; padding: 10px; text-align: left;">How Effective (1-10)</th>
                </tr>
              </thead>
              <tbody>
                ${Array.from({ length: 8 }, (_, i) => `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 10px; height: 40px;"></td>
                    <td style="border: 1px solid #d1d5db; padding: 10px; height: 40px;"></td>
                    <td style="border: 1px solid #d1d5db; padding: 10px; height: 40px;"></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div>
            <h3>Emergency Stress Plan:</h3>
            <p>When I'm feeling overwhelmed, I will:</p>
            <ol>
              <li style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;"></li>
              <li style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;"></li>
              <li style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;"></li>
            </ol>
          </div>
        </div>
      `
    }
  ]
};
