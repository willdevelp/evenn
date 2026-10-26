import { z } from "zod";
import { OrderKindSchema, OrderStatusSchema } from "./enums";
import { jsonSchema } from "./shared";

export const OrdersInsertSchema = z.object({
  "buyer_email": z.string().nullable().optional(),
  "buyer_name": z.string().nullable().optional(),
  "buyer_phone": z.string().nullable().optional(),
  "buyer_user_id": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "discount_amount": z.number().optional(),
  "expires_at": z.string().nullable().optional(),
  "fee_amount": z.number().optional(),
  "id": z.string().optional(),
  "kind": OrderKindSchema,
  "metadata": jsonSchema.optional(),
  "order_number": z.string().optional(),
  "organization_id": z.string(),
  "paid_at": z.string().nullable().optional(),
  "platform_commission_amount": z.number().optional(),
  "promo_code_id": z.string().nullable().optional(),
  "status": OrderStatusSchema.optional(),
  "subtotal_amount": z.number(),
  "total_amount": z.number(),
  "updated_at": z.string().optional(),
}).strict();

export const OrdersUpdateSchema = z.object({
  "buyer_email": z.string().nullable().optional(),
  "buyer_name": z.string().nullable().optional(),
  "buyer_phone": z.string().nullable().optional(),
  "buyer_user_id": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "discount_amount": z.number().optional(),
  "expires_at": z.string().nullable().optional(),
  "fee_amount": z.number().optional(),
  "id": z.string().optional(),
  "kind": OrderKindSchema.optional(),
  "metadata": jsonSchema.optional(),
  "order_number": z.string().optional(),
  "organization_id": z.string().optional(),
  "paid_at": z.string().nullable().optional(),
  "platform_commission_amount": z.number().optional(),
  "promo_code_id": z.string().nullable().optional(),
  "status": OrderStatusSchema.optional(),
  "subtotal_amount": z.number().optional(),
  "total_amount": z.number().optional(),
  "updated_at": z.string().optional(),
}).strict();

