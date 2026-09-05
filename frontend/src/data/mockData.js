/**
 * CrisisMesh Emergency Response Mock Dataset
 * Real-world disaster scenarios, emergency responder units, hospitals, and logistical resources.
 */

export const INITIAL_INCIDENTS = [
  {
    id: 'INC-8492',
    title: 'Flash Flood & Stranded Families in Residential Sector',
    category: 'Flood',
    priority: 'CRITICAL',
    status: 'In Progress',
    location: {
      address: '442 Riverside Way, Lowland Basin',
      sector: 'Sector 4',
      coordinates: { x: 38, y: 62 },
      lat: 37.7749,
      lng: -122.4194
    },
    reportedAt: '12 mins ago',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    reporter: {
      name: 'Elena Rostova',
      phone: '+1 (555) 234-5678',
      verified: true
    },
    casualties: {
      injured: 4,
      trapped: 14,
      critical: 2
    },
    assignedUnits: [
      'Swiftwater Rescue Team 2',
      'Ambulance MED-04',
      'Drone Surveillance Unit Bravo'
    ],
    requiredResources: [
      'Inflatable Rescue Boats (2)',
      'Hypothermia Warming Kits (20)',
      'High-Clearance Evacuation Truck (1)'
    ],
    aiTriageSummary:
      'Gemini Triage Model: Rapid water level surge (6.2 ft) threatening 3 residential structures. Immediate extraction required before secondary embankment rupture.',
    timeline: [
      { time: '12m ago', event: 'Incident reported via citizen mobile dispatch portal' },
      { time: '10m ago', event: 'Gemini AI evaluated high structural threat; escalated to CRITICAL' },
      { time: '8m ago', event: 'Swiftwater Rescue Team 2 dispatched from Station 04' },
      { time: '3m ago', event: 'Ambulance MED-04 arrived at Sector 4 staging perimeter' }
    ]
  },
  {
    id: 'INC-8493',
    title: 'Multi-Vehicle Collision with Chemical Fuel Spill',
    category: 'Hazardous Materials',
    priority: 'CRITICAL',
    status: 'Active',
    location: {
      address: 'Highway 101 Northbound & Exit 28 Overpass',
      sector: 'Sector 1',
      coordinates: { x: 68, y: 25 },
      lat: 37.7833,
      lng: -122.4167
    },
    reportedAt: '24 mins ago',
    timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    reporter: {
      name: 'Officer D. Martinez (Highway Patrol)',
      phone: '+1 (555) 890-1234',
      verified: true
    },
    casualties: {
      injured: 7,
      trapped: 3,
      critical: 3
    },
    assignedUnits: [
      'Hazmat Unit 01',
      'Engine 14',
      'Ambulance MED-01',
      'Ambulance MED-02'
    ],
    requiredResources: [
      'Foam Fire Suppression Unit (1)',
      'Chemical Neutralizing Agent (500L)',
      'Mobile Trauma Stretcher Units (4)'
    ],
    aiTriageSummary:
      'Gemini Triage Model: Flammable hydrocarbon plume detected. Risk of ignition within 150m radius. Recommend immediate 400m perimeter lockdown and evacuation.',
    timeline: [
      { time: '24m ago', event: 'Highway patrol triggered direct emergency priority broadcast' },
      { time: '20m ago', event: 'Chemical hazard confirmed; Hazmat Unit 01 assigned' },
      { time: '14m ago', event: 'Northbound traffic diverted to alternate secondary artery' }
    ]
  },
  {
    id: 'INC-8494',
    title: 'Commercial Complex Structural Collapse after Seismic Tremor',
    category: 'Structural Collapse',
    priority: 'CRITICAL',
    status: 'In Progress',
    location: {
      address: '710 Grand Plaza Boulevard',
      sector: 'Sector 2',
      coordinates: { x: 52, y: 44 },
      lat: 37.7651,
      lng: -122.4312
    },
    reportedAt: '45 mins ago',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    reporter: {
      name: 'Security Chief Marcus Vance',
      phone: '+1 (555) 345-9876',
      verified: true
    },
    casualties: {
      injured: 18,
      trapped: 8,
      critical: 5
    },
    assignedUnits: [
      'Urban Search & Rescue Alpha',
      'K9 Search Unit 3',
      'Ambulance MED-08',
      'Heavy Heavy Crane 02'
    ],
    requiredResources: [
      'Acoustic Listening Devices (4)',
      'Shoring Timber & Pneumatic Struts',
      'Emergency Blood Reserve Packets (O-)'
    ],
    aiTriageSummary:
      'Gemini Triage Model: Structural pancaking of levels 1 and 2. Void spaces identified along western concrete pillars. K9 sweep in progress.',
    timeline: [
      { time: '45m ago', event: 'Seismic monitor alarm triggered automatic incident creation' },
      { time: '38m ago', event: 'USAR Alpha deployed on scene with thermal imaging' },
      { time: '22m ago', event: '3 trapped victims extricated and transferred to Metro Central Hospital' },
      { time: '5m ago', event: 'Secondary structural stability scan verified by engineering team' }
    ]
  },
  {
    id: 'INC-8495',
    title: 'Brush Wildfire Approaching Timberland Subdivision',
    category: 'Wildfire',
    priority: 'HIGH',
    status: 'Active',
    location: {
      address: 'Pinecrest Ridge & Ridgeview Road',
      sector: 'Sector 5',
      coordinates: { x: 82, y: 78 },
      lat: 37.7505,
      lng: -122.4089
    },
    reportedAt: '35 mins ago',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    reporter: {
      name: 'Lookout Tower 7 (Forestry Division)',
      phone: '+1 (555) 776-5432',
      verified: true
    },
    casualties: {
      injured: 1,
      trapped: 0,
      critical: 0
    },
    assignedUnits: [
      'Wildland Fire Crew 07',
      'Helitack Water Dropper 01'
    ],
    requiredResources: [
      'Bulldozer Firebreak Crew (2)',
      'Smoke Inhalation Relief Station (1)'
    ],
    aiTriageSummary:
      'Gemini Triage Model: Wind gusts 24 mph NW driving fire front toward 60 residential parcels. Evacuation warning zone expanding southward.',
    timeline: [
      { time: '35m ago', event: 'Thermal satellite anomaly detected' },
      { time: '28m ago', event: 'Wildland Crew 07 deployed to create defensible perimeter' }
    ]
  },
  {
    id: 'INC-8496',
    title: 'Substation Electrical Fire & Grid Outage',
    category: 'Utility Failure',
    priority: 'HIGH',
    status: 'Dispatched',
    location: {
      address: 'Westlake Power Grid Substation 12',
      sector: 'Sector 3',
      coordinates: { x: 22, y: 35 },
      lat: 37.7911,
      lng: -122.4255
    },
    reportedAt: '18 mins ago',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    reporter: {
      name: 'Grid Operations Center',
      phone: '+1 (555) 112-9988',
      verified: true
    },
    casualties: {
      injured: 2,
      trapped: 0,
      critical: 1
    },
    assignedUnits: [
      'Engine 09',
      'Utility Specialist Crew 4',
      'Ambulance MED-06'
    ],
    requiredResources: [
      'Mobile Diesel Backup Generators (3)',
      'CO2 Extinguishing System'
    ],
    aiTriageSummary:
      'Gemini Triage Model: High-voltage transformer ruptured. St. Jude Regional Hospital operating on backup generators; urgent priority to prevent clinic outage.',
    timeline: [
      { time: '18m ago', event: 'Telemetry telemetry failure reported by Grid Operations' },
      { time: '12m ago', event: 'Engine 09 dispatched with dry chemical extinguishers' }
    ]
  },
  {
    id: 'INC-8497',
    title: 'Mass Transit Subway Smoke Inhalation & Power Cut',
    category: 'Mass Transit',
    priority: 'HIGH',
    status: 'In Progress',
    location: {
      address: 'Central Metro Station Underground Track 3',
      sector: 'Sector 2',
      coordinates: { x: 48, y: 55 },
      lat: 37.7689,
      lng: -122.4201
    },
    reportedAt: '52 mins ago',
    timestamp: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
    reporter: {
      name: 'Station Controller Brian O’Connor',
      phone: '+1 (555) 667-3322',
      verified: true
    },
    casualties: {
      injured: 12,
      trapped: 0,
      critical: 1
    },
    assignedUnits: [
      'Transit Rescue Team 1',
      'Ambulance MED-11',
      'Ambulance MED-12'
    ],
    requiredResources: [
      'Oxygen Resuscitator Banks (6)',
      'Ventilation Blowers (4)'
    ],
    aiTriageSummary:
      'Gemini Triage Model: Smoke clearing in progress. 85 passengers evacuated to street level. Remaining paramedic triage station established on concourse.',
    timeline: [
      { time: '52m ago', event: 'Brake friction smoke reported on inbound transit train' },
      { time: '40m ago', event: 'Underground power locked out for responder safety' },
      { time: '15m ago', event: 'Primary evacuation completed' }
    ]
  },
  {
    id: 'INC-8498',
    title: 'Elderly Care Facility Heating & Oxygen Supply Emergency',
    category: 'Medical Facility',
    priority: 'HIGH',
    status: 'Active',
    location: {
      address: '88 Heritage Oaks Terrace',
      sector: 'Sector 4',
      coordinates: { x: 32, y: 75 },
      lat: 37.7602,
      lng: -122.4411
    },
    reportedAt: '1 hour ago',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    reporter: {
      name: 'Nurse Administrator Clara Hill',
      phone: '+1 (555) 443-8877',
      verified: true
    },
    casualties: {
      injured: 0,
      trapped: 0,
      critical: 4
    },
    assignedUnits: [
      'Mobile Medical Reserve 02',
      'Logistics Transport 05'
    ],
    requiredResources: [
      'Portable Medical Oxygen Cylinders (12)',
      'Space Heating Units (8)'
    ],
    aiTriageSummary:
      'Gemini Triage Model: Critical vulnerabilities among 34 elderly residents. 4 patients require continuous motorized oxygen concentrators.',
    timeline: [
      { time: '60m ago', event: 'Facility administrator called priority dispatch' },
      { time: '35m ago', event: 'Emergency oxygen reserve vehicle en route' }
    ]
  },
  {
    id: 'INC-8499',
    title: 'Urban Flash Flood & Vehicle Submersion',
    category: 'Flood',
    priority: 'MEDIUM',
    status: 'Resolved',
    location: {
      address: 'Waterfront Underpass at 5th St',
      sector: 'Sector 4',
      coordinates: { x: 42, y: 70 },
      lat: 37.7555,
      lng: -122.4222
    },
    reportedAt: '2 hours ago',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    reporter: {
      name: 'Anonymous Motorist',
      phone: '+1 (555) 009-8811',
      verified: false
    },
    casualties: {
      injured: 0,
      trapped: 0,
      critical: 0
    },
    assignedUnits: [
      'Engine 03',
      'Tow Specialist 01'
    ],
    requiredResources: [
      'Submersible Water Pump (1)'
    ],
    aiTriageSummary:
      'Gemini Triage Model: Vehicle successfully towed; driver relocated safely. Water subsided below curb level.',
    timeline: [
      { time: '2h ago', event: 'Citizen reported submerged sedan in underpass' },
      { time: '1h 15m ago', event: 'Driver escorted to safety by patrol' },
      { time: '30m ago', event: 'Incident closed; road reopened' }
    ]
  }
];

