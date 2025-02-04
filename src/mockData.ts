export const mockData = {
  artists: [
    {
      id: 1,
      name: "The Beatles",
      genre: "Rock",
      country: "United Kingdom",
      biography: "The most influential band of all time",
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Queen",
      genre: "Rock",
      country: "United Kingdom",
      biography: "Legendary rock band",
      createdAt: "2024-01-02T00:00:00Z"
    }
  ],
  albums: [
    {
      id: 1,
      title: "Abbey Road",
      artistId: 1,
      releaseYear: 1969,
      genre: "Rock",
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      title: "A Night at the Opera",
      artistId: 2,
      releaseYear: 1975,
      genre: "Rock",
      createdAt: "2024-01-02T00:00:00Z"
    }
  ],
  songs: [
    {
      id: 1,
      title: "Come Together",
      albumId: 1,
      duration: 259,
      trackNumber: 1,
      createdAt: "2024-01-01T00:00:00Z",
      audioUrl: "https://example.com/audio/1.mp3"
    },
    {
      id: 2,
      title: "Bohemian Rhapsody",
      albumId: 2,
      duration: 354,
      trackNumber: 1,
      createdAt: "2024-01-02T00:00:00Z",
      audioUrl: "https://example.com/audio/2.mp3"
    }
  ]
}; 