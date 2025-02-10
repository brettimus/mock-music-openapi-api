export const apiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Music Library API",
    description: "API for managing a music library with artists, albums, and songs",
    version: "1.0.0"
  },
  tags: [
    {
      name: "Artists",
      description: "Operations about artists"
    },
    {
      name: "Albums",
      description: "Operations about albums"
    },
    {
      name: "Songs",
      description: "Operations about songs"
    }
  ],
  // servers: [
  //   {
  //     url: "http://localhost:8787",
  //     description: "Local server"
  //   }
  // ],
  paths: {
    "/api/artists": {
      get: {
        tags: ["Artists"],
        summary: "List artists",
        description: "Retrieve a paginated list of artists. Can be filtered by genre to find artists of a specific musical style.",
        parameters: [
          {
            name: "genre",
            in: "query",
            description: "Filter artists by genre",
            required: false,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "List of artists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    artists: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Artist"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Artists"],
        summary: "Create a new artist",
        description: "Add a new artist to the music library with their basic information and biography.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewArtist"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Artist created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Artist"
                }
              }
            }
          }
        }
      }
    },
    "/api/albums": {
      get: {
        tags: ["Albums"],
        summary: "List albums",
        description: "Retrieve a list of albums. Can be filtered by artist ID or release year.",
        parameters: [
          {
            name: "artistId",
            in: "query",
            description: "Filter albums by artist ID",
            required: false,
            schema: {
              type: "integer"
            }
          },
          {
            name: "year",
            in: "query",
            description: "Filter albums by release year",
            required: false,
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          "200": {
            description: "List of albums",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    albums: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Album"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Albums"],
        summary: "Create a new album",
        description: "Add a new album to the library, associated with an existing artist.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewAlbum"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Album created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Album"
                }
              }
            }
          }
        }
      }
    },
    "/api/songs": {
      get: {
        tags: ["Songs"],
        summary: "List songs",
        description: "Retrieve a list of songs. Can be filtered by album ID to get all songs from a specific album.",
        parameters: [
          {
            name: "albumId",
            in: "query",
            description: "Filter songs by album ID",
            required: false,
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          "200": {
            description: "List of songs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    songs: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Song"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Songs"],
        summary: "Create a new song",
        description: "Add a new song to the library, must be associated with an existing album.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewSong"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Song created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Song"
                }
              }
            }
          }
        }
      }
    },
    "/api/songs/{id}/audio": {
      post: {
        tags: ["Songs"],
        summary: "Upload song audio file",
        description: "Upload an audio file (MP3, WAV) for an existing song. Will replace any existing audio file.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the song",
            schema: {
              type: "integer"
            },
            example: 123
          }
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "Audio file (MP3, WAV, etc.)"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Audio file uploaded successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Audio file uploaded successfully"
                    },
                    audioUrl: {
                      type: "string",
                      example: "https://example.com/audio/123.mp3"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/artists/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID of the artist",
          schema: {
            type: "integer"
          },
          example: 134
        }
      ],
      put: {
        tags: ["Artists"],
        summary: "Update an artist",
        description: "Modify an existing artist's information. All fields in the request will override existing values.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewArtist"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Artist updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Artist"
                }
              }
            }
          },
          "404": {
            description: "Artist not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Artists"],
        summary: "Delete an artist",
        description: "Remove an artist from the library. This will not delete their albums or songs.",
        responses: {
          "200": {
            description: "Artist deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Artist deleted successfully"
                    }
                  }
                }
              }
            }
          },
          "404": {
            description: "Artist not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },
    "/api/albums/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID of the album",
          schema: {
            type: "integer"
          },
          example: 1
        }
      ],
      put: {
        tags: ["Albums"],
        summary: "Update an album",
        description: "Modify an existing album's information. The artist association cannot be changed.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewAlbum"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Album updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Album"
                }
              }
            }
          },
          "404": {
            description: "Album not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Albums"],
        summary: "Delete an album",
        description: "Remove an album from the library. This will also delete all songs associated with the album.",
        responses: {
          "200": {
            description: "Album deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Album deleted successfully"
                    }
                  }
                }
              }
            }
          },
          "404": {
            description: "Album not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },
    "/api/songs/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID of the song",
          schema: {
            type: "integer"
          },
          example: 456
        }
      ],
      put: {
        tags: ["Songs"],
        summary: "Update a song",
        description: "Modify an existing song's information. The album association cannot be changed.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewSong"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Song updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Song"
                }
              }
            }
          },
          "404": {
            description: "Song not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Songs"],
        summary: "Delete a song",
        description: "Remove a song from the library. This will also delete any associated audio files.",
        responses: {
          "200": {
            description: "Song deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Song deleted successfully"
                    }
                  }
                }
              }
            }
          },
          "404": {
            description: "Song not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/basic": {
      get: {
        tags: ["Misc"],
        summary: "Basic Auth route",
        description: "Route with Basic Authentication",
        security: {
          BasicAuth: []
        },
        responses: {
          "200": {
            description: "OK"
          },
          "401": {
            description: "No Basic Auth header provided"
          }
        }
      }
    },
    "/api/auth/bearer": {
      get: {
        tags: ["Misc"],
        summary: "Bearer Auth route",
        description: "Route with Bearer Authentication",
        security: {
          BearerAuth: []
        },
        responses: {
          "200": {
            description: "OK"
          },
          "401": {
            description: "No Bearer Auth header provided"
          }
        }
      }
    },
    "/api/auth/key": {
      get: {
        tags: ["Misc"],
        summary: "API Key Auth route",
        description: "Route with API Key Authentication",
        security: {
          ApiKeyAuth: []
        },
        responses: {
          "200": {
            description: "OK"
          },
          "401": {
            description: "No API Key header provided"
          }
        }
      }
    },
    "/api/auth/google": {
      get: {
        tags: ["Misc"],
        summary: "Google Auth route",
        description: "Route with Google OpenIdConnect Authentication",
        security: {
          GoogleOpenIdAuth: ["read"]
        },
        responses: {
          "200": {
            description: "OK"
          }
        }
      }
    }
  },
  components: {
    securitySchemas: {
      BasicAuth: {
        type: "http",
        scheme: "basic"
      },
      BearerAuth: {
        type: "http",
        scheme: "bearer"
      },
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key"
      },
      GoogleOpenIdAuth: {
        type: "openIdConnect",
        openIdConnectUrl: "https://accounts.google.com/.well-known/openid-configuration"
      }
    },
    schemas: {
      NewArtist: {
        type: "object",
        required: ["name", "genre"],
        properties: {
          name: {
            type: "string",
            example: "The Beatles"
          },
          genre: {
            type: "string",
            example: "Rock"
          },
          country: {
            type: "string",
            example: "United Kingdom"
          },
          biography: {
            type: "string"
          }
        }
      },
      Artist: {
        allOf: [
          { $ref: "#/components/schemas/NewArtist" },
          {
            type: "object",
            required: ["id", "createdAt"],
            properties: {
              id: {
                type: "integer",
                example: 1
              },
              createdAt: {
                type: "string",
                format: "date-time"
              }
            }
          }
        ]
      },
      NewAlbum: {
        type: "object",
        required: ["title", "artistId", "releaseYear"],
        properties: {
          title: {
            type: "string",
            example: "Abbey Road"
          },
          artistId: {
            type: "integer",
            example: 1
          },
          releaseYear: {
            type: "integer",
            example: 1969
          },
          genre: {
            type: "string",
            example: "Rock"
          }
        }
      },
      Album: {
        allOf: [
          { $ref: "#/components/schemas/NewAlbum" },
          {
            type: "object",
            required: ["id", "createdAt"],
            properties: {
              id: {
                type: "integer",
                example: 1
              },
              createdAt: {
                type: "string",
                format: "date-time"
              }
            }
          }
        ]
      },
      NewSong: {
        type: "object",
        required: ["title", "albumId", "duration"],
        properties: {
          title: {
            type: "string",
            example: "Come Together"
          },
          albumId: {
            type: "integer",
            example: 1
          },
          duration: {
            type: "integer",
            description: "Duration in seconds",
            example: 259
          },
          trackNumber: {
            type: "integer",
            example: 1
          }
        }
      },
      Song: {
        allOf: [
          { $ref: "#/components/schemas/NewSong" },
          {
            type: "object",
            required: ["id", "createdAt"],
            properties: {
              id: {
                type: "integer",
                example: 1
              },
              createdAt: {
                type: "string",
                format: "date-time"
              },
              audioUrl: {
                type: "string",
                example: "https://example.com/audio/123.mp3"
              }
            }
          }
        ]
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Resource not found"
          }
        }
      }
    }
  }
} as const;

export default apiSpec; 