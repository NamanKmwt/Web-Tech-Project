require('dotenv').config();
const mongoose = require('mongoose');
const Driver = require('./models/Driver');
const Article = require('./models/Article');
const Race = require('./models/Race');
const RaceTech = require('./models/RaceTech');

const articlesData = [
    // --- Original 3 Articles ---
    {
        title: 'New Era of Racing: 2026 Regulations Revealed',
        excerpt: 'A deep dive into the aerodynamic and power unit changes coming to Formula 1.',
        content: 'Formula 1 stands on the precipice of its most dramatic shift in a generation. The 2026 regulations have finally been codified, bringing a sweeping overhaul to both the power units and the aerodynamic philosophy of the grid.\n\nAt the heart of the change is the power unit. The complex and expensive MGU-H has been permanently retired. In its place, the sport is shifting to a massive increase in electrical power. The new hybrid systems will deliver a near 50/50 power split between the internal combustion engine and the electrical battery, demanding an entirely new approach to energy deployment and lifting and coasting strategies.\n\nAerodynamically, the cars are going on a diet. Shorter wheelbases and a reduction in overall width are designed to make the cars more nimble and raceable on tight street circuits. Furthermore, the introduction of active aerodynamics—where wings shift on the straights to reduce drag and snap back in the braking zones for maximum downforce—promises to revolutionize top speeds and overtaking dynamics.\n\nThe simulation numbers suggest a completely different beast to drive. The question now is: which team has cracked the code?',
        category: 'Tech',
        imageUrl: '/images/tech.png'
    },
    {
        title: 'Hamilton to Ferrari: The Ultimate Challenge',
        excerpt: 'Seven-time world champion begins a new chapter at Maranello.',
        content: 'When the news broke, it shattered the internet. Lewis Hamilton, the driver synonymous with Mercedes-Benz dominance, donning the legendary scarlet of Scuderia Ferrari. It is a move that transcends the sport, pairing its most successful driver with its most historic team.\n\nFor Hamilton, the motivation is clear: the elusive eighth World Championship. But winning at Maranello is a unique beast. The pressure of the Tifosi, the relentless scrutiny of the Italian press, and the internal politics of Ferrari have broken many champions before him. He steps into a garage alongside Charles Leclerc, a generational talent who has long been positioned as Ferrari\'s prince.\n\n"It was a childhood dream," Hamilton remarked when the deal was finalized. But dreams quickly give way to the harsh reality of winter testing and setup battles. Hamilton brings a wealth of development experience and a winning culture that Ferrari has desperately sought since the Schumacher era.\n\nWill this be the ultimate swansong, cementing his status as the undisputed greatest of all time, or will the scarlet dream turn into a chaotic nightmare? The lights are about to go out, and the world is watching.',
        category: 'News',
        imageUrl: '/images/news1.png'
    },
    {
        title: 'Aerodynamics Explained: The Ground Effect',
        excerpt: 'How underfloor tunnels produce massive downforce at high speeds.',
        content: 'To understand modern Formula 1, you must look underneath the car. While the front and rear wings grab the headlines, the true performance differentiator in the current era lies out of sight: the floor.\n\nWelcome to the Ground Effect era. Rather than relying solely on over-body airflow to push the car into the track, teams utilize massive Venturi tunnels sculpted into the underbelly of the chassis. As air is channeled into these tunnels, it compresses and accelerates. According to Bernoulli\'s principle, this rapidly moving air creates an area of extreme low pressure, literally sucking the car to the tarmac.\n\nThe advantage of this system is twofold. First, it generates an immense amount of downforce with relatively little aerodynamic drag compared to a massive rear wing. Second, and most importantly for the fans, it produces less "dirty air." Because the downforce is generated underneath rather than being violently pushed off the top, following cars can stay much closer through high-speed corners without losing their own grip.\n\nHowever, getting it right is a dark art. If the car runs too low, the airflow stalls, leading to the violent bouncing phenomenon known as porpoising. Mastering the floor is the key to unlocking the grid.',
        category: 'Tech',
        imageUrl: '/images/hero.png'
    },

    // --- 5 New Articles Below ---

    {
        title: 'The Dark Art of Tire Management',
        excerpt: 'Understanding thermal degradation and the strategic nightmare of the undercut.',
        content: 'In Formula 1, the fastest car doesn\'t always win. Often, the victory goes to the driver who can whisper to their tires. Pirelli\'s rubber is designed to degrade, adding a volatile strategic element to every Grand Prix. Understanding how to manage these black circles of gold is what separates the good from the great.\n\nTires operate in a microscopic temperature window. Push too hard, and the surface overheats, leading to thermal degradation where the tire essentially melts and loses grip. Drive too slowly, and the core temperature drops, turning the rubber into hard plastic that slides across the tarmac.\n\nThe real battleground is the "undercut." By pitting a lap earlier than the car ahead, a driver gets fresh rubber and an immediate pace advantage of up to two seconds per lap. By the time the rival pits on the next lap, that gap has vanished, and position is lost.\n\nTo counter this, leading drivers must save their tires early in a stint, banking enough rubber to unleash "hammer time" right before their pit window opens. It is a brutal tightrope walk between ultimate pace and ultimate survival.',
        category: 'Tech',
        imageUrl: '/images/tire.png'
    },
    {
        title: 'Monaco Magic: Breaking the Home Curse',
        excerpt: 'A flawless drive through the principality secures a historic, emotional victory.',
        content: 'There is no victory in motorsport quite as sweet—or as stressful—as winning the Monaco Grand Prix. But doing it as a native Monegasque? That elevates a driver from hero to absolute legend. After years of heartbreak, strategic blunders, and mechanical failures, the home curse has finally been broken.\n\nThe weekend was won on Saturday. In a breathtaking qualifying session where the track evolution was rapid, the pole lap was a masterclass in precision. Scraping the barriers at the Swimming Pool chicane and kissing the guardrail at Rascasse, the pole-sitter extracted every millimeter of track limits.\n\nSunday was an exercise in pure tension. With overtaking nearly impossible around the narrow streets, the race became a high-speed game of chess. The undercut threat loomed large, but a perfectly timed pit stop and flawless tire management on the hard compound secured the lead. \n\nAs the checkered flag waved, the emotion on the team radio was raw. The streets of Monte Carlo erupted into a sea of flares and flags. It wasn\'t just a 25-point haul; it was the exorcism of a ghost that has haunted the paddock for years.',
        category: 'Race Report',
        imageUrl: '/images/monaco.jpg'
    },
    {
        title: 'Antonelli Arrives: The Hype is Real',
        excerpt: 'Mercedes\' teenage prodigy makes his mark in a stunning debut season.',
        content: 'The paddock is not easily impressed. It takes a generational talent to silence the skeptics, but Kimi Antonelli has done exactly that. Thrown into the deep end at Mercedes, replacing a seven-time world champion, the teenager has not just survived—he has thrived.\n\nThe hype train has been running at full speed since his karting days, heavily backed by Toto Wolff. Skipping Formula 3 entirely and fast-tracking through F2, many wondered if the jump to F1 machinery was too much, too soon. Those doubts were erased in Q3 of his very first race.\n\nWhat stands out isn\'t just Antonelli\'s raw speed, but his race craft. He battles seasoned veterans with the cold calculation of a driver ten years his senior. His tire management is mature, and his feedback to the engineers is remarkably precise for a rookie.\n\nThere will undoubtedly be growing pains—crashes, strategic errors, and the intense pressure of the global media spotlight. But the flashes of sheer brilliance prove one thing: Mercedes hasn\'t just found a replacement; they have found the future of their franchise.',
        category: 'Feature',
        imageUrl: '/images/antonelli.jpg'
    },
    {
        title: 'Budget Cap Drama: FIA Clamps Down',
        excerpt: 'New financial directives threaten mid-season development plans for top teams.',
        content: 'The battle off the track is currently fiercer than the battle on it. The FIA has issued a sweeping new technical directive regarding the interpretation of the cost cap, sending shockwaves through the engineering departments of the top three teams.\n\nThe directive specifically targets the allocation of staff working on "non-F1" projects—such as hypercars, sailing teams, and advanced technology divisions. Several rival team principals raised concerns that big teams were exploiting a loophole, using these external projects to develop aerodynamic concepts and software that eventually found their way back to the F1 car off the books.\n\nThe FIA\'s new stance dictates that any intellectual property generated outside the F1 division that is transferred back to the team will now be strictly audited and deducted from the $135 million budget cap. \n\nThis mid-season clarification has forced teams to immediately halt several planned upgrade packages. Wind tunnel time is being re-evaluated, and the development race has suddenly hit a massive financial roadblock. The championship might just be decided by the accountants rather than the aerodynamicists.',
        category: 'News',
        imageUrl: '/images/fia.jpeg'
    },
    {
        title: 'Inside the Cockpit: Decoding the Steering Wheel',
        excerpt: 'A look at the $100,000 supercomputers drivers operate at 200 mph.',
        content: 'Calling it a "steering wheel" is the biggest understatement in motorsport. The modern Formula 1 steering wheel is a custom-molded, carbon-fiber supercomputer that costs upwards of $100,000. It is the driver\'s only interface with a highly complex hybrid machine, and mastering it requires the dexterity of a concert pianist.\n\nFeaturing over 25 buttons, rotary dials, and toggle switches, the wheel controls everything from brake bias to differential settings, engine mapping, and radio communications. All of this must be adjusted while experiencing 5G in cornering and vibrating violently down the straights.\n\nOne of the most crucial elements is the "Brake Magic" button. This shifts the brake bias heavily to the front, helping drivers generate massive heat in the front tires during safety car restarts or formation laps. Forgetting to toggle it off before turn one, however, guarantees a massive lockup.\n\nThe central LCD screen feeds live telemetry back to the driver, including delta times, tire temperatures, and energy store levels. Every driver has a custom layout, tailored precisely to how they process data at 200 mph. It is a masterpiece of ergonomic engineering.',
        category: 'Tech',
        imageUrl: '/images/cockpit.jpg'
    }
];


