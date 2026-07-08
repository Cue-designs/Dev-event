import mongoose from "mongoose";

export interface EventDocument extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const normalizeSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizeDate = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid event date. Use a valid date string.");
  }
  return parsed.toISOString().slice(0, 10);
};

const normalizeTime = (value: string): string => {
  const trimmed = value.trim();
  const twentyFourHour = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  const amPm = /^(1[0-2]|0?[1-9]):([0-5]\d)\s*([AaPp][Mm])$/;

  if (twentyFourHour.test(trimmed)) {
    return trimmed.padStart(5, "0");
  }

  const match = trimmed.match(amPm);
  if (!match) {
    throw new Error("Invalid event time. Use HH:mm or h:mm AM/PM.");
  }

  const hour = Number(match[1]);
  const minute = match[2];
  const meridiem = match[3].toUpperCase();
  const normalizedHour =
    meridiem === "PM" && hour !== 12
      ? hour + 12
      : meridiem === "AM" && hour === 12
        ? 0
        : hour;
  return `${normalizedHour.toString().padStart(2, "0")}:${minute}`;
};

const isNonEmptyString = (value: unknown): boolean =>
  typeof value === "string" && value.trim().length > 0;

const eventSchema = new mongoose.Schema<EventDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: { validator: isNonEmptyString, message: "Title is required." },
    },
    slug: { type: String, required: true, unique: true, trim: true },
    description: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Description is required.",
      },
    },
    overview: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Overview is required.",
      },
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: { validator: isNonEmptyString, message: "Image is required." },
    },
    venue: {
      type: String,
      required: true,
      trim: true,
      validate: { validator: isNonEmptyString, message: "Venue is required." },
    },
    location: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Location is required.",
      },
    },
    date: {
      type: String,
      required: true,
      trim: true,
      validate: { validator: isNonEmptyString, message: "Date is required." },
    },
    time: {
      type: String,
      required: true,
      trim: true,
      validate: { validator: isNonEmptyString, message: "Time is required." },
    },
    mode: {
      type: String,
      required: true,
      trim: true,
      validate: { validator: isNonEmptyString, message: "Mode is required." },
    },
    audience: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Audience is required.",
      },
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0,
        message: "Agenda is required and must contain at least one item.",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Organizer is required.",
      },
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0,
        message: "Tags are required and must contain at least one item.",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Ensure slug uniqueness at the database level.
eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre<EventDocument>("save", async function () {
  if (this.isModified("title")) {
    const normalized = normalizeSlug(this.title);
    if (!normalized) {
      throw new Error("Slug generation failed. Provide a valid title.");
    }
    this.slug = normalized;
  }

  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

export const Event =
  (mongoose.models.Event as mongoose.Model<EventDocument>) ||
  mongoose.model<EventDocument>("Event", eventSchema);
