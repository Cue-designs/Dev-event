import Explorebtn from "@/components/Explorebtn";
import EventCard from "@/components/EventCard";
const event = [
  {
    image: "/images/event1.png",
    title: "Event 1",
    slug: "event-1",
    location: "locatio-1",
    date: "Date-1",
    time: "time-1",
  },
  { image: "/images/event2.png", title: "Event 2" },
];
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
          {event.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