export const HOSPITALS = [
  {
    id: 'HOSP-01',
    name: 'Metro Central Trauma Center',
    sector: 'Sector 2',
    coordinates: { x: 50, y: 40 },
    distance: '2.4 km',
    traumaLevel: 'Level 1 Trauma',
    totalBeds: 340,
    availableBeds: 48,
    icuTotal: 60,
    icuAvailable: 6,
    status: 'Near Capacity',
    helipad: true,
    specialties: ['Burn Center', 'Neurotrauma', 'Cardiovascular Surgery'],
    contact: '+1 (555) 911-1000'
  },
  {
    id: 'HOSP-02',
    name: 'St. Jude Regional Emergency Hospital',
    sector: 'Sector 3',
    coordinates: { x: 28, y: 32 },
    distance: '4.8 km',
    traumaLevel: 'Level 2 Trauma',
    totalBeds: 210,
    availableBeds: 62,
    icuTotal: 35,
    icuAvailable: 11,
    status: 'Normal',
    helipad: true,
    specialties: ['Pediatric Emergency', 'Toxicology & Hazmat', 'Orthopedic Surgery'],
    contact: '+1 (555) 911-2000'
  },
  {
    id: 'HOSP-03',
    name: 'Memorial Valley Community Hospital',
    sector: 'Sector 4',
    coordinates: { x: 36, y: 68 },
    distance: '6.1 km',
    traumaLevel: 'Level 3 Emergency',
    totalBeds: 150,
    availableBeds: 45,
    icuTotal: 20,
    icuAvailable: 8,
    status: 'Normal',
    helipad: false,
    specialties: ['Acute Care', 'Hypothermia Protocols', 'Decontamination'],
    contact: '+1 (555) 911-3000'
  },
  {
    id: 'HOSP-04',
    name: 'Highland Crest Surgical Center',
    sector: 'Sector 1',
    coordinates: { x: 74, y: 22 },
    distance: '7.9 km',
    traumaLevel: 'Level 2 Trauma',
    totalBeds: 180,
    availableBeds: 22,
    icuTotal: 30,
    icuAvailable: 3,
    status: 'Critical Load',
    helipad: true,
    specialties: ['Hyperbaric Chamber', 'Thoracic Trauma', 'Blood Bank'],
    contact: '+1 (555) 911-4000'
  },
  {
    id: 'HOSP-05',
    name: 'South Bay Triage & Rehabilitation Clinic',
    sector: 'Sector 5',
    coordinates: { x: 80, y: 72 },
    distance: '11.2 km',
    traumaLevel: 'Urgent Care & Triage',
    totalBeds: 90,
    availableBeds: 39,
    icuTotal: 10,
    icuAvailable: 5,
    status: 'Normal',
    helipad: false,
    specialties: ['Minor Trauma', 'Respiratory Support', 'Disaster Sheltering'],
    contact: '+1 (555) 911-5000'
  }
];