const raceTechByRound = {
    1: {
        roadType: 'permanent',
        carType: 'balanced',
        weatherNow: {
            condition: 'sunny',
            airTempC: 28,
            trackTempC: 42,
            humidityPct: 41,
            windKph: 18,
            rainChancePct: 5
        },
        weatherTrend: [
            { label: 'FP', condition: 'sunny', airTempC: 31, rainChancePct: 0 },
            { label: 'Quali', condition: 'sunny', airTempC: 29, rainChancePct: 2 },
            { label: 'Race', condition: 'mixed', airTempC: 28, rainChancePct: 5 }
        ],
        gripLevel: 73,
        setupHint: 'Rear stability under traction is key in low-speed exits.',
        riskLevel: 'medium'
    },
    2: {
        roadType: 'street',
        carType: 'low-drag',
        weatherNow: {
            condition: 'night',
            airTempC: 30,
            trackTempC: 37,
            humidityPct: 59,
            windKph: 22,
            rainChancePct: 0
        },
        weatherTrend: [
            { label: 'FP', condition: 'sunny', airTempC: 34, rainChancePct: 0 },
            { label: 'Quali', condition: 'night', airTempC: 31, rainChancePct: 0 },
            { label: 'Race', condition: 'night', airTempC: 30, rainChancePct: 0 }
        ],
        gripLevel: 69,
        setupHint: 'Trim wing for top speed while protecting rear tires in dirty air.',
        riskLevel: 'medium'
    },
    3: {
        roadType: 'hybrid',
        carType: 'balanced',
        weatherNow: {
            condition: 'mixed',
            airTempC: 21,
            trackTempC: 29,
            humidityPct: 63,
            windKph: 27,
            rainChancePct: 35
        },
        weatherTrend: [
            { label: 'FP', condition: 'cloudy', airTempC: 20, rainChancePct: 20 },
            { label: 'Quali', condition: 'mixed', airTempC: 22, rainChancePct: 30 },
            { label: 'Race', condition: 'rain', airTempC: 19, rainChancePct: 55 }
        ],
        gripLevel: 62,
        setupHint: 'Keep mechanical compliance high to ride kerbs and changing grip.',
        riskLevel: 'high'
    },
    4: {
        roadType: 'permanent',
        carType: 'high-downforce',
        weatherNow: {
            condition: 'cloudy',
            airTempC: 18,
            trackTempC: 24,
            humidityPct: 51,
            windKph: 16,
            rainChancePct: 18
        },
        weatherTrend: [
            { label: 'FP', condition: 'sunny', airTempC: 19, rainChancePct: 5 },
            { label: 'Quali', condition: 'cloudy', airTempC: 17, rainChancePct: 12 },
            { label: 'Race', condition: 'mixed', airTempC: 18, rainChancePct: 18 }
        ],
        gripLevel: 78,
        setupHint: 'Prioritize front-end confidence through high-speed direction changes.',
        riskLevel: 'low'
    },
    5: {
        roadType: 'street',
        carType: 'low-drag',
        weatherNow: {
            condition: 'storm',
            airTempC: 29,
            trackTempC: 36,
            humidityPct: 76,
            windKph: 31,
            rainChancePct: 68
        },
        weatherTrend: [
            { label: 'FP', condition: 'sunny', airTempC: 32, rainChancePct: 20 },
            { label: 'Quali', condition: 'mixed', airTempC: 30, rainChancePct: 45 },
            { label: 'Race', condition: 'storm', airTempC: 29, rainChancePct: 68 }
        ],
        gripLevel: 57,
        setupHint: 'Build for straight-line speed but leave margin for wet traction.',
        riskLevel: 'high'
    },
    6: {
        roadType: 'street',
        carType: 'high-downforce',
        weatherNow: {
            condition: 'sunny',
            airTempC: 24,
            trackTempC: 33,
            humidityPct: 54,
            windKph: 11,
            rainChancePct: 8
        },
        weatherTrend: [
            { label: 'FP', condition: 'sunny', airTempC: 23, rainChancePct: 4 },
            { label: 'Quali', condition: 'sunny', airTempC: 24, rainChancePct: 6 },
            { label: 'Race', condition: 'mixed', airTempC: 24, rainChancePct: 8 }
        ],
        gripLevel: 76,
        setupHint: 'Maximum rotation and traction for repeated low-speed acceleration zones.',
        riskLevel: 'medium'
    }
};

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB. Seeding data...');

        // Clear existing
        await Driver.deleteMany({});
        await Article.deleteMany({});
        await Race.deleteMany({});
        await RaceTech.deleteMany({});

        // Insert new
        await Article.insertMany(articlesData);
    

        

       

        console.log('🏁 Seeding complete!');
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error for Seeding:', err);
        process.exit(1);
    });
