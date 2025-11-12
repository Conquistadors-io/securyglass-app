import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminTravaux = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Travaux</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion des travaux à venir...</p>
      </CardContent>
    </Card>
  );
};