export const AMBULANCES = [
  { id: 'MED-01', type: 'ALS (Advanced Life Support)', crew: 'Paramedic Hayes & EMT Vance', sector: 'Sector 1', status: 'Dispatched', fuel: '88%', battery: 'Optimal', hospitalTarget: 'Highland Crest' },
  { id: 'MED-02', type: 'ALS (Advanced Life Support)', crew: 'Paramedic Gomez & EMT Zhang', sector: 'Sector 1', status: 'Dispatched', fuel: '92%', battery: 'Optimal', hospitalTarget: 'Metro Central' },
  { id: 'MED-03', type: 'BLS (Basic Life Support)', crew: 'EMT Reynolds & EMT Patel', sector: 'Sector 2', status: 'Available', fuel: '100%', battery: 'Optimal', hospitalTarget: 'Staging Area A' },
  { id: 'MED-04', type: 'ALS (Advanced Life Support)', crew: 'Paramedic Kim & EMT Davis', sector: 'Sector 4', status: 'On Scene', fuel: '74%', battery: 'Optimal', hospitalTarget: 'Memorial Valley' },
  { id: 'MED-05', type: 'Critical Care Transport', crew: 'Flight Nurse Ross & Paramedic Miller', sector: 'Sector 2', status: 'Available', fuel: '95%', battery: 'Optimal', hospitalTarget: 'Metro Central' },
  { id: 'MED-06', type: 'ALS (Advanced Life Support)', crew: 'Paramedic Becker & EMT Silva', sector: 'Sector 3', status: 'Dispatched', fuel: '82%', battery: 'Optimal', hospitalTarget: 'St. Jude Hospital' },
  { id: 'MED-07', type: 'BLS (Basic Life Support)', crew: 'EMT Johnson & EMT Cox', sector: 'Sector 3', status: 'Available', fuel: '89%', battery: 'Optimal', hospitalTarget: 'St. Jude Hospital' },
  { id: 'MED-08', type: 'ALS (Advanced Life Support)', crew: 'Paramedic Foster & EMT Chen', sector: 'Sector 2', status: 'On Scene', fuel: '68%', battery: 'Warning', hospitalTarget: 'Metro Central' },
  { id: 'MED-09', type: 'BLS (Basic Life Support)', crew: 'EMT Wilson & EMT Harris', sector: 'Sector 4', status: 'Available', fuel: '94%', battery: 'Optimal', hospitalTarget: 'Staging Area D' },
  { id: 'MED-10', type: 'Bariatric / Multi-Patient', crew: 'Paramedic Price & EMT Taylor', sector: 'Sector 5', status: 'Available', fuel: '91%', battery: 'Optimal', hospitalTarget: 'South Bay Triage' },
  { id: 'MED-11', type: 'ALS (Advanced Life Support)', crew: 'Paramedic Martin & EMT Clark', sector: 'Sector 2', status: 'On Scene', fuel: '62%', battery: 'Optimal', hospitalTarget: 'Metro Central' },
  { id: 'MED-12', type: 'BLS (Basic Life Support)', crew: 'EMT Lewis & EMT Walker', sector: 'Sector 2', status: 'On Scene', fuel: '79%', battery: 'Optimal', hospitalTarget: 'Metro Central' },
  { id: 'MED-13', type: 'ALS (Advanced Life Support)', crew: 'Paramedic Hall & EMT Allen', sector: 'Sector 1', status: 'Available', fuel: '85%', battery: 'Optimal', hospitalTarget: 'Station 1 Base' },
  { id: 'MED-14', type: 'BLS (Basic Life Support)', crew: 'EMT Young & EMT King', sector: 'Sector 5', status: 'Available', fuel: '96%', battery: 'Optimal', hospitalTarget: 'South Bay Base' },
  { id: 'MED-15', type: 'BLS (Basic Life Support)', crew: 'EMT Wright & EMT Scott', sector: 'Sector 3', status: 'Available', fuel: '90%', battery: 'Optimal', hospitalTarget: 'Station 3 Base' },
  { id: 'MED-16', type: 'ALS (Advanced Life Support)', crew: 'Paramedic Green & EMT Baker', sector: 'Sector 4', status: 'Available', fuel: '93%', battery: 'Optimal', hospitalTarget: 'Station 4 Base' }
];

