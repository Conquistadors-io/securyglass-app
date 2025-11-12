import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminTechniciens = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Techniciens</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion des techniciens à venir...</p>
      </CardContent>
    </Card>
  );
};
