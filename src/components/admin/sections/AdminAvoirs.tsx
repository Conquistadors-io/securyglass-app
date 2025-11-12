import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminAvoirs = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avoirs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gestion des avoirs à venir...</p>
      </CardContent>
    </Card>
  );
};
