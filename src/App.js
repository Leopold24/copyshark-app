import React, { useState } from 'react';

function App() {
  const [productDescription, setProductDescription] = useState('');
  const [idealCustomer, setIdealCustomer] = useState('');
  const [copyGoal, setCopyGoal] = useState('');
  const [tone, setTone] = useState('Witty');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generateImages, setGenerateImages] = useState(false);
  const [brandVoice, setBrandVoice] = useState('Custom');
  const [platform, setPlatform] = useState('General');
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [hoveredCopyButton, setHoveredCopyButton] = useState(null);
  const [message, setMessage] = useState('');
  const brandVoices = {
    'Nike': 'Bold, motivational, action-oriented. Use "Just Do It" energy.',
    'Apple': 'Simple, elegant, innovative. Think different approach.',
    'Coca-Cola': 'Happy, sharing, refreshing. Spread joy and connection.',
    'Tesla': 'Revolutionary, sustainable, future-focused. Disrupt everything.',
    'Custom': 'Use the specified tone and style.'
  };

  const platforms = {
    'General': { limit: 500, name: 'General Use', icon: '📝' },
    'Twitter': { limit: 280, name: 'Twitter/X', icon: '🐦' },
    'Instagram': { limit: 2200, name: 'Instagram', icon: '📸' },
    'LinkedIn': { limit: 3000, name: 'LinkedIn', icon: '💼' },
    'Facebook': { limit: 500, name: 'Facebook Ads', icon: '📘' },
    'TikTok': { limit: 150, name: 'TikTok', icon: '🎵' }
  };

  const handleGenerateSpark = () => {
    // console.log('Hi, Dunstan');
    alert('Hi, Dunstan here!');
  }

  const handleGenerate = async () => {
    if (!productDescription) {
      alert("Please describe your product!");
      return;
    }

    setLoading(true);
    setResults([]);

    const brandStyle = brandVoice === 'Custom' ? tone.toLowerCase() : brandVoices[brandVoice];
    const prompt = `Write marketing copy in ${brandStyle} style for: "${productDescription}". Target: ${idealCustomer || 'general audience'}. Goal: ${copyGoal || 'engagement'}. Platform: ${platforms[platform].name} (max ${platforms[platform].limit} characters). Generate 3 variations with character counts as JSON.`;

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  "text": { "type": "STRING" },
                  "characterCount": { "type": "NUMBER" }
                }
              }
            }
          }
        })
      });
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const parsedResults = JSON.parse(result.candidates[0].content.parts[0].text);
        setResults(parsedResults);
      }
    } catch (err) {
      console.error('Error:', err);
      setResults([
        { text: "🔥 Revolutionary product that changes everything! Get yours now! #GameChanger", characterCount: 85 },
        { text: "✨ Don't miss out on this amazing innovation. Your life will never be the same!", characterCount: 92 },
        { text: "🚀 The future is here! Experience the difference today. Limited time offer!", characterCount: 88 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div style={{maxWidth: '28rem', margin: '0 auto'}}>
          <h1 style={{
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            background: 'linear-gradient(45deg, #E50914, #FF6B6B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            🦈 CopyShark
          </h1>
          <p style={{color: '#B3B3B3', marginBottom: '2rem', fontSize: '1.1rem'}}>
            Generate cinematic marketing copy in seconds
          </p>

          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#E5E5E5', marginBottom: '0.5rem'}}>
                Product Description *
              </label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="e.g., A red dress, smart coffee mug, fitness app..."
                style={{
                  width: '100%', 
                  height: '6rem', 
                  padding: '0.75rem 1rem', 
                  border: '1px solid #333', 
                  borderRadius: '0.5rem', 
                  resize: 'none',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <hr style={{ borderColor: '#333', margin: '2rem 0', borderWidth: '1px 0 0 0' }} />
            
            <h3 style={{ color: '#E5E5E5', fontSize: '1rem', marginBottom: '1rem', fontWeight: '600' }}>
              🎯 Audience Targeting
            </h3>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#E5E5E5', marginBottom: '0.5rem'}}>
                Target Customer
              </label>
              <input
                type="text"
                value={idealCustomer}
                onChange={(e) => setIdealCustomer(e.target.value)}
                placeholder="e.g., Fashion-forward women, busy professionals..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #333',
                  borderRadius: '0.5rem',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <hr style={{ borderColor: '#333', margin: '2rem 0', borderWidth: '1px 0 0 0' }} />
            
            <h3 style={{ color: '#E5E5E5', fontSize: '1rem', marginBottom: '1rem', fontWeight: '600' }}>
              🎨 Brand & Style
            </h3>

            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#E5E5E5', marginBottom: '0.5rem'}}>
                Brand Voice 🎯
              </label>
              <select
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #333',
                  borderRadius: '0.5rem',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  fontSize: '0.875rem'
                }}
              >
                {Object.keys(brandVoices).map(voice => (
                  <option key={voice} value={voice} style={{backgroundColor: '#1a1a1a', color: '#fff'}}>{voice}</option>
                ))}
              </select>
              <p style={{fontSize: '0.75rem', color: '#B3B3B3', marginTop: '0.25rem'}}>
                {brandVoices[brandVoice]}
              </p>
            </div>

            <div>
  <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#E5E5E5', marginBottom: '0.5rem'}}>
    Tone 🎤
  </label>
  <select
    value={tone}
    onChange={(e) => setTone(e.target.value)}
    style={{
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #333',
      borderRadius: '0.5rem',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      fontSize: '0.875rem'
    }}
  >
    <option value="Witty">Witty</option>
    <option value="Professional">Professional</option>
    <option value="Bold">Bold</option>
    <option value="Friendly">Friendly</option>
    <option value="Inspirational">Inspirational</option>
  </select>
</div>
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#E5E5E5', marginBottom: '0.5rem'}}>
                Platform Optimizer 📱
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #333',
                  borderRadius: '0.5rem',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  fontSize: '0.875rem'
                }}
              >
                {Object.keys(platforms).map(plat => (
                  <option key={plat} value={plat} style={{backgroundColor: '#1a1a1a', color: '#fff'}}>
                    {platforms[plat].icon} {platforms[plat].name} ({platforms[plat].limit} chars)
                  </option>
                ))}
              </select>
              <p style={{fontSize: '0.75rem', color: '#B3B3B3', marginTop: '0.25rem'}}>
                Optimized for {platforms[platform].name} - Max {platforms[platform].limit} characters
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !productDescription}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              style={{
                width: '100%', 
                padding: '1rem 1.5rem', 
                background: loading 
                  ? '#9ca3af' 
                  : isButtonHovered 
                    ? 'linear-gradient(to right, #1e3a8a, #6b21a8)' 
                    : 'linear-gradient(to right, #2563eb, #9333ea)', 
                color: 'white', 
                fontWeight: '600', 
                borderRadius: '0.5rem', 
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s ease',
                transform: isButtonHovered && !loading ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: isButtonHovered && !loading ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
              }}
            >
              {loading ? '⏳ Generating...' : '🚀 Generate Copy'}
            </button>
          </div>
        </div>
<button
  onClick={handleGenerateSpark}
  disabled={loading}
  style={{
    width: '100%',
    background: '#2563eb',
    color: 'white',
    fontWeight: 'bold',
    padding: '1rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    marginTop: '1rem',
    transition: 'background 0.2s ease',
    opacity: loading ? 0.5 : 1,
    cursor: loading ? 'not-allowed' : 'pointer'
  }}
>
  {loading ? "Generating..." : "Generate Sparks"}
</button>
  </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div style={{maxWidth: '28rem', margin: '0 auto'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#E5E5E5', marginBottom: '1.5rem'}}>Generated Copy</h2>
          
          {results.length === 0 && !loading && (
            <div style={{textAlign: 'center', padding: '4rem 0'}}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>✨</div>
              <p style={{color: '#B3B3B3', fontSize: '1.125rem'}}>Your marketing copy will appear here</p>
              <p style={{color: '#666', fontSize: '0.875rem', marginTop: '0.5rem'}}>Fill out the form and hit generate!</p>
            </div>
          )}

          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {results.map((result, index) => (
              <div key={index} style={{
                backgroundColor: '#1a1a1a', 
                borderRadius: '0.75rem', 
                padding: '1.5rem', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)', 
                border: '1px solid #333'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem'}}>
                  <span style={{
                    background: 'linear-gradient(45deg, #E50914, #FF6B6B)',
                    color: 'white', 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '9999px'
                  }}>
                    Copy #{index + 1}
                  </span>
                  <span style={{color: '#B3B3B3', fontSize: '0.875rem'}}>{result.characterCount} chars</span>
                </div>
                
                <p style={{color: '#E5E5E5', fontSize: '1.125rem', lineHeight: '1.75', marginBottom: '1rem'}}>{result.text}</p>
                
                <button 
                  onClick={() => navigator.clipboard.writeText(result.text)}
                  onMouseEnter={() => setHoveredCopyButton(index)}
                  onMouseLeave={() => setHoveredCopyButton(null)}
                  style={{
                    width: '100%', 
                    padding: '0.5rem 1rem', 
                    backgroundColor: hoveredCopyButton === index ? '#2563eb' : '#333', 
                    color: hoveredCopyButton === index ? 'white' : '#E5E5E5', 
                    borderRadius: '0.5rem', 
                    border: 'none', 
                    fontWeight: '500', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📋 Copy Text
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    // ...existing code...

            {/* End of right-panel */}
      {message && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          background: '#222',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}>
          {message}
        </div>
      )}
    </div> /* End of app-container */
    )

  
}

export default App;