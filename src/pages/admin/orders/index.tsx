import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { SEO } from "@/components/SEO";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Eye, Package, Clock } from "lucide-react";
import { useRouter } from "next/router";

type Order = Tables<"orders">;

interface OrderWithDetails extends Order {
  order_items?: Array<{
    id: string;
    quantity: number;
    price: number;
    products: {
      name: string;
      image_url: string | null;
    } | null;
  }>;
}

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (
              id,
              quantity,
              price,
              products (
                name,
                image_url
              )
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Greška prilikom ažuriranja statusa");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; color: string }> = {
      pending: { variant: "outline", color: "text-yellow-500 border-yellow-500" },
      processing: { variant: "outline", color: "text-blue-500 border-blue-500" },
      shipped: { variant: "outline", color: "text-cyan-500 border-cyan-500" },
      delivered: { variant: "outline", color: "text-green-500 border-green-500" },
      cancelled: { variant: "destructive", color: "" },
    };

    const config = variants[status] || variants.pending;

    return (
      <Badge variant={config.variant} className={config.color}>
        {status === "pending" && "Na čekanju"}
        {status === "processing" && "U obradi"}
        {status === "shipped" && "Poslano"}
        {status === "delivered" && "Isporučeno"}
        {status === "cancelled" && "Otkazano"}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Upravljanje Narudžbama - ALZA Admin" />

      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/admin")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-3xl font-mono font-bold gradient-blue">
                Upravljanje Narudžbama
              </h1>
            </div>

            <div className="flex gap-4">
              <GlassCard className="flex-1">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ukupne Narudžbe</p>
                    <p className="text-2xl font-mono font-bold">{orders.length}</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="flex-1">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Na čekanju</p>
                    <p className="text-2xl font-mono font-bold">
                      {orders.filter((o) => o.status === "pending").length}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          <GlassCard>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="font-mono">ID Narudžbe</TableHead>
                    <TableHead className="font-mono">Datum</TableHead>
                    <TableHead className="font-mono">Kupac</TableHead>
                    <TableHead className="font-mono">Ukupno</TableHead>
                    <TableHead className="font-mono">Status</TableHead>
                    <TableHead className="font-mono">Promijeni Status</TableHead>
                    <TableHead className="font-mono text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                        Nema narudžbi
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id} className="border-border/30">
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.created_at).toLocaleDateString("bs-BA")}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{order.customer_name}</div>
                            <div className="text-muted-foreground">{order.customer_email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono font-semibold text-primary">
                          {order.total.toFixed(2)} KM
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Na čekanju</SelectItem>
                              <SelectItem value="processing">U obradi</SelectItem>
                              <SelectItem value="shipped">Poslano</SelectItem>
                              <SelectItem value="delivered">Isporučeno</SelectItem>
                              <SelectItem value="cancelled">Otkazano</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="icon"
                            variant="outline"
                            className="border-neon-blue"
                            onClick={() => {
                              setSelectedOrder(order);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-mono text-2xl gradient-blue">
              Detalji Narudžbe
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ID Narudžbe</p>
                  <p className="font-mono">#{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Datum</p>
                  <p>{new Date(selectedOrder.created_at).toLocaleString("bs-BA")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ukupan iznos</p>
                  <p className="text-2xl font-mono font-bold text-primary">
                    {selectedOrder.total.toFixed(2)} KM
                  </p>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4">
                <h3 className="font-mono font-semibold mb-4">Informacije o kupcu</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ime i prezime</p>
                    <p>{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p>{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Telefon</p>
                    <p>{selectedOrder.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Adresa</p>
                    <p>{selectedOrder.shipping_address}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <div className="border-t border-border/50 pt-4">
                  <h3 className="font-mono font-semibold mb-4">Stavke narudžbe</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-mono font-semibold text-primary">
                            {item.quantity}x
                          </div>
                          <div>
                            <p className="font-medium">{item.products?.name || "N/A"}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.price.toFixed(2)} KM po jedinici
                            </p>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-primary">
                          {(item.quantity * item.price).toFixed(2)} KM
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="border-t border-border/50 pt-4">
                  <h3 className="font-mono font-semibold mb-2">Napomene</h3>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}