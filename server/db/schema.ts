import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// User roles enum
export const userRole = ['admin', 'manager', 'customer'] as const;

// 1️⃣ Users Table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: text('role', { enum: userRole }).notNull().default('customer'),
  hotelId: integer('hotel_id').references(() => hotels.id, { onDelete: 'set null' }), // For managers
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

// 2️⃣ Hotels
export const hotels = sqliteTable('hotels', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  location: text('location').notNull(),
  description: text('description'),
  rating: real('rating').default(0),
  image: text('image')
});

// 3️⃣ Rooms
export const rooms = sqliteTable('rooms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hotelId: integer('hotel_id').notNull().references(() => hotels.id, { onDelete: 'cascade' }),
  roomNumber: text('room_number').notNull(),
  type: text('type').notNull(), // e.g., single, double, suite
  price: real('price').notNull(),
  capacity: integer('capacity').notNull(),
  status: text('status').default('available') // available/booked
});

// 4️⃣ Bookings
export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roomId: integer('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out').notNull(),
  status: text('status').default('pending') // pending, confirmed, canceled
});

// 5️⃣ Payments
export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  method: text('method').notNull(), // card, cash, etc.
  status: text('status').default('paid'),
  date: text('date').default(sql`CURRENT_TIMESTAMP`)
});

// 6️⃣ Reviews
export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hotelId: integer('hotel_id').notNull().references(() => hotels.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});