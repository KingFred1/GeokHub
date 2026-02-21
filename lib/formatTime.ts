// pure/time utilities that work on the server

export function formatTimeShort(dateString?: string): string {
  if (!dateString) return "";
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    else if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    else if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    else if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    else return `${Math.floor(diffInSeconds / 604800)}w`;
  } catch {
    return "";
  }
}
