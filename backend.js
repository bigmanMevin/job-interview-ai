const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

console.log('Starting backend server...');

// Check what models are available
async function checkModels() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    const data = await response.json();
    
    console.log('\n📦 Available Ollama models:');
    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        console.log(`   - ${model.name}`);
      });
      return data.models[0].name; // Return first available model
    } else {
      console.log('   ❌ No models found!');
      console.log('   Run: ollama pull llama3.2');
      return null;
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to Ollama');
    console.log('   Make sure Ollama is running!');
    return null;
  }
}

let availableModel = null;

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    status: 'Backend is working!',
    model: availableModel 
  });
});

// Main endpoint
app.post('/api/generate', async (req, res) => {
  console.log('\n=== NEW REQUEST ===');
  
  try {
    const { prompt } = req.body;
    
    if (!availableModel) {
      throw new Error('No Ollama model available. Run: ollama pull llama3.2');
    }
    
    console.log(`Using model: ${availableModel}`);
    console.log('Calling Ollama...');
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: availableModel,
        prompt: prompt,
        stream: false
      })
    });

    console.log('Ollama status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error response:', errorText);
      throw new Error(`Ollama error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.response) {
      throw new Error('Ollama returned empty response');
    }
    
    console.log('✅ Success! Response length:', data.response.length);
    res.json({ response: data.response });
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, async () => {
  console.log('\n========================================');
  console.log('✅ BACKEND IS RUNNING!');
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log('========================================');
  
  // Check available models
  availableModel = await checkModels();
  
  if (availableModel) {
    console.log(`\n✅ Ready to use model: ${availableModel}`);
  } else {
    console.log('\n⚠️  No models found! Install one with:');
    console.log('   ollama pull llama3.2');
  }
  
  console.log('\nTest: http://localhost:3001/test');
  console.log('========================================\n');
});