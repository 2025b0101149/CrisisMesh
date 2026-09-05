import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    emergencyType: {
      type: String,
      required: [true, 'Please specify an emergency type'],
      enum: {
        values: [
          'Flood',
          'Fire',
          'Structural Collapse',
          'Medical',
          'Hazardous Materials',
          'Wildfire',
          'Mass Transit',
          'Utility Failure',
          'Other'
        ],
        message: '{VALUE} is not a supported emergency type'
      }
    },
    description: {
      type: String,
      required: [true, 'Please provide an incident description'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters long']
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please provide an incident location/address'],
        trim: true
      },
      sector: {
        type: String,
        required: [true, 'Please select a sector'],
        enum: ['Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5'],
        default: 'Sector 2'
      },
      coordinates: {
        lat: { type: Number, default: 37.7749 },
        lng: { type: Number, default: -122.4194 },
        x: { type: Number, default: 50 },
        y: { type: Number, default: 50 }
      }
    },
    peopleAffected: {
      type: Number,
      default: 0,
      min: [0, 'People affected cannot be negative']
    },
    peopleInjured: {
      type: Number,
      default: 0,
      min: [0, 'Injured count cannot be negative']
    },
    peopleTrapped: {
      type: Number,
      default: 0,
      min: [0, 'Trapped count cannot be negative']
    },
    isMedicalEmergency: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: ''
    },
    contactInfo: {
      name: {
        type: String,
        default: 'Anonymous Citizen',
        trim: true
      },
      phone: {
        type: String,
        default: '',
        trim: true
      },
      isAnonymous: {
        type: Boolean,
        default: false
      }
    },
    priority: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'HIGH'
    },
    priorityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 65
    },
    priorityReasons: {
      type: [String],
      default: []
    },
    priorityBreakdown: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    vulnerablePopulation: {
      hasVulnerable: { type: Boolean, default: false },
      childrenCount: { type: Number, default: 0 },
      elderlyCount: { type: Number, default: 0 },
      disabledCount: { type: Number, default: 0 }
    },
    environmentalConditions: {
      weather: { type: String, default: 'Normal' },
      isNight: { type: Boolean, default: false },
      secondaryHazards: { type: [String], default: [] }
    },
    status: {
      type: String,
      enum: [
        'Active',
        'Dispatched',
        'In Progress',
        'Resolved',
        'reported',
        'verified',
        'assigned',
        'responding',
        'resolved'
      ],
      default: 'Active'
    },
    assignedUnits: {
      type: [String],
      default: []
    },
    requiredResources: {
      type: [String],
      default: []
    },
    aiTriageSummary: {
      type: String,
      default: ''
    },
    // AI Analysis result from Gemini — populated asynchronously after creation
    aiAnalysis: {
      status: {
        type: String,
        enum: ['pending', 'complete', 'failed'],
        default: 'pending'
      },
      severity:         { type: String, default: '' },
      medicalUrgency:   { type: String, default: '' },
      requiredResources: { type: [String], default: [] },
      reasoning:        { type: String, default: '' },
      confidence:       { type: Number, default: 0 },
      analyzedAt:       { type: Date }
    },
    timeline: [
      {
        time:      { type: String, default: 'Just now' },
        event:     { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Virtual for backward-compatible `title`
incidentSchema.virtual('title').get(function () {
  return `${this.emergencyType} Incident at ${this.location.address}`;
});

// Virtual for backward-compatible `id`
incidentSchema.virtual('id').get(function () {
  return this.incidentId || (this._id ? this._id.toString() : '');
});

// Virtual for casualties object
incidentSchema.virtual('casualties').get(function () {
  return {
    injured: this.peopleInjured || 0,
    trapped: this.peopleTrapped || 0,
    critical: 0
  };
});

incidentSchema.set('toJSON', { virtuals: true });
incidentSchema.set('toObject', { virtuals: true });

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;