export const RESCUE_TEAMS = [
  { id: 'TEAM-USAR-A', name: 'Urban Search & Rescue Alpha', specialty: 'Structural Collapse & Heavy Extrication', personnel: 14, status: 'Deployed', sector: 'Sector 2', assignedIncident: 'INC-8494' },
  { id: 'TEAM-WATER-2', name: 'Swiftwater Rescue Team 2', specialty: 'Floodwater & Marine Extraction', personnel: 8, status: 'Deployed', sector: 'Sector 4', assignedIncident: 'INC-8492' },
  { id: 'TEAM-HAZ-01', name: 'Regional Hazmat Response 01', specialty: 'Toxic Spill & Radiation Neutralization', personnel: 10, status: 'Deployed', sector: 'Sector 1', assignedIncident: 'INC-8493' },
  { id: 'TEAM-WILD-07', name: 'Wildland Forestry Crew 07', specialty: 'Wildfire Containment & Firebreaks', personnel: 16, status: 'Deployed', sector: 'Sector 5', assignedIncident: 'INC-8495' },
  { id: 'TEAM-K9-03', name: 'Canine Search Unit 3', specialty: 'Live Victim Scent & Rubble Search', personnel: 6, status: 'Deployed', sector: 'Sector 2', assignedIncident: 'INC-8494' },
  { id: 'TEAM-TRANS-1', name: 'Metro Transit Emergency Squad', specialty: 'Underground Tunnel & Rail Extraction', personnel: 12, status: 'Deployed', sector: 'Sector 2', assignedIncident: 'INC-8497' },
  { id: 'TEAM-ANGLE-1', name: 'High-Angle Rope Rescue 1', specialty: 'Cliff, Crane & High-Rise Operations', personnel: 8, status: 'Standby', sector: 'Sector 1', assignedIncident: null },
  { id: 'TEAM-USAR-B', name: 'Urban Search & Rescue Bravo', specialty: 'Rubble Trenching & Seismic Search', personnel: 14, status: 'Standby', sector: 'Sector 3', assignedIncident: null }
];

