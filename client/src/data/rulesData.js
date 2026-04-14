// Comprehensive Formula 1 Rules and Regulations Dataset
// This file acts as a localized, detailed API equivalent for the Rules page.

export const rulesData = [
  {
    category: "Sporting Regulations",
    icon: "Trophy",
    rules: [
      {
        id: "s1",
        title: "Race Distance & Time",
        content: "A Grand Prix race must be a minimum of 305km (excluding Monaco, which is 260km). The race duration cannot exceed two hours of actual racing time. However, to account for red flags and suspensions, a race has a maximum window of three hours to be completed.",
        tags: ["Race", "Distance", "Time"]
      },
      {
        id: "s2",
        title: "Points System",
        content: "Points are awarded to the top 10 finishers in the main race: 25, 18, 15, 12, 10, 8, 6, 4, 2, 1. An additional point is awarded to the driver with the fastest lap, provided they finish within the top 10.",
        tags: ["Points", "Fastest Lap"]
      },
      {
        id: "s3",
        title: "Qualifying Format",
        content: "Qualifying is split into three segments (Q1, Q2, Q3). Q1 lasts 18 minutes, eliminating the slowest 5 cars. Q2 lasts 15 minutes, eliminating another 5 cars. Q3 is a 12-minute shootout for the top 10 positions.",
        tags: ["Qualifying", "Format"]
      },
      {
        id: "s4",
        title: "Parc Fermé",
        content: "Cars enter 'Parc Fermé' conditions from the moment they first exit the pit lane during Qualifying. Very few modifications can be made to the car from this point until the start of the race. Violating Parc Fermé usually results in a pit lane start.",
        tags: ["Parc Ferme", "Setups"]
      },
      {
        id: "s5",
        title: "Safety Car & Virtual Safety Car",
        content: "When deployed, drivers must reduce speed and strictly adhere to delta times. Overtaking is strictly prohibited. The Virtual Safety Car (VSC) is used for less severe incidents, forcing drivers to match a set sector delta time without bunching up the pack.",
        tags: ["Safety", "VSC"]
      }
    ]
  },
  {
    category: "Technical Regulations",
    icon: "Car",
    rules: [
      {
        id: "t1",
        title: "Power Unit (Engine)",
        content: "Cars must use a 1.6-litre V6 turbocharged hybrid power unit. Each driver is strictly limited to four Internal Combustion Engines (ICE), MGU-K, MGU-H, and Turbochargers per season. Exceeding this limit incurs grid penalties.",
        tags: ["Engine", "Power Unit", "Hybrid"]
      },
      {
        id: "t2",
        title: "Minimum Weight & Ballast",
        content: "The minimum weight of the car, including the driver but excluding fuel, is 798 kg. If a driver is lighter than 80 kg, ballast must be added in the cockpit area to ensure smaller drivers do not have an unfair aerodynamic advantage.",
        tags: ["Weight", "Driver", "Ballast"]
      },
      {
        id: "t3",
        title: "Aerodynamics & Ground Effect",
        content: "The current rules emphasize 'ground effect' aerodynamics, generating downforce from the floor to allow cars to follow closer with less 'dirty air'. Strict limitations apply to the dimensions of the front and rear wings.",
        tags: ["Aerodynamics", "Wings", "Floor"]
      },
      {
        id: "t4",
        title: "Tyre Allocations",
        content: "Pirelli supplies three slick compounds (Soft, Medium, Hard) per race weekend, alongside Intermediates and Wets. Every driver receives 13 sets of slicks per weekend. In a dry race, a driver must use at least two different slick compounds, necessitating at least one pit stop.",
        tags: ["Tyres", "Pirelli", "Pit Stop"]
      },
      {
        id: "t5",
        title: "Drag Reduction System (DRS)",
        content: "The DRS allows the rear wing flap to open to reduce drag and increase top speed. It can only be activated in designated zones, and only when a driver is within one second of the car ahead at the detection point.",
        tags: ["DRS", "Overtaking", "Wings"]
      }
    ]
  },
  {
    category: "Drivers & Competitors",
    icon: "Users",
    rules: [
      {
        id: "d1",
        title: "FIA Super Licence",
        content: "To compete in Formula 1, a driver must hold an FIA Super Licence. This requires accumulating 40 Super Licence points over a three-year period by participating in junior categories like Formula 2, Formula 3, or IndyCar, and being at least 18 years old.",
        tags: ["Super Licence", "Points", "Age"]
      },
      {
        id: "d2",
        title: "Driver Apparel & Safety",
        content: "Drivers must wear FIA-homologated fireproof underwear, race suits, gloves, and boots. Helmets must pass extensive impact tests, and the HANS (Head and Neck Support) device is mandatory to protect against extreme deceleration injuries.",
        tags: ["Safety", "Apparel", "Helmet"]
      },
      {
        id: "d3",
        title: "Track Limits",
        content: "The track edge is defined by the solid white lines. A driver is deemed to have exceeded track limits if all four wheels are completely over the white line. Multiple offenses during a race result in a black-and-white warning flag, followed by a time penalty.",
        tags: ["Track Limits", "Penalties"]
      },
      {
        id: "d4",
        title: "Defensive Driving & Weaving",
        content: "A defending driver is allowed only one change of direction to defend a position. Weaving on the straights to break a tow or defend aggressively is prohibited and dangerous driving. Moving under braking is also strictly penalized.",
        tags: ["Defending", "Overtaking", "Rules of Engagement"]
      }
    ]
  },
  {
    category: "Teams & Constructors",
    icon: "Shield",
    rules: [
      {
        id: "c1",
        title: "Cost Cap (Financial Regulations)",
        content: "To level the playing field, a strict cost cap limits how much teams can spend on car development and operations. The cap excludes driver salaries and the salaries of the three highest-paid staff members. Breaching the cap can lead to severe fines or championship point deductions.",
        tags: ["Finance", "Cost Cap", "Budget"]
      },
      {
        id: "c2",
        title: "Aerodynamic Testing Restrictions (ATR)",
        content: "Teams are limited in how much wind tunnel time and Computational Fluid Dynamics (CFD) computing power they can use. The limit operates on a sliding scale: the team finishing lowest in the previous championship gets the most testing time, and the champion gets the least.",
        tags: ["Testing", "Wind Tunnel", "CFD"]
      },
      {
        id: "c3",
        title: "Curfew & Personnel Limits",
        content: "Teams are restricted to 60 operational staff members at the circuit. A mandatory curfew prevents teams from working on the cars overnight, ensuring staff welfare. Teams are allowed very few 'jokers' to break the curfew without penalty per season.",
        tags: ["Curfew", "Staff", "Mechanics"]
      }
    ]
  },
  {
    category: "Flags & Signals",
    icon: "Flag",
    rules: [
      {
        id: "f1",
        title: "Yellow Flags",
        content: "Single Yellow: Hazard beside or partly on the track. Drivers must reduce speed and not overtake. Double Yellow: Hazard wholly or partly blocking the track. Drivers must significantly reduce speed, not overtake, and be prepared to change direction or stop.",
        tags: ["Yellow Flag", "Hazard", "Safety"]
      },
      {
        id: "f2",
        title: "Red Flag",
        content: "The session is permanently or temporarily suspended due to extreme weather or a severe accident. Drivers must immediately reduce speed, proceed slowly back to the pit lane, and line up at the pit exit. No overtaking is allowed.",
        tags: ["Red Flag", "Suspension", "Accident"]
      },
      {
        id: "f3",
        title: "Blue Flag",
        content: "During a race, a blue flag indicates that a driver is about to be lapped. The driver being lapped must allow the faster car to pass at the earliest opportunity. Ignoring three successive blue flags leads to a penalty.",
        tags: ["Blue Flag", "Lapped", "Overtaking"]
      },
      {
        id: "f4",
        title: "Black and White Flag",
        content: "Shown with a driver's car number, it acts as a final warning for unsportsmanlike behavior or for exceeding track limits multiple times. Subsequent offenses result in time penalties.",
        tags: ["Warning", "Track Limits"]
      },
      {
        id: "f5",
        title: "Black Flag",
        content: "Disqualification. The driver must return to their pit garage immediately and retire from the race. This is used for severe rule breaches or ignoring serious mechanical failures.",
        tags: ["Disqualification", "Penalty"]
      }
    ]
  }
];
