import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { ScrollArea } from "@src/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "lucide-react";

type Activity = {
	id: string;
	type: "created" | "updated" | "member-joined" | "status-changed" | "comment";
	user?: {
		name: string;
		image?: string;
	};
	message: string;
	timestamp: Date;
};

type ActivityFeedProps = {
	activities?: Activity[];
};

export function ActivityFeed({ activities = [] }: ActivityFeedProps) {
	if (activities.length === 0) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">
					<Activity className="h-6 w-6" />
					Activity
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[300px] pr-4">
					<div className="space-y-4">
						{activities.map((activity) => (
							<div key={activity.id} className="flex gap-3">
								{activity.user ? (
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={activity.user.image || "/placeholder-user.jpg"}
											alt={activity.user.name}
										/>
										<AvatarFallback>
											{activity.user.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
								) : (
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
										<span className="text-xs text-muted-foreground">•</span>
									</div>
								)}
								<div className="flex-1 space-y-1">
									<p className="text-sm">{activity.message}</p>
									<p className="text-xs text-muted-foreground">
										{formatDistanceToNow(activity.timestamp, {
											addSuffix: true,
										})}
									</p>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
