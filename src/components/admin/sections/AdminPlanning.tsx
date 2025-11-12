import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminPlanning = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion du planning à venir...</p>
      </CardContent>
    </Card>
  );
};
