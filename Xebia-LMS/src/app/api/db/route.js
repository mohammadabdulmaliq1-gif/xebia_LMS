import { NextResponse } from "next/server";
import clientPromise from "@/services/mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection");
  if (!collection) {
    return NextResponse.json({ error: "Collection param required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json([], { status: 200 });
    }
    const db = client.db("employeeDB");
    const data = await db.collection(collection).find({}).toArray();
    
    // Convert MongoDB document keys so that Next.js client receives standard serializable objects
    const cleaned = data.map(item => {
      const { _id, ...rest } = item;
      return { id: item.id || _id.toString(), ...rest };
    });

    return NextResponse.json(cleaned);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection");
  if (!collection) {
    return NextResponse.json({ error: "Collection param required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ success: true, note: "MongoDB not configured; request skipped." });
    }
    const db = client.db("employeeDB");

    if (Array.isArray(body)) {
      // Overwrite/reseed collection
      await db.collection(collection).deleteMany({});
      if (body.length > 0) {
        const itemsToInsert = body.map(item => {
          const { id, ...rest } = item;
          return { id: id || Math.random().toString(36).substring(2, 9), ...rest };
        });
        await db.collection(collection).insertMany(itemsToInsert);
      }
    } else {
      // Upsert single document
      const { id } = body;
      if (id) {
        await db.collection(collection).updateOne(
          { id },
          { $set: body },
          { upsert: true }
        );
      } else {
        const newId = Math.random().toString(36).substring(2, 9);
        await db.collection(collection).insertOne({ id: newId, ...body });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection");
  const id = searchParams.get("id");
  
  if (!collection || !id) {
    return NextResponse.json({ error: "Collection and ID params required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ success: true, note: "MongoDB not configured; delete skipped." });
    }
    const db = client.db("employeeDB");
    await db.collection(collection).deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
