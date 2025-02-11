import { instrument } from "@fiberplane/hono-otel";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { createMiddleware as createFiberplane } from "@fiberplane/embedded";
import { apiReference } from '@scalar/hono-api-reference'

import apiSpec from "./apiSpec";
import { serveEmojiFavicon } from "./middleware";
import { mockData } from "./mockData";

type Bindings = {
  FP_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.use("*", serveEmojiFavicon("🎵"));

app.get("/", async (c) => {
  return c.text("** Music Library API **");
});

function hasServers(spec: unknown): spec is { servers: unknown[] } {
  return !!spec && typeof spec === "object" && "servers" in spec && Array.isArray(spec.servers) && spec.servers.length > 0;
}

app.get("/openapi.json", (c) => {
  const origin = new URL(c.req.url).origin;

  // HACK - Allows us to force a server of "localhost:8787" even when the playground SPA is running in dev mode on :6660
  const spec = {
    ...apiSpec,
    servers: hasServers(apiSpec) ? apiSpec.servers : []
  };

  if (origin?.includes('localhost')) {
    spec.servers = [
      {
        url: 'http://localhost:8787',
        description: 'Local development server'
      },
      ...(spec.servers || []),
    ];
  }

  return c.json(spec);
});

app.get(
  '/reference',
  apiReference({
    spec: {
      url: '/openapi.json',
    },
  }),
)

// Artists routes
app.get("/api/artists", (c) => {
  const genre = c.req.query("genre");
  let artists = [...mockData.artists];
  
  if (genre) {
    artists = artists.filter(a => a.genre.toLowerCase() === genre.toLowerCase());
  }
  
  return c.json({ artists });
});

app.post("/api/artists", async (c) => {
  const body = await c.req.json();
  const newArtist = {
    ...body,
    id: mockData.artists.length + 1,
    createdAt: new Date().toISOString()
  };
  return c.json(newArtist, 201);
});

app.put("/api/artists/:id", async (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const artist = mockData.artists.find(a => a.id === id);
  
  if (!artist) {
    return c.json({ error: "Artist not found" }, 404);
  }
  
  const body = await c.req.json();
  const updatedArtist = { ...artist, ...body };
  return c.json(updatedArtist);
});

app.delete("/api/artists/:id", (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const artist = mockData.artists.find(a => a.id === id);
  
  if (!artist) {
    return c.json({ error: "Artist not found" }, 404);
  }
  
  return c.json({ message: "Artist deleted successfully" });
});

// Albums routes
app.get("/api/albums", (c) => {
  const artistId = c.req.query("artistId");
  const year = c.req.query("year");
  let albums = [...mockData.albums];
  
  if (artistId) {
    albums = albums.filter(a => a.artistId === Number.parseInt(artistId));
  }
  
  if (year) {
    albums = albums.filter(a => a.releaseYear === Number.parseInt(year));
  }
  
  return c.json({ albums });
});

app.post("/api/albums", async (c) => {
  const body = await c.req.json();
  const newAlbum = {
    ...body,
    id: mockData.albums.length + 1,
    createdAt: new Date().toISOString()
  };
  return c.json(newAlbum, 201);
});

app.put("/api/albums/:id", async (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const album = mockData.albums.find(a => a.id === id);
  
  if (!album) {
    return c.json({ error: "Album not found" }, 404);
  }
  
  const body = await c.req.json();
  const updatedAlbum = { ...album, ...body };
  return c.json(updatedAlbum);
});

app.delete("/api/albums/:id", (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const album = mockData.albums.find(a => a.id === id);
  
  if (!album) {
    return c.json({ error: "Album not found" }, 404);
  }
  
  return c.json({ message: "Album deleted successfully" });
});

// Songs routes
app.get("/api/songs", (c) => {
  const albumId = c.req.query("albumId");
  let songs = [...mockData.songs];
  
  if (albumId) {
    songs = songs.filter(s => s.albumId === Number.parseInt(albumId));
  }
  
  return c.json({ songs });
});

app.post("/api/songs", async (c) => {
  const body = await c.req.json();
  const newSong = {
    ...body,
    id: mockData.songs.length + 1,
    createdAt: new Date().toISOString(),
    audioUrl: `https://example.com/audio/${mockData.songs.length + 1}.mp3`
  };
  return c.json(newSong, 201);
});

app.put("/api/songs/:id", async (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const song = mockData.songs.find(s => s.id === id);
  
  if (!song) {
    return c.json({ error: "Song not found" }, 404);
  }
  
  const body = await c.req.json();
  const updatedSong = { ...song, ...body };
  return c.json(updatedSong);
});

app.delete("/api/songs/:id", (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const song = mockData.songs.find(s => s.id === id);
  
  if (!song) {
    return c.json({ error: "Song not found" }, 404);
  }
  
  return c.json({ message: "Song deleted successfully" });
});

// File upload route
app.post("/api/songs/:id/audio", async (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const song = mockData.songs.find(s => s.id === id);
  
  if (!song) {
    return c.json({ error: "Song not found" }, 404);
  }
  
  // Mock file upload - in reality you'd handle the multipart form data
  return c.json({
    message: "Audio file uploaded successfully",
    audioUrl: `https://example.com/audio/${id}.mp3`
  });
});

// Misc auth routes
app.get("/api/auth/basic", async (c) => {
  const authHeader = c.req.header("Authorization");

  if (authHeader === undefined) {
    return c.text("bad kitty, you didn't even sent a Authorization header!", 401);
  }

  if (!authHeader.startsWith("Basic")) {
    return c.text("bad kitty, the Authorization header needs to be Basic auth!", 401);
  }

  // cat
  return c.body("meow :)");
});

app.get("/api/auth/bearer", async (c) => {
  const authHeader = c.req.header("Authorization");

  if (authHeader === undefined) {
    return c.text("bad doggo, you didn't even sent a Authorization header!", 401);
  }

  if (!authHeader.startsWith("Bearer")) {
    return c.text("bad doggo, the Authorization header needs to be Bearer auth!", 401);
  }

  // dog
  return c.body("woof :)");
});

app.get("/api/auth/key", async (c) => {
  const authHeader = c.req.header("X-API-Key");

  if (authHeader === undefined) {
    return c.text("bad mooer, you didn't even sent a X-API-Key header!", 401);
  }

  // cow
  return c.body("moo :)");
});

app.get("/api/auth/google", async (c) => {
  // sheep
  return c.body("baa :)");
});

// Misc method routes
app.get("/api/methods/get", async (c) => {
  return c.body("OK");
});

app.on("HEAD", "/api/methods/head", async (c) => {
  return c.body("OK");
});

app.options("/api/methods/options", async (c) => {
  return c.body("OK");
});

app.on("TRACE", "/api/methods/trace", async (c) => {
  return c.body("OK");
});

app.put("/api/methods/put", async (c) => {
  return c.body("OK");
});

app.delete("/api/methods/delete", async (c) => {
  return c.body("OK");
});

app.post("/api/methods/post", async (c) => {
  return c.body("OK");
});

app.patch("/api/methods/patch", async (c) => {
  return c.body("OK");
});

app.get("/api/untagged-route", async (c) => {
  return c.body("woah how did u find me im untagged");
});

app.use(
  "/fp/*",
  async (c, next) => {
    const apiKey = c.env.FP_API_KEY;
    return createFiberplane({
      debug: true,
      openapi: { url: "/openapi.json" },
      apiKey,
      // @ts-expect-error - TODO: fix this in the middleware
    })(c, next)
  }
);

// export default instrument(app);
export default app;
