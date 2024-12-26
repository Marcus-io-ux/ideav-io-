import { SearchBar } from "@/components/SearchBar";

export const MessageHeader = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Your Conversations</h1>
        <p className="text-muted-foreground mt-2">
          Chat with collaborators, provide feedback, or discuss ideas in private.
        </p>
      </div>
      <SearchBar onSearch={(query) => console.log("Searching:", query)} />
    </div>
  );
};