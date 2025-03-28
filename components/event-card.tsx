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
import { imageEndpoint } from "@/helper/api";

import birth from "@/public/photography/birthday.jpeg"; // Local birthday image
import corporate from "@/public/photography/corporate.jpeg"; // Local corporate image
import wedding from "@/public/photography/wedding.jpeg"; // Local wedding image

interface EventCardProps {
  event: EventType;
  index: number;
}

const images = [corporate, birth, wedding];

export default function EventCard({ event, index }: EventCardProps) {
  const { getEvent } = Store.useEvent();
  const description =
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque illo natus cupiditate suscipit. Tempore dolor aspernatur, eos amet voluptate dolorum iusto quasi at, nostrum quaerat eaque totam consequatur nemo adipisci.";
  return (
    <Card className="overflow-hidden bg-primaryBlue/5 dark:bg-primaryBlue/20 border-primaryBlue/20">
      <div className="relative h-48">
        <Image
          src={
            event.image
              ? `${imageEndpoint}/${event.image}`
              : images[index] || birth
          }
          //   src={event.image || "/placeholder.svg"}
          alt={event.eventName}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-primaryOrange">{event.eventName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {/* {event.description} */}
          {description.split(" ").slice(0, 25).join(" ") +
            (description.split(" ").length > 25 ? "..." : "")}
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
