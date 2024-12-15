import { useQuery } from "@tanstack/react-query";
import { fetchAboutInfo } from "@/lib/api";
import { AboutInfo } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const AboutUs = () => {
  const { data: aboutInfo, isLoading } = useQuery<AboutInfo>({
    queryKey: ['about'],
    queryFn: fetchAboutInfo
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!aboutInfo) {
    return <div>No information available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">About Us</h1>
      
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg text-gray-600">{aboutInfo.missionStatement}</p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {aboutInfo.teamMembers.map((member) => (
            <Card key={member.name} className="text-center">
              <CardContent className="pt-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={member.photoUrl} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-gray-500 mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;