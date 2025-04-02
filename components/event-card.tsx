import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventType } from "@/types";
import Store from "@/helper/store";

interface EventCardProps {
  event: EventType;
}

export default function EventCard({ event }: EventCardProps) {
  const { getEvent } = Store.useEvent();
  return (
    <Card className="overflow-hidden bg-primaryBlue/5 dark:bg-primaryBlue/20 border-primaryBlue/20">
      <div className="relative h-48">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.eventName}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-primaryOrange">{event.eventName}</CardTitle>
      </CardHeader>
      <CardContent className="block h-[10em]">
        <p className="text-sm text-muted-foreground text-justify ">
          {event.description &&
            event.description.split(" ").slice(0, 50).join(" ") +
              (event.description.split(" ").length > 50 ? "..." : "")}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/event/${event._id}`}
          onClick={() => getEvent(event._id as string)}
          className="w-full justify-end flex"
        >
          <Button className="w-fit bg-primaryOrange hover:bg-primaryOrange/90 text-white">
            View Packages
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
