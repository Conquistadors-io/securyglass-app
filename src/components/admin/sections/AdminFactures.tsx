import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminFactures = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Factures</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion des factures à venir...</p>
      </CardContent>
    </Card>
  );
};