export const SUPPLIES_INVENTORY = [
  { id: 'SUP-01', name: 'Zodiac Inflatable Rescue Boats', category: 'Marine', total: 12, inUse: 5, available: 7, unit: 'Boats', location: 'Logistics Depot South' },
  { id: 'SUP-02', name: 'Mobile Diesel Generators (50kW)', category: 'Power', total: 20, inUse: 9, available: 11, unit: 'Units', location: 'Central Grid Yard' },
  { id: 'SUP-03', name: 'Emergency Trauma Field Kits', category: 'Medical', total: 250, inUse: 84, available: 166, unit: 'Kits', location: 'Metro Medical Warehouse' },
  { id: 'SUP-04', name: 'Satellite Starlink Emergency Nodes', category: 'Comms', total: 35, inUse: 18, available: 17, unit: 'Nodes', location: 'Telecommunications Command' },
  { id: 'SUP-05', name: 'Pneumatic Structural Shoring Struts', category: 'Extrication', total: 60, inUse: 28, available: 32, unit: 'Sets', location: 'Fire Station 02 Annex' },
  { id: 'SUP-06', name: 'Hypothermia Thermal Survival Blankets', category: 'Relief', total: 1500, inUse: 420, available: 1080, unit: 'Units', location: 'Red Cross Depot' }
];

