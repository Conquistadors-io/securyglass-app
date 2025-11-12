import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminDepenses = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dépenses</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion des dépenses à venir...</p>
      </CardContent>
    </Card>
  );
};
