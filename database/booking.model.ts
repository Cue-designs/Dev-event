import mongoose from "mongoose";
import { Event } from "./event.model";

export interface BookingDocument extends mongoose.Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const validateEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const bookingSchema = new mongoose.Schema<BookingDocument>(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validateEmail,
        message: "A valid email address is required.",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Index eventId to speed up lookups for event bookings.
bookingSchema.index({ eventId: 1 });

bookingSchema.pre<BookingDocument>("save", async function () {
  if (!this.isModified("eventId") && !this.isNew) {
    return;
  }

  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error("Referenced event does not exist.");
  }
});

export const Booking =
  (mongoose.models.Booking as mongoose.Model<BookingDocument>) ||
  mongoose.model<BookingDocument>("Booking", bookingSchema);
