import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminCGV = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conditions Générales de Vente</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion des CGV à venir...</p>
      </CardContent>
    </Card>
  );
};
