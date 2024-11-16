import { checkDateStatus } from "@/lib/utils";

type ShowEventsContainerProps = {
  events: Array<EventType> | [];
};

const ShowEventsContainer = ({ events }: ShowEventsContainerProps) => {
  return (
    <div className="w-full max-h-[200px] overflow-y-auto scroll no-scrollbar md:max-w-[360px]  my-2  p-3 flex flex-col gap-2 text-center items-center   ">
      {events.map((event, index) => (
        <div
          key={index}
          className="w-full flex flex-col gap-2 border border-solid boredr-[#222222]/10 rounded p-3 items-start justify-start"
        >
          <div className="flex w-full items-center justify-between">
            <p className="text-sm">{event.title}</p>
            <span
              className={`h-2 w-2 rounded-full ${
                checkDateStatus(event.date_of_event as string)
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            ></span>
          </div>

          <p className="text-sm">
            date {new Date(event.date_of_event as string).toDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ShowEventsContainer;
