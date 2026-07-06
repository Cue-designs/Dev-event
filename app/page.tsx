import Explorebtn from "@/components/Explorebtn";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/constants";
export default function Home() {
  return (
    <section className="">
      <h1 className="text-center">
        The Hub Of Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <Explorebtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events.map((event) => (
            <li key={event.slug}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
