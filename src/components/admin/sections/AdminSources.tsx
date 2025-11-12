import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminSources = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion des sources de leads à venir...</p>
      </CardContent>
    </Card>
  );
};
