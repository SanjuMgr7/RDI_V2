const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedDatabase = async () => {
  try {
    console.log(' Connecting to Postgres...');
    await prisma.application.deleteMany({});
    await prisma.student.deleteMany({});
    console.log(' Creating 10 Enterprise Candidates...');

    const studentsData = [
      { name: "Bishal Rana", email: "bishalrana@gamil.com", phone: "+358 4098628428", linkedin: "linkedin.com/in/bishalrana", github: "github.com/bishal", semester: 4, domain: "IoT", skills: ["MQTT", "AWS IoT Core", "C++", "Raspberry Pi"] },
      { name: "Bijay Satyal", email: "bijaysatyal45@gmail.com", phone: "+358 4883662949", linkedin: "linkedin.com/in/bijay-satyal-51318134b", github: "github.com/bijay10odiii", semester: 4, domain: "AI Software", skills: ["Python", "AI agent", "LLM", "Flask"] },
      { name: "Petri Sam", email: "sam.c@iit.edu", phone: "+358 7717391037", linkedin: "linkedin.com/in/samchendev", github: "github.com/samchencode", semester: 7, domain: "Software", skills: ["React.js", "Node.js", "PostgreSQL", "Docker"] },
      { name: "David Kim", email: "david.k@iit.edu", phone: "+358 408276374890", linkedin: "linkedin.com/in/davidkim", github: "github.com/dkim-dev", semester: 5, domain: "Software", skills: ["Java", "Spring Boot", "Microservices", "Kubernetes"] },
      { name: "Sagar Smith", email: "jordan.s@iit.edu", phone: "+358 4083617263", linkedin: "linkedin.com/in/jordansmith", github: "github.com/jsmith-sec", semester: 8, domain: "Cybersecurity", skills: ["Penetration Testing", "Wireshark", "CEH", "Network Security"] },
      { name: "Elena Basnet", email: "elena.r@iit.edu", phone: "+358 4072638499", linkedin: "linkedin.com/in/elenarostova", github: "github.com/erostova", semester: 6, domain: "Cybersecurity", skills: ["Cryptography", "Python", "Linux", "Splunk"] },
      { name: "Leo Vinci", email: "leo.v@iit.edu", phone: "+358 75873914629", linkedin: "linkedin.com/in/leovance", github: "github.com/lvance-iot", semester: 7, domain: "IoT", skills: ["Azure IoT", "Sensors", "Arduino", "C"] },
      { name: "John Cena", email: "sarah.j@iit.edu", phone: "+358 40862737649", linkedin: "linkedin.com/in/sarahjenkins", github: "github.com/sjenkins-dev", semester: 8, domain: "Software", skills: ["TypeScript", "Next.js", "Tailwind", "GraphQL"] },
      { name: "Chris Martin", email: "chris.o@iit.edu", phone: "+358 5973579345", linkedin: "linkedin.com/in/chrisoconnor", github: "github.com/coconnor-sec", semester: 5, domain: "Cybersecurity", skills: ["Incident Response", "Malware Analysis", "Python", "Bash"] },
      { name: "Sanju Sinjapati Magar", email: "sanju.mgr52@gmail.com", phone: "+358 4024782555", linkedin: "https://www.linkedin.com/in/sanju-sinjapati-magar", github: "https://github.com/SanjuMgr7", semester: 4, domain: "Frontend Software", skills: ["React", "HTML", "Javascript", "Python"] }
    ];

    const createdStudents = await Promise.all(studentsData.map(s => prisma.student.create({ data: s })));

    console.log(' Creating Applications...');
    const jobs = ["IoT Firmware Engineer", "Edge Architect", "Fullstack Developer", "Backend Intern", "Security Analyst", "SOC Intern", "Hardware Engineer", "Frontend Developer", "Threat Hunter", "Cloud Architect"];
    const statuses = ["Applied", "Interview", "Shortlisted", "Applied", "Interview", "Hired", "Applied", "Shortlisted", "Interview", "Hired"];

    await prisma.application.createMany({
      data: createdStudents.map((student, index) => ({
        studentId: student.id,
        listingTitle: jobs[index],
        status: statuses[index]
      }))
    });

    console.log('Postgres Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error: X', error);
    process.exit(1);
  }
};

seedDatabase();