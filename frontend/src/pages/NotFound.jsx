import { Link } from "react-router-dom";
import { Button, EmptyState, AlertTriangleIcon } from "../components/shared";

export default function NotFound() {
  return (
    <EmptyState
      icon={<AlertTriangleIcon width={22} height={22} />}
      title="Page not found"
      description="The page you're looking for doesn't exist or has moved."
      action={
        <Button as={Link} to="/events">
          Back to events
        </Button>
      }
    />
  );
}
