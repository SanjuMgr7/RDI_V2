require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());


//  1. AI CONFIGURATION

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "your_api_key_goes_here" 
});


//  2. DATABASE ROUTES (PRISMA + NEON)


/**
 * GET /api/applications
 * Fetches all applications and joins the related Student data
 */
app.get('/api/applications', async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        student: true, // Pulls in name, skills, email, etc.
      },
    });
    res.json(applications);
  } catch (err) {
    console.error("Prisma Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});


app.patch('/api/applications/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params; // Express captures this as a String automatically
    
    const updated = await prisma.application.update({
      where: { 
        id: String(id) // Guaranteed to be a String
      },
      data: { 
        status: status 
      },
    });
    
    res.json(updated);
  } catch (err) {
    console.error("Prisma Update Error:", err);
    res.status(500).json({ error: "Failed to update status", details: err.message });
  }
});


//  3. AI ROUTE (WITH RECRUITER SIGN-OFF & JSON MODE)

app.post('/api/ai/draft-email', async (req, res) => {
  try {
    const { candidateName, jobTitle, tone = 'professional', skills = [] } = req.body;

    let toneInstruction = "professional and friendly";
    if (tone === 'casual') toneInstruction = "casual, warm, and welcoming";
    if (tone === 'short') toneInstruction = "extremely brief and direct (2 sentences maximum)";

    const skillsText = skills.length > 0 
      ? `Briefly compliment their background in ${skills.slice(0, 3).join(', ')}.` 
      : '';

    // --- MOCK FALLBACK (If no API Key) ---
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_api_key_goes_here') {
      await new Promise(resolve => setTimeout(resolve, 1200)); 
      
      let mockSubject = `Interview Invitation: ${jobTitle} at RDI`;
      let mockBody = `Hi ${candidateName},\n\nWe were really impressed by your profile${skills.length > 0 ? ` (especially your experience with ${skills[0]})` : ''} and would love to invite you to an interview for the ${jobTitle} position at RDI.\n\nPlease let us know what times work best for you this week.\n\nBest Regards,\nThe RDI Recruitment Team`;
      
      if (tone === 'short') {
        mockSubject = `RDI Interview: ${jobTitle}`;
        mockBody = `Hi ${candidateName}, we'd like to invite you to interview for the ${jobTitle} role. Please let us know your availability.\n\nBest Regards,\nThe RDI Recruitment Team`;
      }

      return res.json({ subject: mockSubject, body: mockBody });
    }

    //  REAL AI CALL (GPT-4o-mini) 
    const prompt = `
      Act as a senior technical recruiter at RDI. 
      Write a ${toneInstruction} email inviting ${candidateName} to a first-round interview for the ${jobTitle} role.
      ${skillsText}
      
      CRITICAL: You must end the email with exactly this sign-off:
      "Best Regards,"
      "The RDI Recruitment Team"
      
      You MUST respond in pure JSON format with exactly two keys:
      "subject": A catchy email subject line.
      "body": The full email body text.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" } 
    });

    const aiData = JSON.parse(response.choices[0].message.content);
    res.json({ subject: aiData.subject, body: aiData.body });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate email" });
  }
});


//  START SERVER

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Prisma connected to Neon`);
  console.log(` AI Engine Status: ${process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_api_key_goes_here' ? 'Active (Real AI)' : 'Active (Mock Mode)'}`);
});