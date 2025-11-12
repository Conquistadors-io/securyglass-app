import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminProjets = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projets</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion des projets à venir...</p>
      </CardContent>
    </Card>
  );
};
