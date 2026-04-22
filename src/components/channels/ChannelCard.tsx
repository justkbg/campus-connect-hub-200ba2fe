import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import VerifiedBadge from "./VerifiedBadge";
import ChannelAvatar from "./ChannelAvatar";
import { type Channel, relativeTime, channelTypeLabel } from "@/data/channelsData";

export default function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Link
      to={`/channels/${channel.id}`}
      className="flex items-center gap-3 bg-card rounded-2xl p-3.5 shadow-card hover:shadow-premium transition-shadow active:scale-[0.99]"
    >
      <ChannelAvatar type={channel.type} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[14px] font-semibold text-foreground truncate">
            {channel.name}
          </p>
          {channel.owner.verified && <VerifiedBadge />}
        </div>
        <p className="text-[11px] text-muted-foreground truncate">
          {channelTypeLabel[channel.type]} · {channel.owner.name}
        </p>
        <p className="text-[10px] text-muted-foreground/80 mt-0.5">
          Last active {relativeTime(channel.lastActiveISO)}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </Link>
  );
}
