import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminFournisseurs = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fournisseurs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion des fournisseurs à venir...</p>
      </CardContent>
    </Card>
  );
};
