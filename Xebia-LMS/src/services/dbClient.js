// Database wrapper client to sync with Next.js MongoDB API route.
// Automatically falls back to localStorage if MongoDB is unconfigured or offline.

export async function fetchDbData(collectionKey, seedData = []) {
  if (typeof window === "undefined") return seedData;

  try {
    const res = await fetch(`/api/db?collection=${collectionKey}`);
    if (!res.ok) throw new Error("MongoDB API endpoint failed");
    const data = await res.json();
    
    // Seed MongoDB on first call if collection is empty
    if (data.length === 0 && seedData && seedData.length > 0) {
      await saveDbData(collectionKey, seedData);
      return seedData;
    }
    
    return data;
  } catch (error) {
    // Fallback to client-side localStorage
    const stored = localStorage.getItem(collectionKey);
    if (!stored) {
      localStorage.setItem(collectionKey, JSON.stringify(seedData));
      return seedData;
    }
    return JSON.parse(stored);
  }
}

export async function saveDbData(collectionKey, data) {
  if (typeof window === "undefined") return;

  try {
    const res = await fetch(`/api/db?collection=${collectionKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("MongoDB API endpoint failed");
  } catch (error) {
    // Fallback to client-side localStorage
    localStorage.setItem(collectionKey, JSON.stringify(data));
  }
}

export async function deleteDbData(collectionKey, id) {
  if (typeof window === "undefined") return;

  try {
    const res = await fetch(`/api/db?collection=${collectionKey}&id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("MongoDB API endpoint failed");
  } catch (error) {
    // Fallback to client-side localStorage
    const stored = localStorage.getItem(collectionKey);
    if (stored) {
      const list = JSON.parse(stored).filter((item) => item.id !== id);
      localStorage.setItem(collectionKey, JSON.stringify(list));
    }
  }
}