export const HAZARD_ZONES = [
  {
    id: 'HZ-FLOOD-01',
    name: 'Sector 4 Lowland Basin Inundation Zone',
    type: 'Flood Hazard',
    severity: 'Extreme',
    waterDepth: '6.2 ft',
    perimeterArea: '3.4 sq km',
    coordinates: { x: 38, y: 65, radius: 18 },
    activeWarnings: 'Immediate Evacuation Order (EOC-Level 3)'
  },
  {
    id: 'HZ-FIRE-01',
    name: 'Sector 5 Pinecrest Wildfire Perimeter',
    type: 'Fire Hazard',
    severity: 'High',
    waterDepth: 'N/A',
    perimeterArea: '5.8 sq km',
    coordinates: { x: 84, y: 78, radius: 15 },
    activeWarnings: 'Red Flag Firestorm Warning - Wind 24 mph NW'
  },
  {
    id: 'HZ-HAZMAT-01',
    name: 'Sector 1 Highway 101 Chemical Evacuation Corridor',
    type: 'Toxic Plume',
    severity: 'Critical',
    waterDepth: 'N/A',
    perimeterArea: '1.2 sq km',
    coordinates: { x: 68, y: 25, radius: 12 },
    activeWarnings: 'In-Place Shelter Advisory / Highway Closed'
  }
];
