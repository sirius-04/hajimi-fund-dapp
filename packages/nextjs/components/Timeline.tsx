import { GridItem, ProgramCard } from "./ProgramCard";
import { programList } from "~~/data/dummy1";

const events = [
  {
    date: "Jul 28",
    day: "Monday",
    time: "6:00 PM",
    title: "Devmatch Pre-hackathon Workshop: Blockchain for Good Alliance (BGA)",
    organizer: "By APUBCC",
    location: "Asia Pacific University of Technology & Innovation (APU)",
    status: "Going",
    people: 42,
  },
  {
    date: "May 30",
    day: "Friday",
    time: "6:30 PM",
    title: "MYBW Roadshow x Monash Blockchain",
    organizer: "By Monash Blockchain Club, MY Blockchain Week & L...",
    location: "Monash University Malaysia",
    status: "Invited",
    people: 103,
  },
];

const Timeline = () => {
  return (
    <>
      {programList.map((list, idx) => (
        <div className="flex flex-col py-5 w-full" key={idx}>
          <div key={idx} className="relative flex justify-start">
            {/* Left timeline */}
            <div className="w-28 text-start mr-8">
              <div className="text-lg font-medium">{list.date}</div>
              {/* <div className="text-md text-muted-foreground">{event.day}</div> */}
            </div>

            {/* Dot and Dotted Line */}
            <div className="flex flex-col items-center mx-2 relative">
              {/* Dot */}
              <div className="w-3 h-3 bg-gray-500 rounded-full z-10"></div>

              {/* Dotted line only if not last */}
              <div className="flex-1 border-r-2 border-dotted border-gray-400 mt-1"></div>
            </div>

            {/* Event Card */}
            <div className="flex-1 ml-6 rounded-xl px-4 flex justify-between items-start ">
              <GridItem
                id={list.id}
                description={list.description}
                title={list.title}
                badgeText={list.badgeText}
                contributors={list.contributors}
                date={list.date}
                price={list.price}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Timeline;
